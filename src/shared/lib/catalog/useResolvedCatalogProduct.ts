"use client";

import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type UseResolvedCatalogProductOptions<TLookupItem> = {
  lookupBySlug: Record<string, TLookupItem>;
};

type UseResolvedCatalogProductResult<TLookupItem> = {
  productSlug: string | null;
  lookupItem: TLookupItem | null;
  resolvedProduct: CatalogProductLookupItem | null;
};

type FetchedProductState = {
  product: CatalogProductLookupItem | null;
  productSlug: string;
};

const resolvedProductsByKey = new Map<string, CatalogProductLookupItem>();
const pendingProductRequestsByKey = new Map<
  string,
  Promise<CatalogProductLookupItem | null>
>();

function extractProductSlug(pathname: string): string | null {
  if (!pathname.startsWith("/product/")) {
    return null;
  }

  return pathname.split("/product/")[1] ?? null;
}

function getProductRequestKey(baseUrl: string, productSlug: string): string {
  return `${baseUrl}::${productSlug}`;
}

async function fetchResolvedCatalogProduct(
  baseUrl: string,
  productSlug: string,
): Promise<CatalogProductLookupItem | null> {
  const requestKey = getProductRequestKey(baseUrl, productSlug);
  const cachedProduct = resolvedProductsByKey.get(requestKey);

  if (cachedProduct) {
    return cachedProduct;
  }

  const pendingRequest = pendingProductRequestsByKey.get(requestKey);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetch(
    `${baseUrl}/api/catalog/products/${encodeURIComponent(productSlug)}`,
  )
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }

      return (await response.json()) as CatalogProductLookupItem;
    })
    .then((product) => {
      if (product) {
        resolvedProductsByKey.set(requestKey, product);
      }

      pendingProductRequestsByKey.delete(requestKey);
      return product;
    })
    .catch(() => {
      pendingProductRequestsByKey.delete(requestKey);
      return null;
    });

  pendingProductRequestsByKey.set(requestKey, request);

  return request;
}

export function useResolvedCatalogProduct<TLookupItem>({
  lookupBySlug,
}: UseResolvedCatalogProductOptions<TLookupItem>): UseResolvedCatalogProductResult<TLookupItem> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const pathname = usePathname() ?? "";
  const productSlug = extractProductSlug(pathname);
  const lookupItem = productSlug ? (lookupBySlug[productSlug] ?? null) : null;
  const [fetchedProductState, setFetchedProductState] =
    useState<FetchedProductState | null>(null);

  useEffect(() => {
    if (!productSlug || lookupItem) {
      return;
    }

    let isCancelled = false;

    const loadProduct = async () => {
      const product = await fetchResolvedCatalogProduct(baseUrl, productSlug);

      if (!isCancelled) {
        setFetchedProductState({
          product,
          productSlug,
        });
      }
    };

    void loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [baseUrl, lookupItem, productSlug]);

  const resolvedProduct =
    !productSlug || lookupItem || fetchedProductState?.productSlug !== productSlug
      ? null
      : fetchedProductState.product;

  return {
    productSlug,
    lookupItem,
    resolvedProduct,
  };
}
