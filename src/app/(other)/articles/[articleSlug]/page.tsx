import { notFound } from "next/navigation";
import {
  ArticlePageContent,
  getArticleBySlug,
  getArticles,
} from "@/entities/article";

// import { ArticlesNav } from "@/widgets/otherNav";

type ArticleSlugPageProps = {
  params: Promise<{
    articleSlug: string;
  }>;
};

export default async function ArticleSlugPage({
  params,
}: ArticleSlugPageProps) {
  const { articleSlug } = await params;
  const [article, articles] = await Promise.all([
    getArticleBySlug(articleSlug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* <ArticlesNav currentArticleTitle={article.title} /> */}
      <div className="flex w-full gap-[36px]">
        <ArticlePageContent article={article} />
      </div>
    </>
  );
}
