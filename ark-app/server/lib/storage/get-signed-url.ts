import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "./s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getSignedURL(
  key: string,
  operation: "get" | "put" = "get"
) {
  let command: GetObjectCommand | PutObjectCommand;

  switch (operation) {
    case "get":
      command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      break;
    case "put":
      command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      break;
    default:
      command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      break;
  }

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
}
