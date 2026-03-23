"use client";

import { useMemo, useState } from "react";
import { Product } from "@/entities/product/model/types";
import LongCardProduct from "@/entities/product/ui/LongCardProduct";
import ShortCardProduct from "@/entities/product/ui/ShortCardProduct";

interface CatalogProductContainerProps {
  products: Product[];
}

type SortMode = "popularity" | "price";
type ViewMode = "short" | "long";
type PriceSortDirection = "asc" | "desc";

function getProductPrice(product: Product) {
  const rawPrice =
    product.discount.hasDiscount && product.discount.new_price
      ? product.discount.new_price
      : product.price;
  const normalizedPrice = rawPrice
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "");
  const numericPrice = Number(normalizedPrice);

  return Number.isFinite(numericPrice) ? numericPrice : Number.MAX_SAFE_INTEGER;
}

function GridIcon() {
  return (
    <span className="grid h-[12px] scale-[1.1] w-[12px] grid-cols-2 gap-[2px]">
      <span className="bg-[#666666]" />
      <span className="bg-[#666666]" />
      <span className="bg-[#666666]" />
      <span className="bg-[#666666]" />
    </span>
  );
}

function ListIcon() {
  return (
    <span className="flex scale-[1.1] h-[12px] w-[12px] flex-col justify-between">
      <span className="h-[2px] w-full bg-[#666666]" />
      <span className="h-[2px] w-full bg-[#666666]" />
      <span className="h-[2px] w-full bg-[#666666]" />
    </span>
  );
}

export function CatalogProductContainer({
  products,
}: CatalogProductContainerProps) {
  const [sortMode, setSortMode] = useState<SortMode>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("short");
  const [priceSortDirection, setPriceSortDirection] =
    useState<PriceSortDirection>("asc");

  const visibleProducts = useMemo(() => {
    if (sortMode !== "price") {
      return products;
    }

    return [...products].sort((left, right) => {
      const diff = getProductPrice(left) - getProductPrice(right);
      return priceSortDirection === "asc" ? diff : -diff;
    });
  }, [priceSortDirection, products, sortMode]);

  const handlePopularitySort = () => {
    setSortMode("popularity");
  };

  const handlePriceSort = () => {
    if (sortMode !== "price") {
      setSortMode("price");
      setPriceSortDirection("asc");
      return;
    }

    setPriceSortDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  return (
    <section className="w-full">
      <div className="mb-[15px] flex items-center justify-between  ">
        <div className="flex flex-wrap items-center gap-x-[26px] gap-y-[8px] text-[16px] leading-none text-[#1c1c1c]">
          <span>Сортировать по:</span>
          <button
            type="button"
            onClick={handlePopularitySort}
            className={`border-b pb-[2px] transition ${
              sortMode === "popularity"
                ? "border-[#c7b58a] text-[#1b1b1b]"
                : "border-transparent text-[#1b1b1b]"
            }`}
          >
            популярности
          </button>
          <button
            type="button"
            onClick={handlePriceSort}
            className={`border-b pb-[2px] transition ${
              sortMode === "price"
                ? "border-[#c7b58a] text-[#1b1b1b]"
                : "border-transparent text-[#1b1b1b]"
            }`}
          >
            цене
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            setViewMode((current) => (current === "short" ? "long" : "short"))
          }
          className="flex items-center gap-[10px] text-[16px] leading-none text-[#333333]"
        >
          {viewMode === "short" ? <ListIcon /> : <GridIcon />}
          <span>{viewMode === "short" ? "Подробно" : "Кратко"}</span>
        </button>
      </div>

      {viewMode === "short" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-[18px]">
          {visibleProducts.map((product) => (
            <ShortCardProduct key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {visibleProducts.map((product) => (
            <LongCardProduct key={product.id} item={product} />
          ))}
        </div>
      )}
    </section>
  );
}
