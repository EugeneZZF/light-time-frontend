// import axios from "axios";
import { apiClient } from "@/shared/api/client";
import { Project } from "@/entities/project/types";

export const getLastProject: () => Promise<Project> = async () => {
  try {
    const response = await apiClient.get(`/api/projects/latest`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch project with id ${error}`);
  }
};
