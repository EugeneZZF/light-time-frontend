import type { News } from "@/entities/news/model/types";
import { getNewsBySlug } from "@/shared/api/news";
import formatDate from "@/shared/lib/date/formateDate";
import { notFound } from "next/navigation";

type NewsSlugPageProps = {
  params: Promise<{
    newsSlug: string;
  }>;
};

function NewsPageContent({ news }: { news: News }) {
  const displayDate = news.publishedAt || news.createdAt;

  return (
    <article className="w-full">
      <h1 className="mb-[15px] text-[28px] leading-[1.18] font-bold tracking-[-0.02em] text-[#00a040]">
        {news.title}
      </h1>

      <div className="whitespace-pre-line text-[16px] leading-[1.45] text-[#505050] indent-8">
        {news.content}
      </div>
      <p className="my-[14px] text-[16px] leading-[1.2] text-[#505050]">
        Дата новости: {formatDate(displayDate)}
      </p>
    </article>
  );
}

export default async function NewsSlugPage({ params }: NewsSlugPageProps) {
  const { newsSlug } = await params;
  const news = await getNewsBySlug(newsSlug);

  if (!news) {
    notFound();
  }

  return <NewsPageContent news={news} />;
}
