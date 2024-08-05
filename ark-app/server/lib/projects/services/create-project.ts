import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";
import { createProject as createSpeckleProject } from "~/server/lib/speckle";

type CreateProjectInput = typeof projects.$inferInsert & {
  speckle?: {
    accessToken: string;
    refreshToken: string;
    visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  };
};

export async function createProject(data: CreateProjectInput) {
  const { name, description } = data;
  if (data.speckle) {
    const { accessToken } = data.speckle;
    const speckleProjectId = await createSpeckleProject({
      accessToken,
      name: data.name,
      description: data.description || undefined,
    });
    data.speckleId = speckleProjectId;
  }

  const project = (await db.insert(projects).values(data).returning())[0];
  return project;
}
