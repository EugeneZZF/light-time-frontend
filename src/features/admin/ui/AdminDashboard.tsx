"use client";

import { adminRequest } from "@/features/admin/api/client";
import { formatAdminDate } from "@/features/admin/lib/utils";
import {
  AdminBrand,
  AdminCategory,
  AdminNewsItem,
  AdminArticleItem,
  AdminProduct,
  AdminProject,
} from "@/features/admin/model/types";
import { useEffect, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import AdminStatCard from "./AdminStatCard";
import AdminSurface from "./AdminSurface";

type DashboardState = {
  brands: AdminBrand[];
  categories: AdminCategory[];
  news: AdminNewsItem[];
  articles: AdminArticleItem[];
  products: AdminProduct[];
  projects: AdminProject[];
};

const STATUS_LABELS: Record<string, string> = {
  ARCHIVED: "Архив",
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [products, categories, brands, news, projects, articles] =
          await Promise.all([
            adminRequest<AdminProduct[]>("products"),
            adminRequest<AdminCategory[]>("categories"),
            adminRequest<AdminBrand[]>("brands"),
            adminRequest<AdminNewsItem[]>("news"),
            adminRequest<AdminProject[]>("projects"),
            adminRequest<AdminArticleItem[]>("articles"),
          ]);

        setData({ brands, categories, news, articles, products, projects });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить данные панели.",
        );
      }
    }

    void load();
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Обзор"
        description="Единое место для контроля каталога, контента и последних записей, которыми управляет админка."
      />

      {error ? (
        <AdminSurface className="mb-6 border-[#f0c8c8] bg-[#fff5f5] text-[#8b3131]">
          {error}
        </AdminSurface>
      ) : null}

      {!data ? (
        <AdminSurface>Загрузка панели...</AdminSurface>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              title="Товары"
              value={data.products.length}
              hint="Позиции каталога, доступные для редактирования"
            />
            <AdminStatCard
              title="Категории"
              value={data.categories.length}
              hint="Общее количество узлов в дереве категорий"
            />
            <AdminStatCard
              title="Бренды"
              value={data.brands.length}
              hint="Подключённые бренды, доступные в каталоге"
            />
            <AdminStatCard
              title="Контент"
              value={
                data.news.length + data.articles.length + data.projects.length
              }
              hint="Новости, статьи и проекты вместе"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Последние товары
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {data.products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[18px] border border-[#e4ece5] bg-[#f8fbf9] p-4"
                  >
                    <div className="text-[16px] font-bold text-[#173523]">
                      {product.title}
                    </div>
                    <div className="mt-1 text-[13px] text-[#617765]">
                      {product.sku || "Без SKU"} • {product.price} ₽
                    </div>
                    <div className="mt-2 text-[12px] text-[#7b8e7f]">
                      Обновлено {formatAdminDate(product.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </AdminSurface>

            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Последние категории
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {data.categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="rounded-[18px] border border-[#e4ece5] bg-[#f8fbf9] p-4"
                  >
                    <div className="text-[16px] font-bold text-[#173523]">
                      {category.name}
                    </div>
                    <div className="mt-1 text-[13px] text-[#617765]">
                      {category.slug}
                    </div>
                    <div className="mt-2 text-[12px] text-[#7b8e7f]">
                      Обновлено {formatAdminDate(category.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </AdminSurface>

            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Последний контент
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {[...data.news, ...data.articles].slice(0, 5).map((item) => (
                  <div
                    key={`${item.slug}-${item.id}`}
                    className="rounded-[18px] border border-[#e4ece5] bg-[#f8fbf9] p-4"
                  >
                    <div className="text-[16px] font-bold text-[#173523]">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[13px] text-[#617765]">
                      {STATUS_LABELS[item.status] ?? item.status}
                    </div>
                    <div className="mt-2 text-[12px] text-[#7b8e7f]">
                      Обновлено {formatAdminDate(item.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </AdminSurface>
          </div>
        </div>
      )}
    </>
  );
}
