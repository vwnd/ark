import { db } from "~/server/database/drizzle";

export default defineEventHandler(async (event) => {
  return db.query.deliverables.findMany();
});
