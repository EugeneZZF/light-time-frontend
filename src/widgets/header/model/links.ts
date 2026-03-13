import { NavLinkHeader } from "./types";

export const NAVIGATION_LINKS: NavLinkHeader[] = [
  { href: "/catalog", label: "Каталог" },
  { href: "/projects", label: "Проекты" },
  { href: "/info", label: "Информация" },
  // { href: "/retail", label: "Розничный магазин" },
  // { href: "/cart", label: "Ваша корзина" },
];

export const INFO_DROPDOWN_LINKS: NavLinkHeader[] = [
  { href: "/about", label: "О компании" },
  { href: "/delivery", label: "Доставка" },
  { href: "/articles", label: "Статьи" },
  { href: "/contacts", label: "Контакты" },
];
export const NAVIGATION_LINKS_ICO: NavLinkHeader[] = [
  { href: "/retail", label: "Розничный магазин", ico: "/header/magaz.jpg" },
  { href: "/cart", label: "Ваша корзина", ico: "/header/cart.jpg" },
];

export const CONTACT_INFO = {
  phone: "8 (495) 268-06-55",
  hours: "9:00—18:00 (пн-пт)",
  email: "info@light-time.ru",
};
