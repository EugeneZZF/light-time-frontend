import Link from "next/link";

const navigationLinks = [
  { href: "/about", label: "О нас" },
  { href: "/catalog", label: "Каталог" },
  { href: "/project", label: "Работы" },
  { href: "/contacts", label: "Контакты" },
];

const infoLinks = [
  { href: "/privacy", label: "Пользовательское соглашение" },
  { href: "#sitemap", label: "Карта сайта" },
];

export default function FooterBottom() {
  return (
    <div className="flex w-[1100px] pl-[50px]  gap-6 text-[#707070] lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-2 text-[16px] leading-[1.2]">
        <p className="text-[15px] text-[#5d7f8f]">
          &copy; 2012-2019 ООО Компания Лайт Тайм
        </p>
        <div className="flex flex-col gap-1 text-[15px]">
          {infoLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="w-fit text-[#008de0] transition hover:text-[#ff3333] underline decoration-1 decoration-[#0098dd33] underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-1 lg:px-8">
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-[22px] leading-none">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#008de0] transition hover:text-[#ff3333] underline decoration-1 decoration-[#0098dd33] underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-start gap-3 text-[14px] text-[#a8a8a8]">
          {/* <span
            aria-hidden="true"
            className="relative mt-0.5 block h-5 w-3 shrink-0 rounded-t-full border-2 border-[#a8a8a8]"
          >
            <span className="absolute left-1/2 top-[5px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#a8a8a8]" />
            <span className="absolute bottom-[-6px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#a8a8a8] bg-transparent" />
          </span> */}
          <img src="/footer/metka.png" className="h-[17px] w-[12px]" alt="" />
          <Link
            href="#address"
            className="border-b border-[#d7d7d7] leading-[1.25] transition hover:border-[#ff3333] hover:text-[#ff3333]"
          >
            127081, Москва, ул. Чермянская, д. 1, стр. 1, офис 214
          </Link>
        </div>
      </div>

      <div className="max-w-[230px] text-[15px] leading-[1.35] text-[#6b6b6b]">
        <Link
          href="#developer"
          className="border-b border-[#cfcfcf] transition hover:border-[#ff3333] hover:text-[#ff3333]"
        >
          Разработка и продвижение сайта
        </Link>{" "}
        — Студия Арт-Дизайн
      </div>
    </div>
  );
}
