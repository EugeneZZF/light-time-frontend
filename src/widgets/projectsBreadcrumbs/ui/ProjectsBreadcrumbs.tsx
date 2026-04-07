"use client";

import CalcButton from "@/shared/ui/CalcButton";
import Palka from "@/widgets/CatalogBreadcrumbs/ui/Palka";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ProjectLookupItem = {
  slug?: string;
  title?: string;
};

type ProjectLookupResponse =
  | ProjectLookupItem[]
  | {
      items?: ProjectLookupItem[];
      projects?: ProjectLookupItem[];
      data?: ProjectLookupItem[];
    };

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ProjectsBreadcrumbs() {
  const pathname = usePathname() ?? "";
  const slugProject = pathname.startsWith("/project/")
    ? decodeURIComponent(pathname.replace("/project/", "").split("/")[0] ?? "")
    : "";
  const isProjectDetailPage = Boolean(slugProject);
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!isProjectDetailPage) {
      setProjectTitle(null);
      return () => {
        isMounted = false;
      };
    }

    const loadProjectTitle = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/projects?limit=1000`);

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as ProjectLookupResponse;
        const projects = Array.isArray(data)
          ? data
          : (data.items ?? data.projects ?? data.data ?? []);
        const matchedProject = projects.find(
          (project) => project.slug === slugProject,
        );

        if (isMounted) {
          setProjectTitle(matchedProject?.title ?? null);
        }
      } catch {
        if (isMounted) {
          setProjectTitle(null);
        }
      }
    };

    void loadProjectTitle();

    return () => {
      isMounted = false;
    };
  }, [isProjectDetailPage, slugProject]);

  const title = isProjectDetailPage ? (projectTitle ?? "") : "Проекты";

  return (
    <div className="mb-8 ml-[40px] mr-[40px] flex items-start justify-between gap-6">
      <div className="flex flex-col gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[14px] text-[#6b6b6b]"
        >
          <Link href="/" className="transition hover:text-[#ff3333]">
            Главная
          </Link>
          {/* <span className="text-[#c9c9c9]">/</span> */}
          <Palka />
          <Link href="/project" className="transition hover:text-[#ff3333]">
            Проекты
          </Link>
          {isProjectDetailPage && projectTitle ? (
            <>
              {/* <span className="text-[#c9c9c9]">/</span> */}
              <Palka />
              <span>{projectTitle}</span>
            </>
          ) : null}
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.15] text-[#009e39]">
          {title}
        </h1>
      </div>

      <Link href="/" className="shrink-0 transition hover:brightness-[0.98]">
        <CalcButton />
      </Link>
    </div>
  );
}
