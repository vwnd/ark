import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";

type CreateProjectInput = typeof projects.$inferInsert;

export async function createProject(data: CreateProjectInput) {
  const project = (await db.insert(projects).values(data).returning())[0];
  return project;
}
