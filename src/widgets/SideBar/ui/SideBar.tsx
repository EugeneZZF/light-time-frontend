"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import SideBarLink from "./SideBarLink";

interface SideBarProps {
  categories: Category[];
  products: Record<string, string>;
}

export function SideBar({ categories, products }: SideBarProps) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const searchCategorySlug = searchParams?.get("categorySlug") ?? null;

  const productSlug = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return null;
    }

    return pathname.split("/product/")[1] ?? null;
  }, [pathname]);

  const resolvedProductCategorySlug = productSlug
    ? (products[productSlug] ?? null)
    : null;

  const activeCategorySlug =
    searchCategorySlug ?? (productSlug ? resolvedProductCategorySlug : null);

  return (
    <div className="mx-[40px] h-auto w-[250px] flex-none flex flex-col">
      {categories.map((categ) => (
        <SideBarLink
          key={categ.slug}
          category={categ}
          activeCategorySlug={activeCategorySlug}
        />
      ))}
    </div>
  );
}
