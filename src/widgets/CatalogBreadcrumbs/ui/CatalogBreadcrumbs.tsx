"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Category } from "@/entities/category/model/types";
import { Product } from "@/entities/product/model/types";

interface CatalogBreadcrumbsProps {
  categories: Category[];
}

type BreadcrumbState = {
  categoryName?: string;
  subcategoryName?: string;
};

type ProductBreadcrumbState = {
  title?: string;
  categories: string[];
};

type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
    };

function resolveBreadcrumbState(
  categories: Category[],
  activeCategorySlug: string | null,
): BreadcrumbState {
  if (!activeCategorySlug) {
    return {};
  }

  for (const category of categories) {
    if (category.slug === activeCategorySlug) {
      return { categoryName: category.name };
    }

    const subcategories =
      category.subcategoriesA ?? category.SubcategoriesA ?? [];
    const matchedSubcategory = subcategories.find(
      (subcategory) => subcategory.slug === activeCategorySlug,
    );

    if (matchedSubcategory) {
      return {
        categoryName: category.name,
        subcategoryName: matchedSubcategory.name,
      };
    }
  }

  return {};
}

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

export default function CatalogBreadcrumbs({
  categories,
}: CatalogBreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("categorySlug");
  const { categoryName, subcategoryName } = resolveBreadcrumbState(
    categories,
    activeCategorySlug,
  );
  const [productState, setProductState] = useState<ProductBreadcrumbState>({
    categories: [],
  });

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

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/catalog/products?limit=1000`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data: ProductQueryResponse) => {
        const product = extractProducts(data).find(
          (item) => item.slug === productSlug,
        );

        if (!isActive || !product) {
          return;
        }

        setProductState({
          title: product.title,
          categories: [
            product.categories.main?.name,
            product.categories.subA?.name,
            product.categories.subB?.name,
          ].filter(Boolean) as string[],
        });
      })
      .catch(() => {
        if (isActive) {
          setProductState({ categories: [] });
        }
      });

    return () => {
      isActive = false;
    };
  }, [productSlug]);

  const title = productSlug
    ? productState.title ?? ""
    : subcategoryName ?? categoryName ?? "Каталог продукции";
  const visibleCategories = productSlug
    ? productState.categories
    : [categoryName, subcategoryName].filter(Boolean);

  return (
    <div className="mb-8 ml-[20px] flex flex-col gap-3">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[14px] text-[#7f7f7f]"
      >
        <Link href="/" className="transition hover:text-[#ff3333]">
          Главная
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <Link href="/catalog" className="transition hover:text-[#ff3333]">
          Каталог
        </Link>
        {visibleCategories.map((item, index) => (
          <span key={`${item}-${index}`} className="contents">
            <span className="text-[#c9c9c9]">/</span>
            <span>{item}</span>
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
