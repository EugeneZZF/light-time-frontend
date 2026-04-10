import type { Brand } from "../model/types";

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch("/api/catalog/brands");

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    return (await response.json()) as Brand[];
  } catch {
    return [];
  }
}
