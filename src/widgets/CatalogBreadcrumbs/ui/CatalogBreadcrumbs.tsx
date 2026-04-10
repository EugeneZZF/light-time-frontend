"use client";

import { getBrandBySlug } from "@/entities/brand";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";
import { BreadcrumbItem } from "@/shared/lib/catalog/lookups";
import { useResolvedCatalogProduct } from "@/shared/lib/catalog/useResolvedCatalogProduct";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Palka from "./Palka";

interface CatalogBreadcrumbsProps {
  categoryBreadcrumbsBySlug: Record<string, BreadcrumbItem[]>;
  productsBySlug: Record<string, CatalogProductLookupItem>;
}

type ProductBreadcrumbState = {
  title?: string;
  categories: BreadcrumbItem[];
};

type BrandTitleState = {
  slug: string;
  title: string | null;
};

export default function CatalogBreadcrumbs({
  categoryBreadcrumbsBySlug,
  productsBySlug,
}: CatalogBreadcrumbsProps) {
  const params = useParams<{ brandSlug?: string }>();
  const searchParams = useSearchParams();
  const brandSlug =
    typeof params?.brandSlug === "string" ? params.brandSlug : null;
  const activeCategorySlug = searchParams?.get("categorySlug") ?? null;
  const items = activeCategorySlug
    ? (categoryBreadcrumbsBySlug[activeCategorySlug] ?? [])
    : [];
  const [brandState, setBrandState] = useState<BrandTitleState | null>(null);
  const { productSlug, lookupItem: productFromLookup, resolvedProduct } =
    useResolvedCatalogProduct({
      lookupBySlug: productsBySlug,
    });

  const product = productFromLookup ?? resolvedProduct;
  const productState: ProductBreadcrumbState = product
    ? {
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
      }
    : { categories: [] };

  useEffect(() => {
    let isMounted = true;

    if (!brandSlug || productSlug) {
      return () => {
        isMounted = false;
      };
    }

    const activeBrandSlug = brandSlug;

    async function loadBrand() {
      const brand = await getBrandBySlug(activeBrandSlug);

      if (isMounted) {
        setBrandState({
          slug: activeBrandSlug,
          title: brand?.name ?? null,
        });
      }
    }

    void loadBrand();

    return () => {
      isMounted = false;
    };
  }, [brandSlug, productSlug]);

  const title = productSlug
    ? (productState.title ?? "")
    : brandSlug
      ? (brandState?.slug === brandSlug ? brandState.title : "")
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
        <Palka />
        <Link href="/catalog" className="transition hover:text-[#ff3333]">
          Каталог
        </Link>
        {visibleCategories.map((item, index) => (
          <span key={`${item.label}-${index}`} className="contents">
            <Palka />
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
