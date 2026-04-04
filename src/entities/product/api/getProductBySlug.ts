import { getAllProducts } from "./getProductQuery";
import { Product } from "../model/types";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();

  return products.find((product) => product.slug === slug) ?? null;
}
