import { auth } from "./clients";

export async function getTwoLeggedToken() {
  const clientId = process.env.APS_CLIENT_ID!;
  const clientSecret = process.env.APS_CLIENT_SECRET!;

  const response = await auth.getTwoLeggedToken(clientId, clientSecret, [
    "bucket:create",
    "bucket:read",
    "data:create",
    "data:write",
    "data:read",
  ]);

  console.debug(response.access_token);

  const token = response.access_token;

  if (!token) {
    throw new Error("Failed to get access token");
  }

  return token;
}
