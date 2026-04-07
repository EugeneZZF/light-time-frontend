import { ProjectsBreadcrumbs } from "@/widgets/projectsBreadcrumbs";
import { getProjectBySlug } from "@/entities/project/api/getProjectBySlug";
import { ReactNode } from "react";

type CatalogLayoutProps = {
  children: ReactNode;
  params: Promise<{
    slugProject?: string;
  }>;
};

export default async function CatalogLayout({
  children,
  params,
}: CatalogLayoutProps) {
  const { slugProject } = await params;
  const project = slugProject ? await getProjectBySlug(slugProject) : null;

  return (
    <section className="flex flex-col w-full">
      <div className="w-full pt-[10px]">
        <ProjectsBreadcrumbs projectTitle={project?.title} />
        {children}
      </div>
    </section>
  );
}
