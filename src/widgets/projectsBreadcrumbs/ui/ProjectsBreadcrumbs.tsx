"use client";

import CalcButton from "@/shared/ui/CalcButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

function formatSegmentLabel(segment: string) {
  const decodedSegment = decodeURIComponent(segment);

  return decodedSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ProjectsBreadcrumbs() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const projectSegments = segments.slice(1);
  const title =
    projectSegments.length > 0
      ? formatSegmentLabel(projectSegments[projectSegments.length - 1])
      : "Проекты";

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
          <span className="text-[#c9c9c9]">/</span>
          <Link href="/project" className="transition hover:text-[#ff3333]">
            Проекты
          </Link>
          {projectSegments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="contents">
              <span className="text-[#c9c9c9]">/</span>
              <span>{formatSegmentLabel(segment)}</span>
            </span>
          ))}
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
