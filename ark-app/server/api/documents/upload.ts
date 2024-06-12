import { eq } from "drizzle-orm";
import { documents } from "~/server/database/schema";
import { uploadFile } from "~/server/services/storage";
import {
  revitToSpeckle,
  uploadFile as uploadFileToAPS,
} from "~/server/services/aps";
import { db } from "~/server/database/drizzle";

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

async function triggerRhinoJob(file: File) {
  const url = process.env.RHINO_COMPUTE_HOST || "http://localhost:6500/";
  const apiKey = process.env.RHINO_COMPUTE_KEY || "";

  const version = "8.0";
  const endpoint = "speckle-converter/converttospeckle-string";

  const arglist = [];

  const filebase64 = await file.arrayBuffer().then((buffer) => {
    return Buffer.from(buffer).toString("base64");
  });

  arglist.push(filebase64);

  try {
    let request = {
      method: "POST",
      body: JSON.stringify(arglist),
      headers: {
        "User-Agent": `compute.rhino3d.js/${version}`,
        RhinoComputeKey: apiKey,
      },
    };

    let p = fetch(url + endpoint, request);
    const json = p.then((r) => r.json());

    return json;
  } catch (error) {
    console.log(error);
  }
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

  const document = (
    await db
      .insert(documents)
      .values({
        projectId,
        name: file.name,
        type: extension,
        status: "progress",
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
      triggerRhinoJob(file);
    }
  }

  await db
    .update(documents)
    .set({ status: "done" })
    .where(eq(documents.id, document.id));
});
