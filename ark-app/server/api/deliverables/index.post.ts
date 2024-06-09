import { db } from "~/db/drizzle";
import { deliverables, documents } from "~/db/schema";
import { uploadFile } from "~/server/services/storage";
import { v4 as uuid } from "uuid";

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const file = formData.get("file");

  if (!file || !(file instanceof File)) return;

  const fileName = file.name;
  const fileType = file.type;

  const id = uuid();

  const key = await uploadFile(
    Buffer.from(await file.arrayBuffer()),
    `deliverables/${id}`,
    fileType
  );

  const result = await db
    .insert(deliverables)
    .values({
      name: fileName,
      type: fileType,
      key: key,
      documentId: "088c9277-f2d3-4fa9-98be-4893270bf56b",
      id: id,
    })
    .returning();

  return result[0];
});
