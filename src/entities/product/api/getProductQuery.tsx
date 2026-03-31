import { unstable_cache } from "next/cache";
import { Product } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
    };

export type GetProductQueryParams = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  q?: string;
  discountedOnly?: boolean;
};

const buildQueryString = (params: GetProductQueryParams = {}) => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page));
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  if (params.categorySlug) {
    searchParams.set("categorySlug", params.categorySlug);
  }

  if (params.brandSlug) {
    searchParams.set("brandSlug", params.brandSlug);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (typeof params.discountedOnly === "boolean") {
    searchParams.set("discountedOnly", String(params.discountedOnly));
  }

  return searchParams.toString();
};

const fetchProductsByQuery = async (
  params: GetProductQueryParams = {},
): Promise<Product[]> => {
  const queryString = buildQueryString(params);
  try {
    const response = await fetch(
      `${baseUrl}/api/catalog/products${queryString ? `?${queryString}` : ""}`,
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: ProductQueryResponse = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    if (Array.isArray(data.products)) {
      return data.products;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const getProductsByQuery = unstable_cache(
  fetchProductsByQuery,
  ["products-query"],
  {
    revalidate: 60 * 60,
    tags: ["products-query"],
  },
);
