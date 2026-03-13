"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLastProject } from "@/entities/project/api/getLastProject";
import { Project } from "@/entities/project/types";

export default function OurProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getLastProject();
        setProject(projectData);
        // console.log("Fetched project:", projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  if (loading) {
    return (
      <div className="w-[500px] h-[188px] bg-gray-200 animate-pulse rounded-[10px]" />
    );
  }

  const imageUrl = project?.images?.[0]?.url;

  return (
    <div className="flex flex-col gap-[15px]">
      <Link href={"/"} className="w-[500px] h-[188px]">
        <div
          className="w-[500px] h-[188px] bg-cover bg-center rounded-[10px] flex items-end text-[18px] font-bold text-white p-[10px] relative overflow-hidden"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          }}
        >
          <span>{project?.title ?? 'Освещение супермаркета "АШАН Сити"'}</span>
        </div>
      </Link>
    </div>
  );
}
