import { Product } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${baseUrl}/api/catalog/products/${slug}`, {
      next: { revalidate: 60 * 10 },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error(`Failed to fetch product "${slug}":`, error);
    return null;
  }
}
