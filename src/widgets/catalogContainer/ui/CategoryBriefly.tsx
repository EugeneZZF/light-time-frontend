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
  {
    // 321
    categories.map((category) => {
      if (!category.isActive) {
        console.log("active", category);
      }
    });
  }

  const fullCategories = {
    osveschenie_magazinov: {
      id: 999,
      name: "Освещение магазинов",
      slug: "osveschenie-magazinov",
      imageUrl: null,
      description: null,
      parentId: null,
      isActive: false,
      sortOrder: 10,
    },
    osveschenie_skladov: {
      id: 998,
      name: "Освещение складов",
      slug: "osveschenie-skladov",
      imageUrl: null,
      description: null,
      parentId: null,
      isActive: false,
      sortOrder: 12,
      subcategoriesA: [],
    },
  };
  return (
    <div className="flex gap-[20px] flex-wrap grid-cols-4">
      {Object.values(fullCategories).map(
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
