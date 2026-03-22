import ContentManager from "@/features/admin/ui/ContentManager";

export default function AdminPagesPage() {
  return (
    <ContentManager
      title="Pages"
      description="Manage evergreen pages and keep static content available for the website."
      resourcePath="pages"
    />
  );
}
