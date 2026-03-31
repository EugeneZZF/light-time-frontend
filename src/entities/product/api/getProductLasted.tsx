// import { apiClient } from "@/shared/api/client";
import { unstable_cache } from "next/cache";
import { Product } from "../model/types";

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

const fetchProducts = async (limit: number = 4): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/catalog/products/latest?limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    console.log("Fetched products:", await response.clone().json());
    return response.json();
  } catch (error) {
    console.error("Failed to fetch latest products:", error);
    return [];
  }
};

export const getProducts = unstable_cache(fetchProducts, ["products"], {
  revalidate: 60 * 60, // 1 hour
  tags: ["products"],
});
