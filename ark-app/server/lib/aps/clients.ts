import { AuthenticationClient } from "@aps_sdk/authentication";
import { SdkManagerBuilder } from "@aps_sdk/autodesk-sdkmanager";
import { OssClient } from "@aps_sdk/oss";

const sdkManager = SdkManagerBuilder.create().build();
const auth = new AuthenticationClient(sdkManager);
const oss = new OssClient(sdkManager);

const bucketName = "ark-storage";

export { auth, oss, bucketName };
