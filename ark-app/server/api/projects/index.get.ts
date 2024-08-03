import { getServerSession } from "#auth";
import { getProjectsPage } from "~/server/lib/projects";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized.",
    });
  }

  return await getProjectsPage(session.uid);
});
