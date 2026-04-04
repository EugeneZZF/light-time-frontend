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

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const CATEGORIES_REVALIDATE_SECONDS = 60 * 60;

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/categories/tree`, {
      next: {
        revalidate: CATEGORIES_REVALIDATE_SECONDS,
        tags: ["categories"],
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  revalidate: CATEGORIES_REVALIDATE_SECONDS,
  tags: ["categories"],
});
