import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "./s3";

export async function uploadFile(
  buffer: Buffer,
  name: string,
  mimeType: string
) {
  console.debug(`FILE: ${name}, MIME: ${mimeType}, SIZE: ${buffer.length}`);
  try {
    await s3.send(
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
