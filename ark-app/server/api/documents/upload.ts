import { eq } from "drizzle-orm";
import { db } from "~/db/drizzle";
import { documents } from "~/db/schema";
import { uploadFile } from "~/server/services/storage";
import { uploadFile as uploadFileToAPS } from "~/server/services/aps";

async function uploadRhino(file: File, key: string) {
  const arrayBuffer = await file.arrayBuffer();
  return await uploadFile(Buffer.from(arrayBuffer), key, file.type);
}

async function uploadRevit(file: File, key: string) {
  return uploadFileToAPS(key, file);
}

async function triggerRevitJob(urn: string) {
  // return this.apsService.revitToSpeckle(urn);
}

async function triggerRhinoJob(urn: string) {
  // download model from s3 save on disk
  // hit compute
  // handle rhino
}

export default defineEventHandler(async (event) => {
  // handle upload
  // fixed projecid
  const projectId = 1;
  const autoSync = false;

  const formData = await readFormData(event);

  const file = formData.get("file") as File;

  const extension = file.name.slice(file.name.lastIndexOf(".") + 1);

  if (!extension || !["rvt", "3dm"].includes(extension))
    throw new Error("Invalid file type");

  const document = (
    await db
      .insert(documents)
      .values({
        projectId,
        name: file.name,
        type: extension,
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
      triggerRhinoJob(urn);
    }
  }
});
