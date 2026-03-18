import { adminSessionCookie, verifyAdminSession } from "@/shared/lib/auth/adminSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Admin() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(adminSessionCookie.name)?.value;
  const session = await verifyAdminSession(sessionValue);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col gap-6 px-6 py-16">
      <div className="rounded-[24px] border border-[#d9e7db] bg-[linear-gradient(180deg,#f8fff9_0%,#eefaf0_100%)] p-8 shadow-[0_20px_60px_rgba(0,94,36,0.08)]">
        <p className="mb-2 text-[14px] uppercase tracking-[0.18em] text-[#4d8a5b]">
          Admin Area
        </p>
        <h1 className="text-[36px] font-bold leading-none text-[#0f4f22]">
          Dashboard
        </h1>
        <p className="mt-4 text-[18px] text-[#30533a]">
          You are signed in as <span className="font-bold">{session.email}</span>.
        </p>
      </div>
    </section>
  );
}
