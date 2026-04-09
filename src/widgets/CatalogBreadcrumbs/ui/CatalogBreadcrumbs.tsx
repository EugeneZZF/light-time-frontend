"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";
import { BreadcrumbItem } from "@/shared/lib/catalog/lookups";
import { useResolvedCatalogProduct } from "@/shared/lib/catalog/useResolvedCatalogProduct";
import Palka from "./Palka";

interface CatalogBreadcrumbsProps {
  categoryBreadcrumbsBySlug: Record<string, BreadcrumbItem[]>;
  productsBySlug: Record<string, CatalogProductLookupItem>;
}

type ProductBreadcrumbState = {
  title?: string;
  categories: BreadcrumbItem[];
};

export default function CatalogBreadcrumbs({
  categoryBreadcrumbsBySlug,
  productsBySlug,
}: CatalogBreadcrumbsProps) {
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams?.get("categorySlug") ?? null;
  const items = activeCategorySlug
    ? (categoryBreadcrumbsBySlug[activeCategorySlug] ?? [])
    : [];
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
        {/* <span className="text-[#c9c9c9]">/</span> */}
        <Palka />
        <Link href="/catalog" className="transition hover:text-[#ff3333]">
          Каталог
        </Link>
        {visibleCategories.map((item, index) => (
          <span key={`${item.label}-${index}`} className="contents">
            {/* <span className="text-[#c9c9c9]">/</span> */}
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
