import { eq } from "drizzle-orm";
import { documents } from "~/server/database/schema";
import { uploadFile, getSignedURL } from "~/server/lib/storage";
import {
  revitToSpeckle,
  uploadFile as uploadFileToAPS,
} from "~/server/services/aps";
import { db } from "~/server/database/drizzle";
import { rhinoToSpeckle } from "~/server/lib/rhino";

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
  // handle upload
  // fixed projecid
  const projectId = 1;
  const autoSync = true;

  const formData = await readFormData(event);

  const file = formData.get("file") as File;

  //if more than 50mb throw error
  if (file.size > 50 * 1024 * 1024) throw new Error("File too large");

  const extension = file.name.slice(file.name.lastIndexOf(".") + 1);

  if (!extension || !["rvt", "3dm"].includes(extension))
    throw new Error("Invalid file type");

  const existingDocument = await db.query.documents.findFirst({
    where: eq(documents.name, file.name),
  });

  let version = 1;
  if (existingDocument) {
    version = existingDocument.version + 1;
  }

  const document = (
    await db
      .insert(documents)
      .values({
        projectId,
        name: file.name,
        type: extension,
        status: "progress",
        version,
      })
      .returning()
  )[0];

  let urn;
  if (extension === "rvt") {
    urn = await uploadRevit(file, `${projectId}/${document.id}`);
  } else if (extension === "3dm") {
    urn = await uploadRhino(file, `${projectId}/${document.id}`);
  }

  if (!urn) throw new Error("Failed to upload file");

  await db.update(documents).set({ urn }).where(eq(documents.id, document.id));

  if (autoSync) {
    if (extension === "rvt") {
      triggerRevitJob(urn);
    } else if (extension === "3dm") {
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
