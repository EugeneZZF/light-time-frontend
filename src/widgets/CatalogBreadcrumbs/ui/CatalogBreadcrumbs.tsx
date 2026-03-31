"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/entities/category/model/types";
import { Product } from "@/entities/product/model/types";

interface CatalogBreadcrumbsProps {
  categories: Category[];
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
  const pathname = usePathname() ?? "";
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const activeCategorySlug = searchParams.get("categorySlug") ?? null;
  const { items } = resolveBreadcrumbState(categories, activeCategorySlug);
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
        const product = extractProducts(data).find(
          (item) => item.slug === productSlug,
        );

        if (!isActive || !product) {
          return;
        }

        setProductState({
          title: product.title,
          categories: [
            product.categories.main
              ? {
                  href: (() => {
                    const slug = findCategorySlugById(
                      categories,
                      product.categories.main?.id,
                    );

                    return slug ? `/catalog?categorySlug=${slug}` : undefined;
                  })(),
                  label: product.categories.main.name,
                }
              : null,
            product.categories.subA
              ? {
                  href: (() => {
                    const slug = findCategorySlugById(
                      categories,
                      product.categories.subA?.id,
                    );

                    return slug ? `/catalog?categorySlug=${slug}` : undefined;
                  })(),
                  label: product.categories.subA.name,
                }
              : null,
            product.categories.subB
              ? {
                  href: (() => {
                    const slug = findCategorySlugById(
                      categories,
                      product.categories.subB?.id,
                    );

                    return slug ? `/catalog?categorySlug=${slug}` : undefined;
                  })(),
                  label: product.categories.subB.name,
                }
              : null,
          ].filter(Boolean) as BreadcrumbItem[],
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
  }, [categories, productSlug]);

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
        <Link href="/" className="transition hover:text-[#ff3333]">
          Главная
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <Link href="/catalog" className="transition hover:text-[#ff3333]">
          Каталог
        </Link>
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
