import formatDate from "@/shared/lib/date/formateDate";
import { Article } from "../model/types";

type ArticlePageContentProps = {
  article: Article;
};

export default function ArticlePageContent({
  article,
}: ArticlePageContentProps) {
  const displayDate = article.articleDate ?? article.createdAt;

  return (
    <article className="w-full">
      <h1 className="mb-[15px] text-[28px] leading-[1.18] font-bold tracking-[-0.02em] text-[#00a040]">
        {article.title}
      </h1>
      <p className="mb-[14px] text-[13px] leading-[1.2] text-[#7a7a7a]">
        {formatDate(displayDate)}
      </p>
      <div className="whitespace-pre-line text-[16px] leading-[1.45] text-[#505050]">
        {article.content}
      </div>
    </article>
  );
}
