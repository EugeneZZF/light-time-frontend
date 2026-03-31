import { notFound } from "next/navigation";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import { getProjectBySlug } from "@/entities/project/api/getProjectBySlug";
import { getProjectsByQuery } from "@/entities/project/api/getProjectQuery";
import Link from "next/link";
import formatDate from "@/shared/lib/date/formateDate";
import BoxCardProduct from "@/entities/product/ui/BoxCardProduct";
import { ProjectEquipment } from "@/entities/project/model/types";
import ProjectImageGallery from "@/entities/project/ui/ProjectImageGallery";

type ProjectDetailPageProps = {
  params: Promise<{
    slugProject: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slugProject } = await params;
  const project = await getProjectBySlug(slugProject);

  if (!project) {
    notFound();
  }

  const relatedProjects = (await getProjectsByQuery({ limit: 1000 }))
    .filter((candidate) => candidate.slug !== project.slug)
    .slice(0, 4);

  const detailText = project.description?.trim() || project.content?.trim();
  const projectImages = project.images.map((image) => ({
    sortOrder: image.sortOrder,
    url: `${baseUrl ?? ""}${image.url}`,
  }));

  console.log(project);

  return (
    <section className="pl-[40px] pb-[40px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[36px]">
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
          <div className="w-[765px]">
            <div className="flex flex-col">
              <div className="text-[16px] text-[#939393] ">
                {formatDate(project.createdAt)}
              </div>
              <div className="ml-[30px] text-[16px] text-[#505050] indent-6">
                {project.description}
              </div>
            </div>
            <div className="text-[20px] text-[#535353] mt-[30px] ml-[30px] font-bold tracking-wide mb-[20px]">
              ГАЛЕРЕЯ ПРОЕКТА
            </div>
            <ProjectImageGallery images={projectImages} title={project.title} />
          </div>

          <div className="flex max-w-[360px] ml-[40px] flex-1 flex-col gap-1">
            {relatedProjects.map((prj) => (
              <Link
                href={`${prj.slug}`}
                className="poiner hover:text-[#ff3333] "
                key={prj.id}
                // onClick={proj}
              >
                {prj.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-[980px]">
          <div
            className=" ml-[40px] w-[765px]
          mt-[18px] whitespace-pre-line text-[16px] leading-[1.45] text-[#505050] indent-6"
          >
            {detailText || "Описание отсутствует"}
          </div>
        </div>

        {project.equipment.length > 0 ? (
          <section>
            <h2 className="text-[24px] font-bold leading-none text-[#009e39] ml-[40px]">
              Оборудование, использованное в проекте
            </h2>
            <div className="mt-[20px] flex gap-[20px]">
              {project.equipment.map((product: ProjectEquipment) => (
                <BoxCardProduct key={product.id} item={product} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
