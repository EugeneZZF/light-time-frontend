import { getArticles } from "@/entities/article";
import { ArticlesContainer } from "@/widgets/articlesContainer";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesContainer articles={articles} />;
}
