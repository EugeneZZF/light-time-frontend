"use client";

import { Category } from "@/entities/category/model/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CatalogBreadcrumbsProps {
  categories: Category[];
}

type BreadcrumbState = {
  categoryName?: string;
  subcategoryName?: string;
};

function resolveBreadcrumbState(
  categories: Category[],
  activeCategorySlug: string | null,
): BreadcrumbState {
  if (!activeCategorySlug) {
    return {};
  }

  for (const category of categories) {
    if (category.slug === activeCategorySlug) {
      return { categoryName: category.name };
    }

    const subcategories =
      category.subcategoriesA ?? category.SubcategoriesA ?? [];
    const matchedSubcategory = subcategories.find(
      (subcategory) => subcategory.slug === activeCategorySlug,
    );

    if (matchedSubcategory) {
      return {
        categoryName: category.name,
        subcategoryName: matchedSubcategory.name,
      };
    }
  }

  return {};
}

export default function CatalogBreadcrumbs({
  categories,
}: CatalogBreadcrumbsProps) {
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("categorySlug");
  const { categoryName, subcategoryName } = resolveBreadcrumbState(
    categories,
    activeCategorySlug,
  );
  const title = subcategoryName ?? categoryName ?? "Каталог продукции";

  return (
    <div className="mb-8 flex flex-col gap-3 ml-[20px]">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[14px] text-[#7f7f7f]"
      >
        <Link href="/" className="transition hover:text-[#ff3333]">
          Главная
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <Link href="/catalog" className="transition hover:text-[#ff3333]">
          Каталог
        </Link>
        {categoryName ? (
          <>
            <span className="text-[#c9c9c9]">/</span>
            <span>{categoryName}</span>
          </>
        ) : null}
        {subcategoryName ? (
          <>
            <span className="text-[#c9c9c9]">/</span>
            <span>{subcategoryName}</span>
          </>
        ) : null}
      </nav>

      <h1 className="text-[28px] font-bold leading-none text-[#009e39]">
        {title}
      </h1>
    </div>
  );
}
