import { asc, gt } from "drizzle-orm";
import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";

export async function getProjectPage(cursor?: number, pageSize = 3) {
  const projectsPage = await db
    .select()
    .from(projects)
    .where(cursor ? gt(projects.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(projects.id));

  return projectsPage;
}
