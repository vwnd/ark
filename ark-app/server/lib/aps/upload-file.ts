import * as fs from "fs";
import * as path from "path";
import { getTwoLeggedToken } from "./get-two-legged-token";
import { bucketName, oss } from "./clients";

export async function uploadFileToAPS(objectKey: string, file: File) {
  // save file to tmp folder
  const randomTmpKey = Math.random().toString(36).substring(7);
  const tempFilePath = path.join(process.cwd(), "tmp", randomTmpKey);

  // ensure tmp folder exists
  if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
    fs.mkdirSync(path.join(process.cwd(), "tmp"));
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const access_token = await getTwoLeggedToken();
    const response = await oss.upload(
      bucketName,
      objectKey,
      tempFilePath,
      access_token
    );
    return response.objectId;
  } catch (error) {
  } finally {
    fs.unlinkSync(tempFilePath);
  }
}
