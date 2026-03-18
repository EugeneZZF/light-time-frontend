import AdminNavMenu from "./AdminNavMenu";

type AdminNavbarProps = {
  email: string;
};

export default function AdminNavbar({ email }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-20 mb-8 overflow-hidden rounded-[24px] border border-[#d7e4db] bg-[linear-gradient(135deg,#fbfefb_0%,#f0f8f1_55%,#fff7ea_100%)] shadow-[0_20px_50px_rgba(25,73,37,0.08)]">
      <div className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#67816c]">
              Admin Panel
            </p>
            <h1 className="mt-2 text-[28px] font-bold leading-none text-[#163d20]">
              Light Time
            </h1>
          </div>

          <AdminNavMenu />
        </div>

        <div className="flex flex-col items-start gap-3 rounded-[18px] border border-[#d9e5dc] bg-white/75 px-4 py-4 md:items-end">
          <div className="text-[14px] text-[#57715d]">Signed in as</div>
          <div className="text-[16px] font-bold text-[#1a4024]">{email}</div>

          <form action="/api/admin/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-[12px] bg-[#143f20] px-4 py-2 text-[15px] font-bold text-white transition hover:bg-[#1b572c]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
