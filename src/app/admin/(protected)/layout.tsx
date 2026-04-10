// import {
//   adminSessionCookie,
//   verifyAdminSession,
// } from "@/shared/lib/auth/adminSession";
import { AdminSidebar } from "@/widgets/adminShell";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AuthGuard } from "./AuthGuard";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  // const cookieStore = await cookies();
  // const sessionValue = cookieStore.get(adminSessionCookie.name)?.value;
  // const session = await verifyAdminSession(sessionValue);

  // if (!session) {
  //   redirect("/admin/login");
  // }

  return (
    <AuthGuard>
      <section className="min-h-screen bg-[linear-gradient(180deg,#f6f5ef_0%,#f9fbf7_45%,#eef5ef_100%)] px-4 py-6 md:px-6">
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AdminSidebar email={"admin@example.com"} />
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </AuthGuard>
  );
}
