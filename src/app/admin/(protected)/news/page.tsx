import ContentManager from "@/features/admin/ui/ContentManager";

export default function AdminNewsPage() {
  return (
    <ContentManager
      title="News"
      description="Create, update and remove news items while keeping publication dates under control."
      resourcePath="news"
      includePublishedAt
    />
  );
}
