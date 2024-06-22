import { generateUniqueId, getSignedURL } from "~/server/lib";
import { useValidatedQuery, z } from "h3-zod";

export default defineEventHandler(async (event) => {
  const { projectId, extension } = await useValidatedQuery(
    event,
    z.object({
      projectId: z.coerce.bigint(),
      extension: z.enum(["rvt", "3dm"]),
    })
  );

  const id = generateUniqueId();

  const uploadKey = `${projectId}/documents/${id}.${extension}`;
  const uploadUrl = await getSignedURL(uploadKey, "put");

  return {
    key: uploadKey,
    url: uploadUrl,
  };
});
