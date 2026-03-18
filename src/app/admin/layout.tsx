import { AdminNavbar } from "@/widgets/adminNavbar";
import { adminSessionCookie, verifyAdminSession } from "@/shared/lib/auth/adminSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(adminSessionCookie.name)?.value;
  const session = await verifyAdminSession(sessionValue);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="w-full px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <AdminNavbar email={session.email} />
        <div>{children}</div>
      </div>
    </section>
  );
}
