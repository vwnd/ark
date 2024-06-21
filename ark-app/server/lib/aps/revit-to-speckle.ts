import axios from "axios";
import { getTwoLeggedToken } from "./get-two-legged-token";

export async function revitToSpeckle(revitFileObjectKey: string) {
  const access_token = await getTwoLeggedToken();
  const activity = {
    activityId: "Ark.ArkActivity+test",
    arguments: {
      rvtFile: {
        url: revitFileObjectKey,
        verb: "get",
      },
    },
  };

  try {
    const response = await axios.post(
      "https://developer.api.autodesk.com/da/us-east/v3/workitems",
      JSON.stringify(activity),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log("revit.to.speckle:", response.status, response.data);
  } catch (error) {
    console.error(error);
  }
}
