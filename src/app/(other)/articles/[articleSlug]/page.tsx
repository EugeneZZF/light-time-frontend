import { notFound } from "next/navigation";
import {
  ArticlePageContent,
  getArticleBySlug,
  getArticles,
} from "@/entities/article";
import { ArticlesContainer } from "@/widgets/articlesContainer";

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
    <div className="flex w-full gap-[36px]">
      <ArticlesContainer
        articles={articles}
        activeArticleSlug={articleSlug}
      />
      <ArticlePageContent article={article} />
    </div>
  );
}
