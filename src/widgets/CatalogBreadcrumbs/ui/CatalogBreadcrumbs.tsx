"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";

interface CatalogBreadcrumbsProps {
  categories: Category[];
  products: CatalogProductLookupItem[];
}

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbState = {
  items: BreadcrumbItem[];
};

type ProductBreadcrumbState = {
  title?: string;
  categories: BreadcrumbItem[];
};

function resolveBreadcrumbState(
  categories: Category[],
  activeCategorySlug: string | null,
): BreadcrumbState {
  if (!activeCategorySlug) {
    return { items: [] };
  }

  for (const category of categories) {
    if (category.slug === activeCategorySlug) {
      return {
        items: [
          {
            href: `/catalog?categorySlug=${category.slug}`,
            label: category.name,
          },
        ],
      };
    }

    const subcategories =
      category.subcategoriesA ?? category.SubcategoriesA ?? [];
    const matchedSubcategory = subcategories.find(
      (subcategory) => subcategory.slug === activeCategorySlug,
    );

    if (matchedSubcategory) {
      return {
        items: [
          {
            href: `/catalog?categorySlug=${category.slug}`,
            label: category.name,
          },
          {
            href: `/catalog?categorySlug=${matchedSubcategory.slug}`,
            label: matchedSubcategory.name,
          },
        ],
      };
    }
  }

  return { items: [] };
}

export default function CatalogBreadcrumbs({
  categories,
  products,
}: CatalogBreadcrumbsProps) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams?.get("categorySlug") ?? null;
  const { items } = resolveBreadcrumbState(categories, activeCategorySlug);

  const productSlug = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return null;
    }

    return pathname.split("/product/")[1] ?? null;
  }, [pathname]);

  const productState = useMemo<ProductBreadcrumbState>(() => {
    if (!productSlug) {
      return { categories: [] };
    }

    const product = products.find((item) => item.slug === productSlug);

    if (!product) {
      return { categories: [] };
    }

    return {
      title: product.title,
      categories: [
        product.categories.main
          ? {
              href: `/catalog?categorySlug=${product.categories.main.slug}`,
              label: product.categories.main.name,
            }
          : null,
        product.categories.subA
          ? {
              href: `/catalog?categorySlug=${product.categories.subA.slug}`,
              label: product.categories.subA.name,
            }
          : null,
        product.categories.subB
          ? {
              href: `/catalog?categorySlug=${product.categories.subB.slug}`,
              label: product.categories.subB.name,
            }
          : null,
      ].filter(Boolean) as BreadcrumbItem[],
    };
  }, [categories, productSlug, products]);

  const title = productSlug
    ? (productState.title ?? "")
    : (items[items.length - 1]?.label ?? "Каталог продукции");
  const visibleCategories = productSlug ? productState.categories : items;

  return (
    <div className="mb-8 ml-[20px] flex flex-col gap-3">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[14px] text-[#7f7f7f]"
      >
        <Link href="/" className="transition hover:text-[#ff3333]">Главная</Link>
        <span className="text-[#c9c9c9]">/</span>
        <Link href="/catalog" className="transition hover:text-[#ff3333]">Каталог</Link>
        {visibleCategories.map((item, index) => (
          <span key={`${item.label}-${index}`} className="contents">
            <span className="text-[#c9c9c9]">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-[#ff3333]"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      {title ? (
        <h1 className="text-[28px] font-bold leading-[1.15] text-[#009e39]">
          {title}
        </h1>
      ) : null}
    </div>
  );
}


