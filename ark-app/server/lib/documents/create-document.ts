import { eq } from "drizzle-orm";
import { db } from "~/server/database/drizzle";
import { documents, users } from "~/server/database/schema";

type CreateDocumentInput = {
  projectId: number;
  name: string;
  createdBy: string;
};

export async function createDocument({
  name,
  projectId,
  createdBy,
}: CreateDocumentInput) {
  // Check extension
  const extension = name.slice(name.lastIndexOf(".") + 1);

  if (!extension || !["rvt", "3dm"].includes(extension))
    throw new Error("File extension not supported");

  // Check if the user exists
  const owner = await db.query.users.findFirst({
    where: eq(users.id, createdBy),
  });

  if (!owner) throw new Error("User not found");

  // Check if the document already exists
  let version = 1;
  const existingDocument = await db.query.documents.findFirst({
    where: eq(documents.name, name),
  });

  if (existingDocument) {
    version = existingDocument.version + 1;
  }

  return (
    await db
      .insert(documents)
      .values({
        projectId,
        name,
        type: extension,
        status: "created",
        version,
        createdBy: owner.id,
      })
      .returning()
  )[0];
}
