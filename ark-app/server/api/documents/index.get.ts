import { db } from "~/server/database/drizzle";

export default defineEventHandler(async (event) => {
  return db.query.documents.findMany({ with: { user: true } });
});
