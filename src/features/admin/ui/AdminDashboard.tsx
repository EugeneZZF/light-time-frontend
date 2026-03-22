"use client";

import { adminRequest } from "@/features/admin/api/client";
import {
  AdminBrand,
  AdminCategory,
  AdminNewsItem,
  AdminPageItem,
  AdminProduct,
  AdminProject,
} from "@/features/admin/model/types";
import { formatAdminDate } from "@/features/admin/lib/utils";
import { useEffect, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import AdminStatCard from "./AdminStatCard";
import AdminSurface from "./AdminSurface";

type DashboardState = {
  brands: AdminBrand[];
  categories: AdminCategory[];
  news: AdminNewsItem[];
  pages: AdminPageItem[];
  products: AdminProduct[];
  projects: AdminProject[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [products, categories, brands, news, projects, pages] =
          await Promise.all([
            adminRequest<AdminProduct[]>("products"),
            adminRequest<AdminCategory[]>("categories"),
            adminRequest<AdminBrand[]>("brands"),
            adminRequest<AdminNewsItem[]>("news"),
            adminRequest<AdminProject[]>("projects"),
            adminRequest<AdminPageItem[]>("pages"),
          ]);

        setData({ brands, categories, news, pages, products, projects });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load dashboard data.",
        );
      }
    }

    void load();
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="A single place to keep an eye on catalog entities, content volume, and the latest admin-managed records."
      />

      {error ? (
        <AdminSurface className="mb-6 border-[#f0c8c8] bg-[#fff5f5] text-[#8b3131]">
          {error}
        </AdminSurface>
      ) : null}

      {!data ? (
        <AdminSurface>Loading dashboard...</AdminSurface>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              title="Products"
              value={data.products.length}
              hint="Catalog positions available for editing"
            />
            <AdminStatCard
              title="Categories"
              value={data.categories.length}
              hint="Total category nodes in the admin list"
            />
            <AdminStatCard
              title="Brands"
              value={data.brands.length}
              hint="Connected brands available in catalog"
            />
            <AdminStatCard
              title="Content"
              value={data.news.length + data.pages.length + data.projects.length}
              hint="News, pages and project entries combined"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Latest products
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
                      {product.sku || "No SKU"} • {product.price} ₽
                    </div>
                    <div className="mt-2 text-[12px] text-[#7b8e7f]">
                      Updated {formatAdminDate(product.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </AdminSurface>

            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Latest categories
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
                      Updated {formatAdminDate(category.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </AdminSurface>

            <AdminSurface>
              <div className="text-[20px] font-bold text-[#173523]">
                Latest content
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {[...data.news, ...data.pages]
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={`${item.slug}-${item.id}`}
                      className="rounded-[18px] border border-[#e4ece5] bg-[#f8fbf9] p-4"
                    >
                      <div className="text-[16px] font-bold text-[#173523]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-[13px] text-[#617765]">
                        {item.status}
                      </div>
                      <div className="mt-2 text-[12px] text-[#7b8e7f]">
                        Updated {formatAdminDate(item.updatedAt)}
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
