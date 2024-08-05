import { z } from "h3-zod";

const createProjectMutation = `
  mutation CreateProject($input: ProjectCreateInput) {
    projectMutations {
      create(input: $input) {
        id
      }
    }
  }
`;

export async function createProject(data: {
  accessToken: string;
  name: string;
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  description?: string;
}): Promise<string> {
  const { accessToken, name, visibility = "PRIVATE", description } = data;

  const response = await fetch("https://app.speckle.systems/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: createProjectMutation,
      variables: {
        input: {
          name,
          visibility,
          description,
        },
      },
    }),
  });

  const json = await response.json();

  if (json.errors || !json.data || !json.data.projectMutations.create.id) {
    console.log(json);
    throw new Error("Failed to create Speckle project");
  }

  const id = z.string().parse(json.data.projectMutations.create.id);

  return id;
}
