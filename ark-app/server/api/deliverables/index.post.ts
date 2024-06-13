import { deliverables } from "~/server/database/schema";
import { uploadFile } from "~/server/lib/storage";
import { v4 as uuid } from "uuid";
import { db } from "~/server/database/drizzle";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  console.log("formData", formData);
  const file = formData![0];

  if (!file) return "no file found";

  const id = uuid();
  const fileName = file.filename || "deliverables";
  const fileType = file.type!;

  const key = await uploadFile(file.data, `deliverables/${id}`, fileType);

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

  return key;
});
