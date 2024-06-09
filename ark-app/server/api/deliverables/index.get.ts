import { db } from "~/db/drizzle";

export default defineEventHandler(async (event) => {
  return db.query.deliverables.findMany();
});
