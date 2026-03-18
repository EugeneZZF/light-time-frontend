// import { apiClient } from "@/shared/api/client";
import { unstable_cache } from "next/cache";
import { Category } from "../model/types";

// export const getCategories: () => Promise<Category[]> = async () => {
//   try {
//     const response = await apiClient.get(`/api/admin/categories/tree`);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch categories: ${error}`);
//   }
// };

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${baseUrl}/api/admin/categories/tree`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  revalidate: 60 * 60, // 1 hour
  tags: ["categories"],
});
