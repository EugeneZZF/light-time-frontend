"use client";
import { Category } from "@/entities/category/model/types";
import CategoryCard from "@/entities/category/ui/CategoryCard";
import React, { useMemo } from "react";

interface CategoryDetailProps {
  categories: Category[];
  catalogType: boolean;
}
function CategoryDetail({ categories, catalogType }: CategoryDetailProps) {
  // console.log(categories);
  const activeCategories = useMemo(() => {
    return categories.filter((category) => category.isActive);
  }, [categories]);

  return (
    <div className="flex gap-[20px] flex-wrap grid-cols-4">
      {categories.map(
        (category) =>
          category.isActive && (
            <CategoryCard
              key={category.id}
              catalogType={catalogType}
              category={category}
            />
          ),
      )}
    </div>
  );
}

export default React.memo(CategoryDetail);
