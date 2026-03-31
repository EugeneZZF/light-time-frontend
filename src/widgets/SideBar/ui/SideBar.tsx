"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import { Product } from "@/entities/product/model/types";
import SideBarLink from "./SideBarLink";

interface SideBarProps {
  categories: Category[];
}

type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
    };

function extractProducts(data: ProductQueryResponse): Product[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.products)) {
    return data.products;
  }

  return [];
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
  product: Product,
): string | null {
  return (
    findCategorySlugById(categories, product.categories.subB?.id) ??
    findCategorySlugById(categories, product.categories.subA?.id) ??
    findCategorySlugById(categories, product.categories.main?.id)
  );
}

export function SideBar({ categories }: SideBarProps) {
  const pathname = usePathname() ?? "";
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const searchCategorySlug = searchParams.get("categorySlug") ?? null;
  const [resolvedProductCategorySlug, setResolvedProductCategorySlug] =
    useState<string | null>(null);

  const productSlug = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return null;
    }

    return pathname.split("/product/")[1] ?? null;
  }, [pathname]);

  useEffect(() => {
    if (!productSlug) {
      return;
    }

    let isActive = true;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/catalog/products?limit=1000`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data: ProductQueryResponse) => {
        if (!isActive) {
          return;
        }

        const product = extractProducts(data).find(
          (item) => item.slug === productSlug,
        );

        setResolvedProductCategorySlug(
          product ? resolveProductCategorySlug(categories, product) : null,
        );
      })
      .catch(() => {
        if (isActive) {
          setResolvedProductCategorySlug(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [categories, productSlug]);

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
