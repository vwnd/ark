import { getServerSession } from "#auth";
import { useValidatedBody, z } from "h3-zod";
import { createProject } from "~/server/lib/projects";

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  access: z.enum(["private", "link-shareable", "discoverable"]),
  speckleId: z.string().optional(),
  speckleToken: z.string().optional(),
});

const speckleAuthSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const cookie = getCookie(event, "speckle-auth");
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: "Missing Speckle Auth cookie.",
    });
  }

  const speckleAuth = speckleAuthSchema.parse(JSON.parse(cookie));

  try {
    const data = await useValidatedBody(event, schema);
    await createProject({ ...data, speckleAuth, createdBy: session.uid });
    return {
      message: "Project created successfully.",
      error: null,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create project.",
      data: error,
    });
  }
});
