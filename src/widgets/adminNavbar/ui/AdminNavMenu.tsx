import Link from "next/link";

type AdminNavMenuItem = {
  href: string;
  label: string;
};

const adminNavItems: AdminNavMenuItem[] = [{ href: "/admin", label: "Обзор" }];

export default function AdminNavMenu() {
  return (
    <nav className="flex flex-wrap items-center gap-3">
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-[12px] border border-[#d8e4db] bg-white/80 px-4 py-2 text-[15px] font-bold text-[#20442b] transition hover:border-[#91b89a] hover:bg-[#f4fbf5]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
