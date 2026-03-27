import Link from "next/link";
import { Article } from "@/entities/article";

type ArticlesContainerProps = {
  articles: Article[];
  activeArticleSlug?: string;
};

function getArticleHref(slug: string) {
  return `/articles/${slug}`;
}

export default function ArticlesContainer({
  articles,
  activeArticleSlug,
}: ArticlesContainerProps) {
  return (
    <section className="w-[730px]">
      <h1 className="mb-[15px] text-[28px] leading-[1.18] font-bold tracking-[-0.02em] text-[#00a040]">
        Полезная информация
      </h1>

      <ul className="ml-[18px] list-disc pl-[18px] text-[16px] leading-[1] marker:text-[#5b5b5b]">
        {articles.map((item) => (
          <li key={item.slug} className="mb-[2px] pl-[1px] text-[#5b5b5b]">
            <Link
              href={getArticleHref(item.slug)}
              className={`font-normal underline decoration-[1px] underline-offset-[1px] ${
                activeArticleSlug === item.slug
                  ? "text-[#ff3333] decoration-[#ff3333]"
                  : "text-[#0099ff] decoration-[#0099ff] hover:text-[#ff3333] hover:decoration-[#ff3333]"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
