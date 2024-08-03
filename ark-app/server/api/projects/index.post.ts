import { useValidatedBody, z } from "h3-zod";
import { createProject } from "~/server/lib/projects";

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  access: z.enum(["private", "link-shareable", "discoverable"]),
  speckleId: z.string().optional(),
  speckleToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const data = await useValidatedBody(event, schema);
    await createProject(data);
    return {
      message: "Project created successfully.",
      error: null,
    };
    console.log("Project created successfully.");
  } catch (error) {
    return {
      message: "Failed to create project.",
      error: error,
    };
  }
});
