"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  INFO_DROPDOWN_LINKS,
  NAVIGATION_LINKS,
  NAVIGATION_LINKS_ICO,
} from "../model/links";
import { DropdownMenu } from "./DropdownMenu";
import {
  getCartItems,
  subscribeToCartUpdates,
} from "@/shared/lib/cart/localStorage";

export function Bar() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const syncCartState = () => {
      const nextCount = getCartItems().reduce(
        (total, item) => total + item.quantity,
        0,
      );

      setCartItemsCount(nextCount);
    };

    syncCartState();

    const unsubscribe = subscribeToCartUpdates(syncCartState);

    return unsubscribe;
  }, []);

  return (
    <nav className="w-full flex bg-[#009234] items-center pt-3.75 pb-4 pl-10 pr-10 gap-26.75 shadow-[0_5px_40px_rgba(0,0,0,0.3)]">
      <div className="font-normal leading-[23px]  text-[23px] flex gap-10">
        {NAVIGATION_LINKS.map((link) =>
          link.href === "/info" ? (
            <DropdownMenu
              key={link.href}
              label={link.label}
              href={link.href}
              items={INFO_DROPDOWN_LINKS}
            />
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-[#ffff66] border-b-[1px]
               border-b-white/20"
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
      <div className="flex gap-[125px] text-[19px]">
        {NAVIGATION_LINKS_ICO.map((link) => (
          <div key={link.href} className="flex gap-[10px]">
            <div className="relative">
              <img
                src={link.ico}
                alt="cart icon"
                className={
                  link.href == "/magazine"
                    ? "h-[30px] w-[19px]"
                    : "h-[30px] w-[33px]"
                }
              ></img>
              {link.href === "/cart" && cartItemsCount > 0 ? (
                <span className="absolute -right-[10px] -top-[8px] flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d81f26] px-[4px] text-[11px] font-bold leading-none text-white">
                  {cartItemsCount}
                </span>
              ) : null}
            </div>
            <Link
              href={link.href}
              className={
                link.href == "/cart"
                  ? "text-white hover:text-[#ffff66] font-400 text-[20px]"
                  : "text-white hover:text-[#ffff66] font-400"
              }
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
