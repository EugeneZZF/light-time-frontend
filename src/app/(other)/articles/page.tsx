// import { getArticles } from "@/entities/article";
import { fetchArticles } from "@/entities/article/api/getArticles";
import { ArticlesContainer } from "@/widgets/articlesContainer";
// import { ArticlesNav } from "@/widgets/otherNav";

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <>
      <ArticlesContainer articles={articles} />
    </>
  );
}
