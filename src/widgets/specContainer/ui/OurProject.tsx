import Link from "next/link";
import { getLastProject } from "@/entities/project/api/getLastProject";
import { baseUrl } from "@/entities/category/api/getCategoryes";

export default async function OurProject() {
  const project = await getLastProject().catch((error) => {
    console.error("Error fetching project:", error);
    return null;
  });

  const imageUrl = project?.images?.[0]?.url;
  // console.log(project, 321321312321312);

  return (
    <div className="flex flex-col gap-[15px]">
      <Link href={`/project/${project?.slug}`} className="w-[500px] h-[188px]">
        <div
          className="w-[500px] h-[178px] bg-[#efefef] bg-cover bg-center flex items-end text-[18px] font-bold text-white p-[10px] relative overflow-hidden"
          style={{
            backgroundImage: imageUrl ? `url(${baseUrl}${imageUrl})` : "none",
          }}
        >
          <span>{project?.title ?? ""}</span>
        </div>
      </Link>
    </div>
  );
}
