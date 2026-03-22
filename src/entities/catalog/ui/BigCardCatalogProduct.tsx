import { Category } from "@/entities/category/model/types";
import { baseUrl } from "@/entities/category/api/getCategoryes";

interface BigCardCatalogCategoryProps {
  item: Category;
}

export default function BigCardCatalogCategory({
  item,
}: BigCardCatalogCategoryProps) {
  return (
    <div className="w-[363px] h-[250px]  border-[#e8e8e8] border flex pr-[20px]">
      <div className="min-w-[110px]">
        <img
          className="w-[110px] h-auto"
          src={`${baseUrl}${item.imageUrl}`}
        ></img>
      </div>
      <div className="ml-[15px]">
        <h3 className="text-[#009e39] font-bold mt-[20px] text-[22px] leading-[26.4px]">
          {item.name}
        </h3>
        <p className="mt-[5px] text-[14px] text-[#000000] line-clamp-5">
          {item.description}
        </p>
      </div>
    </div>
  );
}
