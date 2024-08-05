import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";
import { createProject as createSpeckleProject } from "~/server/lib/speckle";

type CreateProjectInput = typeof projects.$inferInsert & {
  speckleAuth?: {
    accessToken: string;
    refreshToken: string;
  };
};

export async function createProject(data: CreateProjectInput) {
  if (data.speckleAuth) {
    const { accessToken } = data.speckleAuth;
    const speckleProjectId = await createSpeckleProject({
      accessToken,
    });
    data.speckleId = speckleProjectId;
  }

  const project = (await db.insert(projects).values(data).returning())[0];
  return project;
}
