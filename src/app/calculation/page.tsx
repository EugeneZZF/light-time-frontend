import { getCategories } from "@/entities/category/api/getCategoryes";
import { getAllProducts } from "@/entities/product/api/getProductQuery";
import CalculationPage from "@/features/calculate/ui/CalculationPage";

export default async function CalculationRoute() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return <CalculationPage products={products} categories={categories} />;
}
