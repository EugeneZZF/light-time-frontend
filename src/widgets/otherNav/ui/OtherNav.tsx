"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INFO_SIDEBAR_ITEMS } from "@/shared/config/infoPages";
import { getArticleBySlug } from "@/entities/article";
import { getNewsBySlug } from "@/shared/api/news";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type ResolvedInfoItem = {
  href: string;
  label: string;
};

const INFO_ROUTE_ALIASES: Record<string, ResolvedInfoItem> = {
  "/magazine": {
    href: "/magazine",
    label: "Розничный магазин",
  },
  "/news": {
    href: "/news",
    label: "Новости",
  },
};

function formatSlugLabel(segment: string) {
  const decodedSegment = decodeURIComponent(segment);

  return decodedSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveInfoItem(pathname: string): ResolvedInfoItem | null {
  const matchedRootItem = INFO_SIDEBAR_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  if (matchedRootItem) {
    return matchedRootItem;
  }

  return (
    Object.entries(INFO_ROUTE_ALIASES).find(
      ([alias]) => pathname === alias || pathname.startsWith(`${alias}/`),
    )?.[1] ?? null
  );
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const matchedRootItem = resolveInfoItem(pathname);

  if (!matchedRootItem) {
    return [];
  }

  const rootSegments = matchedRootItem.href.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);
  const nestedSegments = pathSegments.slice(rootSegments.length);

  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/", label: "Главная" },
    {
      href: nestedSegments.length > 0 ? matchedRootItem.href : undefined,
      label: matchedRootItem.label,
    },
  ];

  nestedSegments.forEach((segment, index) => {
    const href = `/${pathSegments.slice(0, rootSegments.length + index + 1).join("/")}`;
    const isLast = index === nestedSegments.length - 1;

    breadcrumbs.push({
      href: isLast ? undefined : href,
      label: formatSlugLabel(segment),
    });
  });

  return breadcrumbs;
}

export default function OtherNav() {
  const pathname = usePathname();
  const [loadedArticle, setLoadedArticle] = useState<{
    slug: string;
    title: string | null;
  } | null>(null);
  const [loadedNews, setLoadedNews] = useState<{
    slug: string;
    title: string | null;
  } | null>(null);
  const breadcrumbs = getBreadcrumbs(pathname);
  const pathSegments = pathname.split("/").filter(Boolean);
  const articleSlug =
    pathSegments.length === 2 && pathSegments[0] === "articles"
      ? pathSegments[1]
      : null;
  const newsSlug =
    pathSegments.length === 2 && pathSegments[0] === "news"
      ? pathSegments[1]
      : null;

  useEffect(() => {
    if (!articleSlug) {
      return;
    }

    let isCancelled = false;

    async function loadArticleTitle() {
      const article = await getArticleBySlug(articleSlug);

      if (!isCancelled) {
        setLoadedArticle({
          slug: articleSlug,
          title: article?.title ?? null,
        });
      }
    }

    loadArticleTitle().catch(() => {
      if (!isCancelled) {
        setLoadedArticle({
          slug: articleSlug,
          title: null,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [articleSlug]);

  useEffect(() => {
    if (!newsSlug) {
      return;
    }

    let isCancelled = false;

    async function loadNewsTitle() {
      const news = await getNewsBySlug(newsSlug);

      if (!isCancelled) {
        setLoadedNews({
          slug: newsSlug,
          title: news?.title ?? null,
        });
      }
    }

    loadNewsTitle().catch(() => {
      if (!isCancelled) {
        setLoadedNews({
          slug: newsSlug,
          title: null,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [newsSlug]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  const articleTitle =
    articleSlug && loadedArticle?.slug === articleSlug
      ? loadedArticle.title
      : null;
  const newsTitle =
    newsSlug && loadedNews?.slug === newsSlug ? loadedNews.title : null;
  const renderedBreadcrumbs =
    articleTitle && pathname.startsWith("/articles/")
      ? breadcrumbs.map((item, index) =>
          index === breadcrumbs.length - 1
            ? { ...item, label: articleTitle }
            : item,
        )
      : newsTitle && pathname.startsWith("/news/")
        ? breadcrumbs.map((item, index) =>
            index === breadcrumbs.length - 1
              ? { ...item, label: newsTitle }
              : item,
          )
        : breadcrumbs;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-[14px] flex flex-wrap items-center gap-y-[8px] text-[14px]  leading-[1.2] text-[#666666]"
    >
      {renderedBreadcrumbs.map((item, index) => (
        <span key={`${item.label}-${index}`} className="contents">
          {index > 0 ? <Palka /> : null}
          {item.href ? (
            <Link
              href={item.href}
              className="whitespace-pre text-[#57656f] hover:text-[#ff3333]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="whitespace-pre text-[#57656f]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Palka() {
  return <img src={"/palka.jpg"} alt="" />;
}
