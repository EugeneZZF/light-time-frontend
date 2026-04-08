import { unstable_cache } from "next/cache";
import { Article } from "../model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

type ArticlesResponse =
  | Article[]
  | {
      items?: Article[];
      articles?: Article[];
      data?: Article[];
    };

function extractArticles(data: ArticlesResponse): Article[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.articles)) {
    return data.articles;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 60 * 10 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data: ArticlesResponse = await response.json();

    return extractArticles(data);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export const getArticles = unstable_cache(fetchArticles, ["articles"], {
  revalidate: 60 * 10,
  tags: ["articles"],
});
