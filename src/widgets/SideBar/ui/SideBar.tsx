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

function findCategorySlugById(
  categories: Category[],
  categoryId: number | null | undefined,
): string | null {
  if (!categoryId) {
    return null;
  }

  for (const category of categories) {
    if (category.id === categoryId) {
      return category.slug;
    }

    const nestedCategories = [
      ...(category.subcategoriesA ?? []),
      ...(category.SubcategoriesA ?? []),
      ...(category.subcategoriesB ?? []),
      ...(category.SubcategoriesB ?? []),
    ];
    const nestedSlug = findCategorySlugById(nestedCategories, categoryId);

    if (nestedSlug) {
      return nestedSlug;
    }
  }

  return null;
}

function resolveProductCategorySlug(
  categories: Category[],
  product: CatalogProductLookupItem,
): string | null {
  return (
    findCategorySlugById(categories, product.categories.subB?.id) ??
    findCategorySlugById(categories, product.categories.subA?.id) ??
    findCategorySlugById(categories, product.categories.main?.id)
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

    return product ? resolveProductCategorySlug(categories, product) : null;
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
