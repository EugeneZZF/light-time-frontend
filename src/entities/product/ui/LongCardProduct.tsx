import Link from "next/link";
import { Product } from "../model/types";

interface LongCardProductProps {
  item: Product;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

function getDisplayPrice(item: Product) {
  return item.discount.hasDiscount && item.discount.new_price
    ? item.discount.new_price
    : item.price;
}

export default function LongCardProduct({ item }: LongCardProductProps) {
  const imageUrl = item.img[0]?.url ? `${baseUrl}${item.img[0].url}` : "";
  const displayPrice = Number(getDisplayPrice(item));
  const description =
    item.description || item.categories.main?.name || item.sku;

  return (
    <Link
      href={`/product/${item.slug}`}
      className="flex h-[110px]  gap-[18px] border border-[#ebebeb] bg-white
         shadow-[0_3px_14px_rgba(0,0,0,0.10)]
        transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] relative"
    >
      <img
        src={imageUrl}
        alt={item.title}
        className="h-[110px] w-auto absolute "
      />

      <div
        className="bg-[linear-gradient(to_left,_#fff_91%,_rgba(255,255,255,0)_100%)]  
      w-[510px] z-10 h-[110px] ml-[100px] flex flex-1 flex-col justify-between"
      >
        <div className="ml-[30px] mt-[10px]">
          <h3 className="line-clamp-2 text-[18px] font-bold leading-[1.15] text-[#1c1c1c]">
            {item.title}
          </h3>
          <p className="mt-[12px]  w-[510px] line-clamp-2 text-[15px] leading-[1.25] text-[#222222]">
            {description}
          </p>
        </div>

        <div className="mt-[10px] flex gap-[5px] absolute right-[10px] bottom-[10px] text-right text-[18px] font-bold leading-none ">
          {Number.isFinite(displayPrice)
            ? displayPrice.toLocaleString("ru-RU", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : getDisplayPrice(item)}{" "}
          <p className="font-normal">₽ </p>
        </div>
      </div>
    </Link>
  );
}
