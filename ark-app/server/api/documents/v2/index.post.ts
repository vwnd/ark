import { z, useValidatedBody } from "h3-zod";
import { createDocument } from "~/server/lib";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const { name, projectId, key } = await useValidatedBody(
    event,
    z.object({
      name: z.string(),
      key: z.string(),
      projectId: z.coerce.number(),
    })
  );

  const session = await getServerSession(event);

  if (!session || !session.user) {
    return createError({
      statusCode: 401,
      message: "Unauthorized.",
    });
  }

  await createDocument({
    name,
    projectId,
    createdBy: session.uid,
    key,
  });
});
