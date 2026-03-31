import type { News } from "@/entities/news/model/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getNews(): Promise<News[]> {
  try {
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    return (await response.json()) as News[];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const response = await fetch(`${baseUrl}/api/news/${slug}`, {
      next: { revalidate: 60 * 10 },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch news "${slug}": ${response.statusText}`);
    }

    return (await response.json()) as News;
  } catch (error) {
    console.error(`Failed to fetch news "${slug}":`, error);
    return null;
  }
}

export async function getLatestNews(limit: number = 4): Promise<News[]> {
  try {
    const response = await fetch(`${baseUrl}/api/news/latest?limit=${limit}`, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest news: ${response.statusText}`);
    }

    return (await response.json()) as News[];
  } catch (error) {
    console.error("Failed to fetch latest news:", error);
    return [];
  }
}
