"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";
import { BreadcrumbItem } from "@/shared/lib/catalog/lookups";
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams?.get("categorySlug") ?? null;
  const items = activeCategorySlug
    ? (categoryBreadcrumbsBySlug[activeCategorySlug] ?? [])
    : [];

  const productSlug = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return null;
    }

    return pathname.split("/product/")[1] ?? null;
  }, [pathname]);

  const [resolvedProduct, setResolvedProduct] =
    useState<CatalogProductLookupItem | null>(null);

  useEffect(() => {
    if (!productSlug || productsBySlug[productSlug]) {
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
  }, [baseUrl, productSlug, productsBySlug]);

  const productState = useMemo<ProductBreadcrumbState>(() => {
    if (!productSlug) {
      return { categories: [] };
    }

    const product = productsBySlug[productSlug] ?? resolvedProduct;

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
  }, [productSlug, productsBySlug, resolvedProduct]);

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
