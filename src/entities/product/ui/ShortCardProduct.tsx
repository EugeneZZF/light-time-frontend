import Link from "next/link";
import { Product } from "@/entities/product/model/types";

interface ShortCardProductProps {
  product: Product;
}

function formatPrice(value: string) {
  const numericPrice = Number(value);

  if (!Number.isFinite(numericPrice)) {
    return value;
  }

  return numericPrice.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ShortCardProduct({ product }: ShortCardProductProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const imageUrl = product.img[0]?.url ? `${baseUrl}${product.img[0].url}` : "";
  const price =
    product.discount.hasDiscount && product.discount.new_price
      ? product.discount.new_price
      : product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex  w-[236px]  gap-[10px] border border-[#f3e5e5]
        bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] 
        transition hover:shadow-[0_8px_22px_rgba(0,0,0,0.16)] 
         hover:shadow-[0px_0px_10px_0px_rgba(255,0,0,0.2)] "
    >
      <img
        src={imageUrl}
        alt={product.title}
        className="h-[110px] w-auto absolute "
      />

      <div
        className="bg-[linear-gradient(to_left,_#fff_90%,_rgba(255,255,255,0)_100%)]
       h-[110px] flex flex-col 
      w-[128px]  ml-[95px] pt-[10px] pl-[5px] relative"
      >
        <h3
          className=" ml-[10px] line-clamp-3 text-[16px]
        leading-[1.18] text-[#333333]"
        >
          {product.title}
        </h3>

        <p
          className="text-[18px] flex gap-[5px] font-bold leading-none
         text-black absolute bottom-[5px] right-0"
        >
          {formatPrice(price)} <p className="font-normal">₽ </p>
        </p>
      </div>
    </Link>
  );
}
