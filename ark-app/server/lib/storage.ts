import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { Readable } from "stream";

const streamPipeline = promisify(pipeline);

if (
  !process.env.S3_ACCESS_KEY_ID ||
  !process.env.S3_SECRET_ACCESS_KEY ||
  !process.env.S3_REGION
)
  throw new Error("Missing S3 credentials");

const s3Client: S3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

const bucketName: string = "ark-file-storage";

export async function uploadFile(
  buffer: Buffer,
  name: string,
  mimeType: string
) {
  console.debug(`FILE: ${name}, MIME: ${mimeType}, SIZE: ${buffer.length}`);
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: name,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return name;
  } catch (error) {
    throw new Error("Failed to upload file");
  }
}

export async function downloadFile(urn: string, bucketName: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: urn,
    });
    const response = await s3Client.send(command);

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

export async function getSignedURL(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return url;
}
