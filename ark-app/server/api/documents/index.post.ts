import { eq } from "drizzle-orm";
import { documents } from "~/server/database/schema";
import {
  uploadFile,
  getSignedURL,
  rhinoToSpeckle,
  uploadFileToAPS,
  revitToSpeckle,
  createDocument,
} from "~/server/lib/";
import { db } from "~/server/database/drizzle";
import { getServerSession } from "#auth";

async function uploadRhino(file: File, key: string) {
  const arrayBuffer = await file.arrayBuffer();
  return await uploadFile(Buffer.from(arrayBuffer), key, file.type);
}

async function uploadRevit(file: File, key: string) {
  return uploadFileToAPS(key, file);
}

async function triggerRevitJob(urn: string) {
  return revitToSpeckle(urn);
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session || !session.user) {
    return createError({
      statusCode: 401,
      message: "Unauthorized.",
    });
  }

  const userId = session.uid;

  // handle upload
  // fixed projecid
  const projectId = 1;
  const autoSync = true;

  const formData = await readFormData(event);

  const file = formData.get("file") as File;

  //if more than 50mb throw error
  if (file.size > 50 * 1024 * 1024) throw new Error("File too large");

  const document = await createDocument({
    name: file.name,
    projectId,
    createdBy: userId,
  });

  let urn;
  if (document.type === "rvt") {
    urn = await uploadRevit(file, `${projectId}/${document.id}`);
  } else if (document.type === "3dm") {
    urn = await uploadRhino(file, `${projectId}/${document.id}`);
  }

  if (!urn) throw new Error("Failed to upload file");

  await db.update(documents).set({ urn }).where(eq(documents.id, document.id));

  if (autoSync) {
    if (document.type === "rvt") {
      triggerRevitJob(urn);
    } else if (document.type === "3dm") {
      const modelURL = await getSignedURL(urn);
      rhinoToSpeckle({
        ark: {
          document: document.id,
        },
        rhino: {
          model: modelURL,
        },
        speckle: {
          model: "ark/rhino",
          project: "f97a0b4c05",
          token: process.env.SPECKLE_BOT_TOKEN || "",
        },
      });
    }
  }

  await db
    .update(documents)
    .set({ status: "pending" })
    .where(eq(documents.id, document.id));
});
