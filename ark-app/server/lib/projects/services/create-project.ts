import { db } from "~/server/database/drizzle";
import { projects } from "~/server/database/schema";

type CreateProjectInput = typeof projects.$inferInsert & {
  speckleAuth?: {
    accessToken: string;
    refreshToken: string;
  };
};

export async function createProject(data: CreateProjectInput) {
  if (data.speckleAuth) {
    console.log("Creating speckle project...");
    const speckleProjectId = "speckle-project-id";
    data.speckleId = speckleProjectId;
  }

  const project = (await db.insert(projects).values(data).returning())[0];
  return project;
}
