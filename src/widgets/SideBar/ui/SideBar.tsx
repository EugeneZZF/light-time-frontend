import { Category } from "@/entities/category/model/types";
import SideBarLink from "./SideBarLink";

interface SideBarProps {
  categories: Category[];
}

export function SideBar({ categories }: SideBarProps) {
  console.log(categories);
  return (
    <div className="mx-[40px] h-auto w-[250px] flex-none flex flex-col">
      {categories.map((categ) => (
        <SideBarLink key={categ.slug} category={categ} />
      ))}
    </div>
  );
}
