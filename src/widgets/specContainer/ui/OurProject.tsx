import Link from "next/link";
import { getLastProject } from "@/entities/project/api/getLastProject";

export default async function OurProject() {
  const project = await getLastProject().catch((error) => {
    console.error("Error fetching project:", error);
    return null;
  });

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
          <span>{project?.title ?? 'РћСЃРІРµС‰РµРЅРёРµ СЃСѓРїРµСЂРјР°СЂРєРµС‚Р° "РђРЁРђРќ РЎРёС‚Рё"'}</span>
        </div>
      </Link>
    </div>
  );
}
