"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { Category } from "../model/types";
import { baseUrl } from "../api/getCategoryes";

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

  const subcategories =
    category.subcategoriesA ?? category.SubcategoriesA ?? [];

  // console.log("Rendering CategoryCard", {
  //   category,
  // });

  return (
    <div className="h-auto w-[243px] ">
      <Link
        href={
          category.slug === "osveschenie-skladov" ||
          category.slug === "osveschenie-magazinov"
            ? `/${category.slug}`
            : `/catalog?categorySlug=${category.slug}`
        }
        className="block"
      >
        <img
          src={`./category/${category.slug}.jpg`}
          // src={`${baseUrl}${category.imageUrl}`}
          alt={category.name}
          className="w-full h-[100px] border border-[#E8E8E8] shadow-[0_6px_5px_-5px_rgba(0,0,0,0.15)]"
        />
      </Link>
      <Link
        href={`/catalog?categorySlug=${category.slug}`}
        className="mt-[10px] block pl-[19px] pr-[19px] text-[18px] font-bold text-[#009e39] underline decoration-1 decoration-[#009e3933] hover:text-[#ff3333]"
      >
        {category.name}
      </Link>
      <animated.div style={{ ...animatedStyles, overflow: "hidden" }}>
        <div ref={contentRef}>
          {subcategories.map((subCat) => (
            <div
              key={subCat.id}
              className=" underline  mt-[5px] decoration-1 underline-offset-3 decoration-[rgba(0,0,0,0.15)] inline cursor-pointer text-[15px]"
            >
              <Link
                href={`/catalog?categorySlug=${subCat.slug}`}
                className="block cursor-pointer pl-[19px] pr-[19px] hover:text-[#ff3333]"
              >
                {subCat.name}
              </Link>
              {(subCat.subcategoriesB ?? subCat.SubcategoriesB ?? []).map(
                (subSubCat) => (
                  <div key={subSubCat.id}>
                    <Link
                      href={`/catalog?categorySlug=${subSubCat.slug}`}
                      className="ml-[20px] block pl-[19px] pr-[19px] hover:text-[#ff3333]"
                    >
                      {subSubCat.name}
                    </Link>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  );
}
