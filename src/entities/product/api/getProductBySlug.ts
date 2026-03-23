import { Product } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
    };

function extractProducts(data: ProductQueryResponse): Product[] {
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${baseUrl}/api/catalog/products?limit=1000`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: ProductQueryResponse = await response.json();
  const products = extractProducts(data);

  return products.find((product) => product.slug === slug) ?? null;
}
