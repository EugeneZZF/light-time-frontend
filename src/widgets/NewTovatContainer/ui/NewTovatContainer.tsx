import InfoSection from "./InfoSection";
import NewestTovar from "./NewestTovar";
import { getProducts } from "@/entities/product/api/getProductLasted";
import { getLatestNews } from "@/shared/api/news";

export async function NewTovatContainer() {
  const products = await getProducts();
  const news = await getLatestNews(2);

  // console.log("news:", news);

  return (
    <div className="mb-[50px]">
      <NewestTovar products={products}></NewestTovar>
      <InfoSection news={news}></InfoSection>
    </div>
  );
}
