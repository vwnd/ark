import { db } from "~/db/drizzle";
import { documents } from "~/db/schema";

export default defineEventHandler(async (event) => {
  // handle upload
  // fixed projecid
  const projectId = 1;

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

  console.log(document);
  return "foo";
});
