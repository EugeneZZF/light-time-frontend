import { ProjectsBreadcrumbs } from "@/widgets/projectsBreadcrumbs";
import { ReactNode } from "react";

type CatalogLayoutProps = {
  children: ReactNode;
};

export default async function CatalogLayout({ children }: CatalogLayoutProps) {
  return (
    <section className="flex flex-col w-full">
      <div className="w-full pt-[10px]">
        <ProjectsBreadcrumbs />
        {children}
      </div>
    </section>
  );
}
