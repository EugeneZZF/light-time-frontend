"use client";

import Link from "next/link";
import { NavLinkHeader } from "../model/types";

type DropdownMenuProps = {
  label: string;
  href: string;
  items: NavLinkHeader[];
};

export function DropdownMenu({ label, href, items }: DropdownMenuProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="border-b border-b-white/20 text-white transition-colors
         hover:text-[#ffff66] group-hover:text-[#ffff66]
          group-focus-within:text-[#ffff66]"
      >
        {label}
      </Link>

      <div
        className="invisible min-w-[180px]
      pl-[20px] pr-[20px] pb-[15px]
      absolute left-[-20px] top-full z-30 translate-y-0 bg-[#009234]
       opacity-0 shadow-lg transition-all duration-150 group-hover:visible 
       group-hover:opacity-100 group-focus-within:visible 
       group-focus-within:opacity-100 mt-[15px]"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block border-b border-b-white/20 text-[18px] font-bold
             text-white transition-colors hover:text-[#ffff66] leading-[30px]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
