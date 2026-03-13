"use client";

import { useState } from "react";

export default function CatalogContainer() {
  const [sortType, setSortType] = useState(true);
  const [catalogType, setCatalogType] = useState(true);

  function handleSortTypeChange(type: boolean) {
    setSortType(type);
    console.log(sortType);
  }

  return (
    <div
      className="shadow-[0px_1px_5px_rgba(0,0,0,0.2)] w-[1100px] h-[657px] 
    pl-[30px] pr-[30px] pt-[20px] pb-[20px]"
    >
      <div className="flex items-center justiyfy-between">
        <div className="flex gap-[30px]">
          <h1 className="text-[22px] font-bold">Каталог</h1>
          <div className="flex text-[#333333] text-[22px] gap-[20px] leading-[22px]">
            <button
              onClick={() => handleSortTypeChange(true)}
              className={`
            ${sortType ? "pt-[5px] pb-[5px] pl-[10px] pr-[5px] shadow-[inset_3px_3px_5px_-2px_rgba(0,0,0,0.15)] font-bold border-0 rounded-[5px] bg-[#f0f0f0]" : "mt-[2px] border-b-[1px] border-[#33333] border-dotted "}`}
            >
              по типу
            </button>
            <button
              onClick={() => handleSortTypeChange(false)}
              className={`
            ${!sortType ? "pt-[5px] pb-[5px] pl-[10px] pr-[5px] shadow-[inset_3px_3px_5px_-2px_rgba(0,0,0,0.15)] font-bold border-0 rounded-[5px] bg-[#f0f0f0]" : "mt-[2px] border-b-[1px] border-[#33333] border-dotted "}`}
            >
              по применению
            </button>
          </div>
        </div>
        <div className="flex leading-[20px] text-[#333333] text-[18px] gap-[10px]">
          <img></img>
          <p>{catalogType ? "Подробно" : "Кратко"}</p>
        </div>
      </div>
    </div>
  );
}
