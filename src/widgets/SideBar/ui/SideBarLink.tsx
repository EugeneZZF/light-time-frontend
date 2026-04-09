"use client";

import { animated, useSpring } from "@react-spring/web";
import { Category } from "@/entities/category/model/types";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface SideBarLinkProps {
  activeCategorySlug: string | null;
  category: Category;
  subcategories: Category[];
  isBranchActive: boolean;
  categoryHref: string;
}

const EMPTY_CATEGORIES: Category[] = [];

function getSubcategoriesB(category: Category): Category[] {
  return category.subcategoriesB ?? category.SubcategoriesB ?? EMPTY_CATEGORIES;
}

export default function SideBarLink({
  activeCategorySlug,
  category,
  subcategories,
  isBranchActive,
  categoryHref,
}: SideBarLinkProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const hasSubcategories = subcategories.length > 0;

  useLayoutEffect(() => {
    if (!contentRef.current || !isBranchActive || !hasSubcategories) {
      return;
    }

    setContentHeight(contentRef.current.scrollHeight);
  }, [hasSubcategories, isBranchActive]);

  useEffect(() => {
    if (
      !contentRef.current ||
      !isBranchActive ||
      !hasSubcategories ||
      typeof ResizeObserver === "undefined"
    ) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [hasSubcategories, isBranchActive]);

  const animatedStyles = useSpring({
    height: isBranchActive && hasSubcategories ? contentHeight : 0,
    opacity: isBranchActive && hasSubcategories ? 1 : 0,
    marginTop: isBranchActive && hasSubcategories ? 12 : 0,
    config: {
      tension: 170,
      friction: 22,
    },
  });

  return (
    <div className="mb-2">
      <Link
        href={categoryHref}
        className={`block text-[18px] rounded-[3px] px-4 py-1 underline decoration-1 underline-offset-4 decoration-[rgba(0,0,0,0.15)] text-[16px] font-bold leading-[1.15] transition ${
          isBranchActive
            ? "bg-gradient-to-b no-underline from-[#ffd046] py-2 to-[#ff9836] scale-[1.1] text-black shadow-[0_4px_12px_rgba(0,0,0,0.14)]"
            : "text-black hover:text-[#ff3333]"
        }`}
      >
        {category.name}
      </Link>

      <animated.div style={{ ...animatedStyles, overflow: "hidden" }}>
        <div ref={contentRef} className="flex flex-col gap-2 pl-4">
          {subcategories.map((subcategory) => {
            const nestedSubcategories = getSubcategoriesB(subcategory);
            const isCurrentSubcategory = activeCategorySlug === subcategory.slug;
            const isCurrentSubcategoryBranch =
              isCurrentSubcategory ||
              nestedSubcategories.some(
                (subSubcategory) => subSubcategory.slug === activeCategorySlug,
              );

            return (
              <div key={subcategory.slug} className="flex flex-col gap-2">
                <Link
                  href={`/catalog?categorySlug=${subcategory.slug}`}
                  className={`text-[16px] leading-[1.05] underline decoration-1 decoration-[#7d7d7d5b] underline-offset-[3px] transition ${
                    isCurrentSubcategory
                      ? "font-bold text-black"
                      : "text-black hover:text-[#ff3333]"
                  }`}
                >
                  {subcategory.name}
                </Link>

                {isCurrentSubcategoryBranch && nestedSubcategories.length > 0 ? (
                  <div className="flex flex-col gap-2 pl-4">
                    {nestedSubcategories.map((subSubcategory) => {
                      const isCurrentSubSubcategory =
                        activeCategorySlug === subSubcategory.slug;

                      return (
                        <Link
                          key={subSubcategory.slug}
                          href={`/catalog?categorySlug=${subSubcategory.slug}`}
                          className={`text-[15px] leading-[1.05] underline decoration-1 decoration-[#7d7d7d5b] underline-offset-[3px] transition ${
                            isCurrentSubSubcategory
                              ? "font-bold text-black"
                              : "text-[#303030] hover:text-[#ff3333]"
                          }`}
                        >
                          {subSubcategory.name}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </animated.div>
    </div>
  );
}
