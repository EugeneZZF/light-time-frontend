import ContentManager from "@/features/admin/ui/ContentManager";

export default function AdminArticlesPage() {
  return (
    <ContentManager
      title="Статьи"
      description="Управляйте постоянными статьями и поддерживайте статический контент сайта в актуальном состоянии."
      resourcePath="articles"
    />
  );
}
