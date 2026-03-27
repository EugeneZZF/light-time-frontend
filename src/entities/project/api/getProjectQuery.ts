import { unstable_cache } from "next/cache";
import { Project } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type ProjectQueryResponse =
  | Project[]
  | {
      items?: Project[];
      projects?: Project[];
      data?: Project[];
    };

export type GetProjectQueryParams = {
  page?: number;
  limit?: number;
  q?: string;
};

const buildQueryString = (params: GetProjectQueryParams = {}) => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page));
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  return searchParams.toString();
};

const fetchProjectsByQuery = async (
  params: GetProjectQueryParams = {},
): Promise<Project[]> => {
  const queryString = buildQueryString(params);
  const response = await fetch(
    `${baseUrl}/api/projects${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: ProjectQueryResponse = await response.json();

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
};

export const getProjectsByQuery = unstable_cache(
  fetchProjectsByQuery,
  ["projects-query"],
  {
    revalidate: 60 * 60,
    tags: ["projects-query"],
  },
);
