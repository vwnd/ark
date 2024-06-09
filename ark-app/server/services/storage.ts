import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
    console.error(error);
  }
}
