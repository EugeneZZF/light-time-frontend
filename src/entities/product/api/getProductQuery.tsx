import { unstable_cache } from "next/cache";
import { Product } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const PRODUCTS_REVALIDATE_SECONDS = 60 * 10;

export type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };

export type GetProductQueryParams = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  q?: string;
  discountedOnly?: boolean;
};

export type CatalogProductLookupItem = Pick<
  Product,
  "slug" | "title" | "categories"
>;

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

export function extractProducts(data: ProductQueryResponse): Product[] {
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
}

function extractTotalPages(data: ProductQueryResponse): number {
  if (
    !Array.isArray(data) &&
    typeof data.totalPages === "number" &&
    Number.isFinite(data.totalPages)
  ) {
    return data.totalPages;
  }

  return 1;
}

const fetchProductsResponse = async (
  params: GetProductQueryParams = {},
): Promise<ProductQueryResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(
    `${baseUrl}/api/catalog/products${queryString ? `?${queryString}` : ""}`,
    {
      next: {
        revalidate: PRODUCTS_REVALIDATE_SECONDS,
        tags: ["products", "products-query"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as ProductQueryResponse;
};

const fetchProductsByQuery = async (
  params: GetProductQueryParams = {},
): Promise<Product[]> => {
  try {
    const data = await fetchProductsResponse(params);
    return extractProducts(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const firstPage = await fetchProductsResponse({ page: 1, limit: 100 });
    const allProducts = extractProducts(firstPage);
    const totalPages = extractTotalPages(firstPage);

    if (totalPages <= 1) {
      return allProducts;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        fetchProductsResponse({
          page: index + 2,
          limit: 100,
        }),
      ),
    );

    return allProducts.concat(
      ...remainingPages.map((pageResponse) => extractProducts(pageResponse)),
    );
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
};

export const getProductsByQuery = unstable_cache(
  fetchProductsByQuery,
  ["products-query"],
  {
    revalidate: PRODUCTS_REVALIDATE_SECONDS,
    tags: ["products", "products-query"],
  },
);

export const getAllProducts = unstable_cache(
  fetchAllProducts,
  ["products-all"],
  {
    revalidate: PRODUCTS_REVALIDATE_SECONDS,
    tags: ["products", "products-all"],
  },
);
