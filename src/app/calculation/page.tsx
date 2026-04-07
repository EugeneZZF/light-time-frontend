import { getCategories } from "@/entities/category/api/getCategoryes";
import { getProductsByQuery } from "@/entities/product/api/getProductQuery";
import CalculationPage from "@/features/calculate/ui/CalculationPage";

export default async function CalculationRoute() {
  const [products, categories] = await Promise.all([
    getProductsByQuery({ limit: 1000 }),
    getCategories(),
  ]);

  return <CalculationPage products={products} categories={categories} />;
}
