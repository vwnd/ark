import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export async function downloadFile(urn: string, bucketName: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: urn,
    });
    const response = await s3.send(command);

    const filePath = path.join(process.cwd(), "downloads", urn);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    const readableStream = new Readable().wrap(response.Body as any);
    const writeStream = fs.createWriteStream(filePath);

    await streamPipeline(readableStream, writeStream);

    console.log(`File downloaded to ${filePath}`);
    return filePath;
  } catch (error) {
    console.log(error);
    throw new Error("Could not download file");
  }
}
