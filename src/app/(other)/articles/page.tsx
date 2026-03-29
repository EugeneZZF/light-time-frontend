import { getArticles } from "@/entities/article";
import { ArticlesContainer } from "@/widgets/articlesContainer";
// import { ArticlesNav } from "@/widgets/otherNav";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <ArticlesContainer articles={articles} />
    </>
  );
}
