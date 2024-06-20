import { z, useValidatedBody } from "h3-zod";
import {
  createDocument,
  getSignedURL,
  revitToSpeckle,
  rhinoToSpeckle,
} from "~/server/lib";
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

  const document = await createDocument({
    name,
    projectId,
    createdBy: session.uid,
    key,
  });
  console.log("Document created", document);

  if (!document.urn) return;

  const signedDownloadURL = await getSignedURL(document.urn);

  console.log("Triggering job", document.type);
  if (document.type === "rvt") {
    revitToSpeckle(signedDownloadURL);
  } else if (document.type === "3dm") {
    rhinoToSpeckle({
      ark: {
        document: document.id,
      },
      rhino: {
        model: signedDownloadURL,
      },
      speckle: {
        model: "ark/rhino",
        project: "f97a0b4c05",
        token: process.env.SPECKLE_BOT_TOKEN || "",
      },
    });
  }

  setResponseStatus(event, 201);
});
