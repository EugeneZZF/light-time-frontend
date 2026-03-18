import Link from "next/link";
import { Product } from "@/entities/product/model/types";

export default function SmallCardProduct({ product }: { product: Product }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <Link href={`/product/${product.slug}`}>
      <div
        className="w-[245px] h-[180px] bg-[#f5f5f5] bg-cover bg-center
        shadow-[0px_0px_10px_rgba(0,0,0,0.2)] 
        border border-transparent
        hover:border-[rgba(255,51,51,0.1)]
        hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]
        transition cursor-pointer"
        style={{
          backgroundImage: `url(${baseUrl}${product.img[0].url})`,
        }}
      >
        <div className="flex items-end relative w-full h-full pl-[10px] pr-[10px] pb-[5px] justify-between">
          <p className="w-[145px] text-[14px] text-[#333333]">
            {product.title}
          </p>
          {/* #ff0000; */}
          <div className="flex flex-col leading-[18px] gap-[5px]">
            {product.discount.hasDiscount ? (
              <p className="text-[18px] font-black font-bold text-[#ff0000]">
                {product.discount.new_price} ₽
              </p>
            ) : null}
            <p
              className={` ${product.discount.hasDiscount ? "line-through underline" : ""}text-[18px] font-black font-bold`}
            >
              {product.price} ₽
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
