import { CatalogBreadcrumbs } from "@/widgets/CatalogBreadcrumbs";
import { SideBar } from "@/widgets/SideBar";
import { getCategories } from "@/entities/category/api/getCategoryes";
import { getAllProducts } from "@/entities/product/api/getProductQuery";
import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import {
  buildCatalogCategoryLookups,
  buildProductCategorySlugLookup,
  buildProductLookup,
} from "@/shared/lib/catalog/lookups";

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
  const { breadcrumbsBySlug } = buildCatalogCategoryLookups(categories);
  const productCategorySlugByProductSlug =
    buildProductCategorySlugLookup(productLookupItems);
  const productsBySlug = buildProductLookup(productLookupItems);

  return (
    <section className="flex w-full">
      <Suspense
        fallback={<div className="mx-[40px] h-auto w-[250px] flex-none" />}
      >
        <SideBar
          categories={categories}
          products={productCategorySlugByProductSlug}
        />
      </Suspense>
      <div className="w-full pt-[5px] ml-[20px]">
        <Suspense fallback={<div className="mb-8 ml-[20px] h-[72px]" />}>
          <CatalogBreadcrumbs
            categoryBreadcrumbsBySlug={breadcrumbsBySlug}
            productsBySlug={productsBySlug}
          />
        </Suspense>
        {children}
      </div>
    </section>
  );
}

