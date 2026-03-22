"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminMenuItem = {
  description: string;
  href: string;
  label: string;
};

const adminMenuItems: AdminMenuItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Dashboard and quick stats",
  },
  {
    href: "/admin/products",
    label: "Products",
    description: "Catalog items and pricing",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    description: "Main, sub A and sub B tree",
  },
  {
    href: "/admin/brands",
    label: "Brands",
    description: "Brand directory",
  },
  {
    href: "/admin/news",
    label: "News",
    description: "Published news and drafts",
  },
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Portfolio and equipment",
  },
  {
    href: "/admin/pages",
    label: "Pages",
    description: "Static content pages",
  },
];

export default function AdminSidebarMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {adminMenuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[20px] border px-4 py-3 transition ${
              isActive
                ? "border-[#234c30] bg-[#163322] text-white shadow-[0_10px_24px_rgba(10,31,19,0.28)]"
                : "border-[#d4dfd6] bg-white/75 text-[#173523] hover:border-[#9bb9a2] hover:bg-[#f7fbf8]"
            }`}
          >
            <div className="text-[15px] font-bold">{item.label}</div>
            <div
              className={`mt-1 text-[12px] ${
                isActive ? "text-[#d8e7dc]" : "text-[#64806d]"
              }`}
            >
              {item.description}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
