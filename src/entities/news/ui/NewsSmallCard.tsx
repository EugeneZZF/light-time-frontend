import Link from "next/link";
import { News } from "../model/types";
import formatDate from "@/shared/lib/date/formateDate";

interface NewsSmallCardProps {
  news: News;
}

export default function NewsSmallCard({ news }: NewsSmallCardProps) {
  console.log(news);
  return (
    <div className="w-[220px] h-auto flex flex-col">
      <div className="flex items-center gap-[10px] mb-[15px]">
        <p className="text-[15px] text-[#909090] leading-[15px]">
          {formatDate(news.createdAt).slice(0, -2)}
        </p>
        <img
          className="w-[16px] h-[16px]"
          src={"./main/clock.jpg"}
          alt={news.title}
        />
      </div>
      <Link
        href={`/news/${news.slug}`}
        className="hover:text-[#f33] hover:decoration-[#ff333333] underline-offset-4
        text-[16px] text-[#000] decoration-1 decoration-[#00000026] underline"
      >
        {news.title}
      </Link>
    </div>
  );
}
