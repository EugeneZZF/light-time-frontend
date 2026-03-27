import { getProductsByQuery } from "@/entities/product/api/getProductQuery";
import CalculationPage from "@/features/calculate/ui/CalculationPage";

export default async function CalculationRoute() {
  const products = await getProductsByQuery({ limit: 1000 });

  return <CalculationPage products={products} />;
}
