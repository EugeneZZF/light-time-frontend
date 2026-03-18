import { News } from "../model/types";
import { unstable_cache } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchLatestNews = async (limit: number = 4): Promise<News[]> => {
  const response = await fetch(`${baseUrl}/api/news/latest?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest news: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("news:", data);
  return data;
};

export const getNewsLatest = unstable_cache(fetchLatestNews, ["latestNews"], {
  revalidate: 60 * 60, // 1 hour
  tags: ["latestNews"],
});
