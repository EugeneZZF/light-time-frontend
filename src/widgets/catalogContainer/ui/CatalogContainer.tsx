import { getCategories } from "@/entities/category/api/getCategoryes";
import CatalogContainerClient from "./CatalogContainerClient";

export default async function CatalogContainer() {
  const categories = await getCategories();

  return <CatalogContainerClient categories={categories} />;
}
