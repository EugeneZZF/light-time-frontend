import { Project } from "../model/types";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import Link from "next/link";

interface ProjectSmallCardProps {
  item: Project;
}

export default function ProjectSmallCard({ item }: ProjectSmallCardProps) {
  const imageUrl = item.images[0]?.url ? `${baseUrl}${item.images[0].url}` : "";
  const previewText = item.description || item.content;

  return (
    <Link
      href={`/project/${item.slug}`}
      className="group flex w-[265px] flex-col
      bg-white p-[10px] relative
      
      hover:z-50 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] "
    >
      <div
        className="h-[165px] w-[245px] z-10 bg-[#efefef] bg-cover bg-center relative"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />

      <div className="relative px-[10px] pt-[14px] pb-[6px]">
        <h3
          className="text-[18px] font-bold leading-[1.1]
         text-[#111111]  group-hover:text-[#ff3333]"
        >
          {item.title}
        </h3>

        <p className="mt-[10px] line-clamp-3 group-hover:line-clamp-none text-[16px] leading-[1.1] text-[#57656F] ">
          {previewText}
        </p>

        <div
          className="pointer-events-none absolute inset-x-[10px] bottom-0 h-[42px]
        bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_58%,rgba(255,255,255,1)_100%)]
         group-hover:opacity-0"
        />
      </div>
    </Link>
  );
}
