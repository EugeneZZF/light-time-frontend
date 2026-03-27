import ContentManager from "@/features/admin/ui/ContentManager";

export default function AdminNewsPage() {
  return (
    <ContentManager
      title="Новости"
      description="Создавайте, обновляйте и удаляйте новости, сохраняя контроль над датами публикации."
      resourcePath="news"
      includePublishedAt
    />
  );
}
