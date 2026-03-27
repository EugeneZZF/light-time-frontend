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
    label: "Обзор",
    description: "Панель и быстрая статистика",
  },
  {
    href: "/admin/products",
    label: "Товары",
    description: "Позиции каталога и цены",
  },
  {
    href: "/admin/categories",
    label: "Категории",
    description: "Основные и вложенные категории",
  },
  {
    href: "/admin/brands",
    label: "Бренды",
    description: "Справочник брендов",
  },
  {
    href: "/admin/news",
    label: "Новости",
    description: "Опубликованные новости и черновики",
  },
  {
    href: "/admin/projects",
    label: "Проекты",
    description: "Портфолио и оборудование",
  },
  {
    href: "/admin/articles",
    label: "Статьи",
    description: "Статические статьи сайта",
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
