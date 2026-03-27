import { Project } from "../model/types";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import Link from "next/link";

interface ProjectBigCardProps {
  item: Project;
}

export default function ProjectBigCard({ item }: ProjectBigCardProps) {
  return (
    <Link
      href={`/project/${item.slug}`}
      className="block w-[510px] h-auto max-h-[530px] pt-[10px] pb-[10px]"
    >
      <div
        className="w-[510px] h-[343px] bg-cover bg-center"
        style={{ backgroundImage: `url(${baseUrl}${item.images[0].url})` }}
      ></div>
      <div className="flex flex-col mt-[20px] pl-[10px]">
        <h3 className="text-[18px] font-bold">{item.title}</h3>
        {item.description ? (
          <h4
            className="whitespace-pre-wrap text-[16px] font-normal
           text-[#57656F] mt-[5px]"
          >
            {item.description}
          </h4>
        ) : null}
      </div>
    </Link>
  );
}
