import { Category } from "@/entities/category/model/types";
import { getCategories } from "@/entities/category/api/getCategoryes";
import BigCardCatalogCategory from "@/entities/catalog/ui/BigCardCatalogProduct";
import { getProductsByQuery } from "@/entities/product/api/getProductQuery";
import { CatalogProductContainer } from "@/widgets/catalogProductContainer";
import { buildCatalogCategoryLookups } from "@/shared/lib/catalog/lookups";

type CatalogPageProps = {
  searchParams?: Promise<{
    categorySlug?: string;
  }>;
};

function getChildCategories(category: Category) {
  return [
    ...(category.subcategoriesA ?? []),
    ...(category.SubcategoriesA ?? []),
    ...(category.subcategoriesB ?? []),
    ...(category.SubcategoriesB ?? []),
  ].filter((item) => item.isActive);
}

function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mb-[40px] w-full">
      <div className="grid grid-cols-2 gap-[20px]">
        {categories.map((category) => (
          <BigCardCatalogCategory key={category.id} item={category} />
        ))}
      </div>
    </section>
  );
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeCategorySlug = resolvedSearchParams?.categorySlug?.trim();
  const categories = await getCategories();
  const rootCategories = categories.filter((category) => category.isActive);
  const { categoryBySlug } = buildCatalogCategoryLookups(categories);

  if (!activeCategorySlug) {
    return <CategoriesGrid categories={rootCategories} />;
  }

  const activeCategory = categoryBySlug[activeCategorySlug];

  if (!activeCategory) {
    return <CategoriesGrid categories={rootCategories} />;
  }

  const childCategories = getChildCategories(activeCategory);

  if (childCategories.length > 0) {
    return <CategoriesGrid categories={childCategories} />;
  }

  const products = await getProductsByQuery({
    categorySlug: activeCategorySlug,
  });

  return <CatalogProductContainer products={products} />;
}
