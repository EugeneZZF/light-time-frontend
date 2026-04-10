import NewsSmallCard from "@/entities/news/ui/NewsSmallCard";
import { getNews } from "@/shared/api/news";
import { formatDateToShort } from "@/shared/lib/date/formateDate";
import Link from "next/link";

export default async function NewsPage() {
  const news = await getNews();

  console.log("Новости:", news);

  return (
    <section className=" h-[1000px] ">
      <h1 className="mb-[18px] text-[28px] leading-[1.18] font-bold tracking-[-0.02em] text-[#00a040]">
        Новости
      </h1>

      <div className="flex flex-col gap-x-[32px] gap-y-[24px]">
        {news.map((item) => (
          //   <NewsSmallCard key={item.slug} news={item} />
          <Link
            href={`/news/${item.slug}`}
            key={item.id}
            className="flex flex-col text-[16px] leading-[17px] "
          >
            <p className="italic">{formatDateToShort(item.createdAt)}</p>
            <p className="text-[#0098dd] underline hover:text-[#ff3333] decoration-1 underline-offset-4 decoration-[#0097dd54]">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
