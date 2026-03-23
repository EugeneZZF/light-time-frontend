"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import { baseUrl } from "@/entities/category/api/getCategoryes";

interface BigCardCatalogCategoryProps {
  item: Category;
}

export default function BigCardCatalogCategory({
  item,
}: BigCardCatalogCategoryProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParams = new URLSearchParams(searchParams.toString());

  nextParams.set("categorySlug", item.slug);

  return (
    <Link
      href={`${pathname}?${nextParams.toString()}`}
      className="block w-[363px] h-[250px] border border-[#e8e8e8] pr-[20px] transition  hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="flex h-full">
        <div className="min-w-[110px]">
          <img
            className="h-auto w-[110px] object-cover"
            src={`${baseUrl}${item.imageUrl}`}
            alt={item.name}
          />
        </div>
        <div className="ml-[15px] pt-[20px]">
          <h3 className="text-[#009e39] font-bold text-[22px] leading-[26.4px]">
            {item.name}
          </h3>
          <p className="mt-[5px] text-[14px] text-[#000000] line-clamp-5">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
