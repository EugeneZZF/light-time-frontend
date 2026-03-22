import AdminSidebarMenu from "./AdminSidebarMenu";

type AdminSidebarProps = {
  email: string;
};

export default function AdminSidebar({ email }: AdminSidebarProps) {
  return (
    <aside className="sticky top-6 flex h-fit flex-col gap-5 rounded-[28px] border border-[#d5e0d7] bg-[radial-gradient(circle_at_top,#fdf7ea_0%,#f6fbf7_42%,#eef5ef_100%)] p-5 shadow-[0_25px_60px_rgba(19,53,35,0.08)]">
      <div className="rounded-[22px] bg-[#163322] px-4 py-5 text-white">
        <div className="text-[12px] uppercase tracking-[0.22em] text-[#b9cfbf]">
          Light Time
        </div>
        <div className="mt-3 text-[28px] font-bold leading-none">Admin</div>
        <div className="mt-4 text-[13px] text-[#d8e7dc]">{email}</div>
      </div>

      <AdminSidebarMenu />

      <form action="/api/admin/auth/logout" method="post" className="mt-2">
        <button
          type="submit"
          className="w-full rounded-[16px] border border-[#d9e3db] bg-white px-4 py-3 text-[15px] font-bold text-[#173523] transition hover:border-[#9bb9a2] hover:bg-[#f7fbf8]"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
