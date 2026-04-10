import type { Brand } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const requestUrl =
    typeof window === "undefined"
      ? `${baseUrl}/api/catalog/brands/${encodeURIComponent(slug)}`
      : `/api/catalog/brands/${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(requestUrl, {
      next: { revalidate: 60 * 60 },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.status}`);
    }

    return (await response.json()) as Brand;
  } catch {
    return null;
  }
}
