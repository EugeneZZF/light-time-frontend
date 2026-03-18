import { getNewsLatest } from "@/entities/news/api/getNewsLatest";
import InfoSection from "./InfoSection";
import NewestTovar from "./NewestTovar";
import { getProducts } from "@/entities/product/api/getProductLasted";

export async function NewTovatContainer() {
  const products = await getProducts();
  const news = await getNewsLatest(2);

  console.log("news:", news);

  return (
    <div className="mb-[50px]">
      <NewestTovar products={products}></NewestTovar>
      <InfoSection news={news}></InfoSection>
    </div>
  );
}
