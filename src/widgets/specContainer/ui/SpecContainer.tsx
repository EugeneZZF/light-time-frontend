import Link from "next/link";
import OurProject from "./OurProject";
import SpecSlider from "./SpecSlider";
import { getProductsByQuery } from "@/entities/product/api/getProductQuery";

export default async function SpecContainer() {
  const productSale = await getProductsByQuery({ discountedOnly: true });

  console.log("Fetched discounted products in SpecContainer:", productSale);

  return (
    <div className="w-full flex ">
      <div className="flex flex-col gap-[15px] ml-[40px]">
        <h3 className="text-[#009e39] ml-[20px] leading-[26.4px] text-[26px] font-bold">
          Наши проекты
        </h3>
        <OurProject></OurProject>
      </div>
      <div className="flex flex-col gap-[15px] ml-[40px]">
        <Link
          href="/"
          className="text-[#ff5800] ml-[5px]
          leading-[26.4px] w-[201px] text-[24px] font-bold border-b-[1px] 
          border-[#FFC1C1] "
        >
          Спецпредложения
        </Link>
        <div className="mr-[0px] ">
          <SpecSlider productSale={productSale}></SpecSlider>
        </div>
      </div>
    </div>
  );
}
