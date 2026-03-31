"use client";

import { animated, useSpring } from "@react-spring/web";
import { Category } from "@/entities/category/model/types";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface SideBarLinkProps {
  activeCategorySlug: string | null;
  category: Category;
}

export default function SideBarLink({
  activeCategorySlug,
  category,
}: SideBarLinkProps) {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const subcategories = useMemo(
    () => category.subcategoriesA ?? category.SubcategoriesA ?? [],
    [category.SubcategoriesA, category.subcategoriesA],
  );
  const hasSubcategories = subcategories.length > 0;
  const isSubcategoryActive = subcategories.some(
    (subcategory) => subcategory.slug === activeCategorySlug,
  );
  const isActive = activeCategorySlug === category.slug || isSubcategoryActive;

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }

    setContentHeight(contentRef.current.scrollHeight);
  }, [subcategories, isActive]);

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
    height: isActive && hasSubcategories ? contentHeight : 0,
    opacity: isActive && hasSubcategories ? 1 : 0,
    marginTop: isActive && hasSubcategories ? 12 : 0,
    config: {
      tension: 170,
      friction: 22,
    },
  });

  const nextParams = new URLSearchParams(searchParams?.toString() ?? "");

  if (isActive) {
    nextParams.delete("categorySlug");
  } else {
    nextParams.set("categorySlug", category.slug);
  }

  const categoryHref = `/catalog${nextParams.toString() ? `?${nextParams.toString()}` : ""}`;

  return (
    <div className="mb-2">
      <Link
        href={categoryHref}
        className={`block text-[18px] rounded-[3px] px-4 py-1 underline decoration-1 underline-offset-4 decoration-[rgba(0,0,0,0.15)] text-[16px] font-bold leading-[1.15] transition ${
          isActive
            ? "bg-gradient-to-b no-underline from-[#ffd046] py-2 to-[#ff9836] scale-[1.1] text-black shadow-[0_4px_12px_rgba(0,0,0,0.14)]"
            : "text-black hover:text-[#ff3333]"
        }`}
      >
        {category.name}
      </Link>

      <animated.div style={{ ...animatedStyles, overflow: "hidden" }}>
        <div ref={contentRef} className="flex flex-col gap-2 pl-4">
          {subcategories.map((subcategory) => {
            const isCurrentSubcategory =
              activeCategorySlug === subcategory.slug;

            return (
              <Link
                key={subcategory.slug}
                href={`/catalog?categorySlug=${subcategory.slug}`}
                className={`text-[16px] leading-[1.05] underline decoration-1 underline-offset-4 decoration-[#7d7d7d5b] underline-offset-[3px] transition ${
                  isCurrentSubcategory
                    ? "font-bold text-black"
                    : "text-black hover:text-[#ff3333]"
                }`}
              >
                {subcategory.name}
              </Link>
            );
          })}
        </div>
      </animated.div>
    </div>
  );
}
