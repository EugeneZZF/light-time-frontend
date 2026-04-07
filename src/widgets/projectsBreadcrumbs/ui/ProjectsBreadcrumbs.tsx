import CalcButton from "@/shared/ui/CalcButton";
import Link from "next/link";

type ProjectsBreadcrumbsProps = {
  projectTitle?: string | null;
};

export default function ProjectsBreadcrumbs({
  projectTitle,
}: ProjectsBreadcrumbsProps) {
  const title = projectTitle ?? "Проекты";

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
          {projectTitle ? (
            <>
              <span className="text-[#c9c9c9]">/</span>
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
