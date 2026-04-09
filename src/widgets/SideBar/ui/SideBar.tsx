"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import SideBarLink from "./SideBarLink";
import { resolveProductCategorySlug } from "@/shared/lib/catalog/lookups";
import { useResolvedCatalogProduct } from "@/shared/lib/catalog/useResolvedCatalogProduct";

interface SideBarProps {
  categories: Category[];
  products: Record<string, string>;
}

const EMPTY_CATEGORIES: Category[] = [];

function getSubcategoriesA(category: Category): Category[] {
  return category.subcategoriesA ?? category.SubcategoriesA ?? EMPTY_CATEGORIES;
}

function getSubcategoriesB(category: Category): Category[] {
  return category.subcategoriesB ?? category.SubcategoriesB ?? EMPTY_CATEGORIES;
}

function hasActiveDescendant(
  category: Category,
  activeCategorySlug: string | null,
): boolean {
  if (!activeCategorySlug) {
    return false;
  }

  return getSubcategoriesA(category).some((subcategory) => {
    if (subcategory.slug === activeCategorySlug) {
      return true;
    }

    return getSubcategoriesB(subcategory).some(
      (subSubcategory) => subSubcategory.slug === activeCategorySlug,
    );
  });
}

function buildCategoryHref(
  searchParamsString: string,
  categorySlug: string,
  isActive: boolean,
): string {
  const nextParams = new URLSearchParams(searchParamsString);

  if (isActive) {
    nextParams.delete("categorySlug");
  } else {
    nextParams.set("categorySlug", categorySlug);
  }

  const nextSearch = nextParams.toString();

  return `/catalog${nextSearch ? `?${nextSearch}` : ""}`;
}

export function SideBar({ categories, products }: SideBarProps) {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const searchCategorySlug = searchParams?.get("categorySlug") ?? null;
  const { lookupItem: productCategorySlug, resolvedProduct } =
    useResolvedCatalogProduct({
      lookupBySlug: products,
    });

  const resolvedProductCategorySlug =
    productCategorySlug ??
    (resolvedProduct ? resolveProductCategorySlug(resolvedProduct) : null);

  const activeCategorySlug = searchCategorySlug ?? resolvedProductCategorySlug;
  const sidebarItems = useMemo(
    () =>
      categories.map((category) => {
        const subcategories = getSubcategoriesA(category);
        const isActive = activeCategorySlug === category.slug;

        return {
          category,
          subcategories,
          isBranchActive: isActive || hasActiveDescendant(category, activeCategorySlug),
          categoryHref: buildCategoryHref(
            searchParamsString,
            category.slug,
            isActive,
          ),
        };
      }),
    [activeCategorySlug, categories, searchParamsString],
  );

  return (
    <div className="mx-[40px] h-auto w-[250px] flex-none flex flex-col">
      {sidebarItems.map((item) => (
        <SideBarLink
          key={item.category.slug}
          category={item.category}
          subcategories={item.subcategories}
          activeCategorySlug={activeCategorySlug}
          isBranchActive={item.isBranchActive}
          categoryHref={item.categoryHref}
        />
      ))}
    </div>
  );
}
