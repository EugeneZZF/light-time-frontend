import Link from "next/link";

export default function ArticlesNav() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-[14px] flex items-center gap-[28px] text-[13px] leading-[1.2] text-[#666666]"
    >
      <Link href="/" className="text-[#666666] hover:text-[#ff3333]">
        Главная
      </Link>
      <span className="text-[#666666]">Статьи</span>
    </nav>
  );
}
