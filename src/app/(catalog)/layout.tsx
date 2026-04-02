import { CatalogBreadcrumbs } from "@/widgets/CatalogBreadcrumbs";
import { SideBar } from "@/widgets/SideBar";
import { getCategories } from "@/entities/category/api/getCategoryes";
import { ReactNode } from "react";
import { Metadata } from "next";

type CatalogLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог светильников",
};

export default async function CatalogLayout({ children }: CatalogLayoutProps) {
  const categories = await getCategories();
  return (
    <section className="flex w-full">
      <SideBar categories={categories}></SideBar>
      <div className="w-full pt-[5px] ml-[20px]">
        <CatalogBreadcrumbs categories={categories} />
        {children}
      </div>
    </section>
  );
}
