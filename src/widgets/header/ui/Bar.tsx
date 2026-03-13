import Link from "next/link";
import {
  INFO_DROPDOWN_LINKS,
  NAVIGATION_LINKS,
  NAVIGATION_LINKS_ICO,
} from "../model/links";
import { DropdownMenu } from "./DropdownMenu";

export function Bar() {
  return (
    <nav className="w-full flex bg-[#009234] items-center pt-3.75 pb-4 pl-10 pr-10 gap-26.75 shadow-[0_5px_40px_rgba(0,0,0,0.3)]">
      <div className="font-normal leading-[23px]  text-[23px] flex gap-10">
        {NAVIGATION_LINKS.map((link) =>
          link.href === "/info" ? (
            <DropdownMenu
              key={link.href}
              label={link.label}
              href={link.href}
              items={INFO_DROPDOWN_LINKS}
            />
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-[#ffff66] border-b-[1px] border-b-white/20"
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
      <div className="flex gap-[125px] text-[19px]">
        {NAVIGATION_LINKS_ICO.map((link) => (
          <div key={link.href} className="flex gap-[10px]">
            <img
              src={link.ico}
              alt="cart icon"
              className={
                link.href == "/retail"
                  ? "h-[30px] w-[19px]"
                  : "h-[30px] w-[33px]"
              }
            ></img>
            <Link
              href={link.href}
              className={
                link.href == "/cart"
                  ? "text-white hover:text-[#ffff66] font-400 text-[20px]"
                  : "text-white hover:text-[#ffff66] font-400"
              }
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
