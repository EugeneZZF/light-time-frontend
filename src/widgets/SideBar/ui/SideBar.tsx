"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import SideBarLink from "./SideBarLink";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";

interface SideBarProps {
  categories: Category[];
  products: Record<string, string>;
}

export function SideBar({ categories, products }: SideBarProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const searchCategorySlug = searchParams?.get("categorySlug") ?? null;

  const productSlug = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return null;
    }

    return pathname.split("/product/")[1] ?? null;
  }, [pathname]);

  const [resolvedProduct, setResolvedProduct] =
    useState<CatalogProductLookupItem | null>(null);

  useEffect(() => {
    if (!productSlug || products[productSlug]) {
      setResolvedProduct(null);
      return;
    }

    let isCancelled = false;

    const loadProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/catalog/products/${productSlug}`);

        if (!response.ok) {
          return;
        }

        const product = (await response.json()) as CatalogProductLookupItem;

        if (!isCancelled) {
          setResolvedProduct(product);
        }
      } catch {
        if (!isCancelled) {
          setResolvedProduct(null);
        }
      }
    };

    void loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [baseUrl, productSlug, products]);

  const resolvedProductCategorySlug = productSlug
    ? (products[productSlug] ??
      resolvedProduct?.categories.subB?.slug ??
      resolvedProduct?.categories.subA?.slug ??
      resolvedProduct?.categories.main?.slug ??
      null)
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
