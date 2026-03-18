import SmallCardProduct from "@/entities/product/ui/SmallCardProduct";
import { Product } from "@/entities/product/model/types";
interface NewTovatContainerProps {
  products: Product[];
}

export default function NewTovatContainer({
  products,
}: NewTovatContainerProps) {
  return (
    <div className="w-full  gap-[20px] mb-[40px]">
      <h3 className="text-[22px] mb-[20px] text-[#009e39] font-bold leading-[22px] ml-[50px]">
        Новинки
      </h3>
      <div className="ml-[30px] flex gap-[20px]">
        {products.map((product) => (
          <SmallCardProduct
            key={product.id}
            product={product}
          ></SmallCardProduct>
        ))}
      </div>
    </div>
  );
}
