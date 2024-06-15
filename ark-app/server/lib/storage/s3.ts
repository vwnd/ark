import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.S3_ACCESS_KEY_ID ||
  !process.env.S3_SECRET_ACCESS_KEY ||
  !process.env.S3_REGION
)
  throw new Error("Missing S3 credentials");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

const bucketName = "ark-file-storage";

export { s3, bucketName };
