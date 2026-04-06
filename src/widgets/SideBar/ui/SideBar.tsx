"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";
import SideBarLink from "./SideBarLink";

interface SideBarProps {
  categories: Category[];
  products: CatalogProductLookupItem[];
}

function resolveProductCategorySlug(product: CatalogProductLookupItem): string | null {
  return (
    product.categories.subB?.slug ??
    product.categories.subA?.slug ??
    product.categories.main?.slug ??
    null
  );
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

  const resolvedProductCategorySlug = useMemo(() => {
    if (!productSlug) {
      return null;
    }

    const product = products.find((item) => item.slug === productSlug);

    return product ? resolveProductCategorySlug(product) : null;
  }, [categories, productSlug, products]);

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

