import { CatalogBreadcrumbs } from "@/widgets/CatalogBreadcrumbs";
import { SideBar } from "@/widgets/SideBar";
import { getCategories } from "@/entities/category/api/getCategoryes";
import { getAllProducts } from "@/entities/product/api/getProductQuery";
import { ReactNode, Suspense } from "react";
import { Metadata } from "next";

type CatalogLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог светильников",
};

export default async function CatalogLayout({ children }: CatalogLayoutProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);
  const productLookupItems = products.map(({ slug, title, categories }) => ({
    slug,
    title,
    categories,
  }));

  return (
    <section className="flex w-full">
      <Suspense
        fallback={<div className="mx-[40px] h-auto w-[250px] flex-none" />}
      >
        <SideBar categories={categories} products={productLookupItems} />
      </Suspense>
      <div className="w-full pt-[5px] ml-[20px]">
        <Suspense fallback={<div className="mb-8 ml-[20px] h-[72px]" />}>
          <CatalogBreadcrumbs
            categories={categories}
            products={productLookupItems}
          />
        </Suspense>
        {children}
      </div>
    </section>
  );
}
