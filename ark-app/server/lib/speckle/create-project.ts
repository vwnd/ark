import { z } from "h3-zod";

const createProjectMutation = `
  mutation CreateProject {
    projectMutations {
      create {
        id
      }
    }
  }
`;

export async function createProject(data: {
  accessToken: string;
}): Promise<string> {
  const response = await fetch("https://app.speckle.systems/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
    body: JSON.stringify({
      query: createProjectMutation,
    }),
  });

  const json = await response.json();

  if (json.errors || !json.data || !json.data.projectMutations.create.id) {
    throw new Error("Failed to create Speckle project");
  }

  const id = z.string().parse(json.data.projectMutations.create.id);

  return id;
}
