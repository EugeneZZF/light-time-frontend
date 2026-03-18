import { Category } from "@/entities/category/model/types";
import CategoryCard from "@/entities/category/ui/CategoryCard";

interface CategoryBrieflyProps {
  categories: Category[];
  catalogType: boolean;
}

export default function CategoryBriefly({
  categories,
  catalogType,
}: CategoryBrieflyProps) {
  console.log(categories);
  return (
    <div className="flex gap-[20px] flex-wrap grid-cols-4">
      {categories.map(
        (category) =>
          !category.isActive && (
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
