import { getProjectsByQuery } from "@/entities/project/api/getProjectQuery";
import ProjectBigCard from "@/entities/project/ui/ProjectBigCard";
import ProjectSmallCard from "@/entities/project/ui/ProjectSmallCard";

type ProjectPageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
};

function parseNumberParam(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const projects = await getProjectsByQuery({
    page: parseNumberParam(resolvedSearchParams?.page) ?? 1,
    limit: parseNumberParam(resolvedSearchParams?.limit) ?? 12,
    q: resolvedSearchParams?.q?.trim() || undefined,
  });
  const [firstProject, secondProject, ...smallProjects] = projects;

  return (
    <section className="flex flex-col w-full items-center">
      <div className="flex justify-center items-center flex-col w-[1040px]">
        <div className=" grid gap-[20px] grid-cols-2 h-auto">
          {firstProject ? (
            <ProjectBigCard item={firstProject}></ProjectBigCard>
          ) : null}
          {secondProject ? (
            <ProjectBigCard item={secondProject}></ProjectBigCard>
          ) : null}
        </div>
        <div className="w-[1060px] grid grid-cols-4 gap-0 mt-[30px]">
          {smallProjects.map((project) => (
            <div
              key={project.id}
              className="  justify-center relative w-[265px] h-[310px]"
            >
              <ProjectSmallCard item={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
