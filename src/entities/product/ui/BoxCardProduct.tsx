import Link from "next/link";
import { Product } from "../model/types";
import { baseUrl } from "@/entities/category/api/getCategoryes";

interface BoxCardProductProps {
  item: any;
}

export default function BoxCardProduct({ item }: BoxCardProductProps) {
  return (
    <Link
      href={item.productUrl}
      className="hover:shadow-[0_0_10px_rgba(255,0,0,0.2)] shadow-[0_0_10px_rgba(0,0,0,0.2)]"
    >
      <div
        className="w-[180px] h-[180px] flex items-end relative overflow-hidden"
        // style={{ backgroundImage: `url(${baseUrl}${item.imageUrl})` }}
      >
        {item.imageUrl ? (
          <img
            src={`${baseUrl}${item.imageUrl}`}
            className="absolute z-0 w-full h-auto  mb-[30px]"
          />
        ) : null}
        <div className="z-10 flex justify-between w-full items-end p-[10px]">
          <p className="text-[14px] text-[#333333] w-[81px] leading-[14px] line-clamp-3">
            {item.name}
          </p>
          <p className="text-[#000000] text-[18px] font-bold">
            {item.price} <span className="font-normal">₽</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
