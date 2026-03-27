import { Project } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProjectQueryResponse =
  | Project[]
  | {
      items?: Project[];
      projects?: Project[];
      data?: Project[];
    };

function extractProjects(data: ProjectQueryResponse): Project[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.projects)) {
    return data.projects;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(`${baseUrl}/api/projects?limit=1000`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: ProjectQueryResponse = await response.json();
  const projects = extractProjects(data);

  return projects.find((project) => project.slug === slug) ?? null;
}
