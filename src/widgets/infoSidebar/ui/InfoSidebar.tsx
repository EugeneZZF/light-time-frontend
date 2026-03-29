"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INFO_SIDEBAR_ITEMS } from "@/shared/config/infoPages";

export default function InfoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[221px] flex-none pt-[21px]">
      <nav aria-label="Информационные разделы" className="flex flex-col">
        {INFO_SIDEBAR_ITEMS.map((item) => {
          const isActive =
            item.href === "/articles"
              ? pathname === item.href || pathname.startsWith("/articles/")
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block  border-[#d9d9d9] px-[4px]
                 py-[7px] text-[18px] leading-[1.55] font-bold tracking-[-0.01em]
                  ${
                    isActive
                      ? "text-black"
                      : "text-black hover:text-[#ff5a2f]  hover:decoration-[#ff5a2f] hover:underline-offset-[2px]"
                  }`}
            >
              <p className="underline decoration-1 underline-offset-4 decoration-[rgba(0,0,0,0.15)]">
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
