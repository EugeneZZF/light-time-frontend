import { Article } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
    next: { revalidate: 60 * 10 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch article "${slug}": ${response.statusText}`);
  }

  const article: Article = await response.json();

  return article;
}
