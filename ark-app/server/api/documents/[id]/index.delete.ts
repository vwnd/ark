import { eq } from "drizzle-orm";
import { db } from "~/server/database/drizzle";
import { documents } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing document id.",
    });
  }

  try {
    await db.delete(documents).where(eq(documents.id, id));
    setResponseStatus(event, 204);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong.",
    });
  }
});
