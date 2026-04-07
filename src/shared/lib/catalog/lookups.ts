import { Category } from "@/entities/category/model/types";
import { CatalogProductLookupItem } from "@/entities/product/api/getProductQuery";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export type CatalogCategoryLookups = {
  breadcrumbsBySlug: Record<string, BreadcrumbItem[]>;
  categoryBySlug: Record<string, Category>;
};

function getSubcategories(category: Category): Category[] {
  return [
    ...(category.subcategoriesA ?? []),
    ...(category.SubcategoriesA ?? []),
    ...(category.subcategoriesB ?? []),
    ...(category.SubcategoriesB ?? []),
  ];
}

function buildCategoryPathItem(category: Category): BreadcrumbItem {
  return {
    href: `/catalog?categorySlug=${category.slug}`,
    label: category.name,
  };
}

function walkCategoryTree(
  category: Category,
  parentPath: BreadcrumbItem[],
  lookups: CatalogCategoryLookups,
) {
  const currentPath = [...parentPath, buildCategoryPathItem(category)];

  lookups.breadcrumbsBySlug[category.slug] = currentPath;
  lookups.categoryBySlug[category.slug] = category;

  for (const childCategory of getSubcategories(category)) {
    walkCategoryTree(childCategory, currentPath, lookups);
  }
}

export function buildCatalogCategoryLookups(
  categories: Category[],
): CatalogCategoryLookups {
  const lookups: CatalogCategoryLookups = {
    breadcrumbsBySlug: {},
    categoryBySlug: {},
  };

  for (const category of categories) {
    walkCategoryTree(category, [], lookups);
  }

  return lookups;
}

export function resolveProductCategorySlug(
  product: CatalogProductLookupItem,
): string | null {
  return (
    product.categories.subB?.slug ??
    product.categories.subA?.slug ??
    product.categories.main?.slug ??
    null
  );
}

export function buildProductCategorySlugLookup(
  products: CatalogProductLookupItem[],
): Record<string, string> {
  return products.reduce<Record<string, string>>((accumulator, product) => {
    const categorySlug = resolveProductCategorySlug(product);

    if (categorySlug) {
      accumulator[product.slug] = categorySlug;
    }

    return accumulator;
  }, {});
}

export function buildProductLookup(
  products: CatalogProductLookupItem[],
): Record<string, CatalogProductLookupItem> {
  return products.reduce<Record<string, CatalogProductLookupItem>>(
    (accumulator, product) => {
      accumulator[product.slug] = product;
      return accumulator;
    },
    {},
  );
}
