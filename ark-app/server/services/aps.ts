import { SdkManager, SdkManagerBuilder } from "@aps_sdk/autodesk-sdkmanager";
import { AuthenticationClient } from "@aps_sdk/authentication";
import { OssClient } from "@aps_sdk/oss";
import * as fs from "fs";
import * as path from "path";

const sdkManager = SdkManagerBuilder.create().build();
const authenticationClient = new AuthenticationClient(sdkManager);
const ossClient = new OssClient(sdkManager);

const bucketkey = "ark-storage";

async function getTwoLeggedToken() {
  const clientId = process.env.APS_CLIENT_ID!;
  const clientSecret = process.env.APS_CLIENT_SECRET!;

  const response = await authenticationClient.getTwoLeggedToken(
    clientId,
    clientSecret,
    ["bucket:create", "bucket:read", "data:create", "data:write", "data:read"]
  );

  console.debug(response.access_token);

  const token = response.access_token;

  if (!token) {
    throw new Error("Failed to get access token");
  }

  return token;
}

export async function uploadFile(objectKey: string, file: File) {
  // save file to tmp folder
  const randomTmpKey = Math.random().toString(36).substring(7);
  const tempFilePath = path.join(process.cwd(), "tmp", randomTmpKey);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const access_token = await getTwoLeggedToken();
    const response = await ossClient.upload(
      bucketkey,
      objectKey,
      tempFilePath,
      access_token
    );
    console.debug(response);
    return response.objectId;
  } catch (error) {
  } finally {
    fs.unlinkSync(tempFilePath);
  }
}
