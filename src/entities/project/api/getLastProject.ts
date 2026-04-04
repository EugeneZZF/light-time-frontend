import { Project } from "@/entities/project/model/types";

const LAST_PROJECT_REVALIDATE_SECONDS = 3 * 60 * 60;

export const getLastProject: () => Promise<Project | null> = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  try {
    const response = await fetch(`${baseUrl}/api/projects/latest`, {
      next: { revalidate: LAST_PROJECT_REVALIDATE_SECONDS },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as Project;
  } catch (error) {
    throw new Error(`Failed to fetch latest project: ${error}`);
  }
};
