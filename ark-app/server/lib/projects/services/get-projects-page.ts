import { asc, eq, gt, and } from "drizzle-orm";
import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";

export async function getProjectsPage(
  ownerId: string,
  cursor?: number,
  pageSize = 5
) {
  const projectsPage = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.createdBy, ownerId),
        cursor ? gt(projects.id, cursor) : undefined
      )
    )
    .limit(pageSize)
    .orderBy(asc(projects.id));

  return projectsPage;
}
