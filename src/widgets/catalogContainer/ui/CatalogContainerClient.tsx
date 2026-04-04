"use client";

import { useState } from "react";
import { Category } from "@/entities/category/model/types";
import CategoryContainer from "./CategoryContainer";

interface CatalogContainerClientProps {
  categories: Category[];
}

export default function CatalogContainerClient({
  categories,
}: CatalogContainerClientProps) {
  const [sortType, setSortType] = useState(true);
  const [catalogType, setCatalogType] = useState(false);

  function handleSortTypeChange(type: boolean) {
    setSortType(type);
    // console.log(type);
    console.log(categories);
  }
  console.log(categories);

  return (
    <div
      className="shadow-[0px_1px_5px_rgba(0,0,0,0.2)] w-[1100px] h-auto 
    pl-[30px] pr-[30px] pt-[20px] pb-[20px] relative items-start flex flex-col mb-[40px]"
    >
      <div className="flex items-center justiyfy-between mb-[20px]">
        <div className="flex gap-[30px]">
          <h1 className="text-[22px] font-bold">Каталог</h1>
          <div className="flex text-[#333333] text-[22px] gap-[20px] leading-[22px]">
            <button
              onClick={() => handleSortTypeChange(true)}
              className={` 
            ${sortType ? "pt-[5px] pb-[5px] pl-[10px] pr-[5px] shadow-[inset_3px_3px_5px_-2px_rgba(0,0,0,0.15)] font-bold border-0 rounded-[5px] bg-[#f0f0f0]" : "mt-[2px] hover:text-[#f33] border-b-[1px] border-[#33333] border-dotted "}`}
            >
              по типу
            </button>
            <button
              onClick={() => handleSortTypeChange(false)}
              className={`
            ${!sortType ? "pt-[5px] pb-[5px] pl-[10px] pr-[5px] shadow-[inset_3px_3px_5px_-2px_rgba(0,0,0,0.15)] font-bold border-0 rounded-[5px] bg-[#f0f0f0]" : "mt-[2px] hover:text-[#f33] border-b-[1px] border-[#33333] border-dotted "}`}
            >
              по применению
            </button>
          </div>
        </div>
        <div className="flex leading-[20px] text-[#333333] text-[18px] gap-[10px] absolute right-[30px] top-[25px] items-center">
          <img src="./main/spread.png" alt="" />
          <p
            onClick={() => {
              setCatalogType((prev) => !prev);
            }}
            className="hover:text-[#f33]"
          >
            {catalogType ? "Подробно" : "Кратко"}
          </p>
        </div>
      </div>
      <CategoryContainer
        sortType={sortType}
        catalogType={catalogType}
        categories={categories}
      ></CategoryContainer>
    </div>
  );
}
