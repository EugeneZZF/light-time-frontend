"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Category } from "../model/types";

interface CategoryCardProps {
  category: Category;
  catalogType: boolean;
}

export default function CategoryCard({
  category,
  catalogType,
}: CategoryCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }

    setContentHeight(contentRef.current.scrollHeight);
  }, [category]);

  useEffect(() => {
    if (!contentRef.current || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  const animatedStyles = useSpring({
    height: catalogType ? contentHeight : 0,
    opacity: catalogType ? 1 : 1,
    config: {
      tension: 110,
      friction: 24,
    },
  });

  return (
    <div className="h-auto w-[243px] ">
      <img
        src={`./category/${category.slug}.jpg`}
        alt={category.name}
        className="w-full h-[100px] border border-[#E8E8E8] shadow-[0_6px_5px_-5px_rgba(0,0,0,0.15)]"
      />
      <p className=" mt-[10px] cursor-pointer pl-[19px] pr-[19px]  hover:text-[#ff3333] text-[18px] text-[#009e39] font-bold underline decoration-1 decoration-[#009e3933]">
        {category.name}
      </p>
      <animated.div style={{ ...animatedStyles, overflow: "hidden" }}>
        <div ref={contentRef}>
          {category.subcategoriesA?.map((subCat) => (
            <div
              key={subCat.id}
              className=" underline  mt-[5px] decoration-1 underline-offset-3 decoration-[rgba(0,0,0,0.15)] inline cursor-pointer text-[15px]"
            >
              <p className="cursor-pointer pl-[19px] pr-[19px]  hover:text-[#ff3333]">
                {subCat.name}
              </p>
              {subCat.subcategoriesB?.map((subSubCat) => (
                <div key={subSubCat.id}>
                  <p className="ml-[20px] pl-[19px] pr-[19px] cursor-pointer hover:text-[#ff3333]">
                    {subSubCat.name}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  );
}
