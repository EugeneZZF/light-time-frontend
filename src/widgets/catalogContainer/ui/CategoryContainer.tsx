import { Category } from "@/entities/category/model/types";
import CategoryDetail from "./CategoryDetail";
import CategoryBriefly from "./CategoryBriefly";

interface CategoryContainerProps {
  sortType: boolean;
  catalogType: boolean;
  categories: Category[];
}

export default function CategoryContainer({
  sortType,
  catalogType,
  categories,
}: CategoryContainerProps) {
  return (
    <div>
      <div style={{ display: sortType ? "block" : "none" }}>
        <CategoryDetail catalogType={catalogType} categories={categories} />
      </div>

      <div style={{ display: !sortType ? "block" : "none" }}>
        <CategoryBriefly catalogType={catalogType} categories={categories} />
      </div>
    </div>
  );
}
