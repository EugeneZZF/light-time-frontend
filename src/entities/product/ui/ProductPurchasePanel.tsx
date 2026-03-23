"use client";

import { useState } from "react";

interface ProductPurchasePanelProps {
  inStock: boolean;
  price: string;
}

export default function ProductPurchasePanel({
  inStock,
  price,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    setQuantity((current) => current + 1);
  };

  const decrement = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <>
      <div className="flex items-start gap-[18px]">
        <div
          className="inline-flex h-[43px] w-[183px] items-center pl-[24px]
            pr-[20px] font-bold text-[32px] leading-[32px] whitespace-nowrap
            text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]
            [clip-path:polygon(18px_0,100%_0,100%_100%,18px_100%,0_50%)]"
          style={{
            background: "linear-gradient(to right, #00823f 0%, #00ae38 100%)",
            backgroundImage:
              "-webkit-linear-gradient(top left, #00823f 0%, #00ae38 100%)",
          }}
        >
          {price} &#8381;
        </div>

        <div className="flex items-start gap-[6px] pt-[5px]">
          <div className="flex h-[32px] w-[43px] items-center border border-[#d8d8d8] bg-white pl-[8px] text-[18px] leading-none text-black">
            {quantity}
          </div>
          <div className="flex flex-col items-center justify-center pt-[1px] text-[24px] leading-[14px] text-black">
            <button
              type="button"
              onClick={increment}
              aria-label="Increase quantity"
              className="flex h-[15px] cursor-pointer items-center justify-center"
            >
              +
            </button>
            <button
              type="button"
              onClick={decrement}
              aria-label="Decrease quantity"
              className="mt-[2px] flex h-[15px] cursor-pointer items-center justify-center"
            >
              -
            </button>
          </div>
          <button
            type="button"
            aria-label="Add to cart"
            className="ml-[8px] flex h-[36px] w-[36px] items-center justify-center"
          >
            <img src="/product/cart.png" alt="" className="h-auto w-auto" />
          </button>
        </div>
      </div>

      <p className="mt-[14px] text-[16px] text-black">
        {inStock ? "В наличии: товар есть на складе" : "В наличии: нет в наличии"}
      </p>
    </>
  );
}
