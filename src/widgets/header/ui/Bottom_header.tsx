import Link from "next/link";
import { CONTACT_INFO } from "../model/links";

export function BottomHeader() {
  return (
    <div className="flex h-[157px] w-full gap-[57px] pb-[25px] pl-[57px] pt-[25px]">
      <Link href={"/"}>
        <img
          src="/header/logo.png"
          alt="Light Time"
          className="h-[82px] w-[215px]"
        />
      </Link>

      <div className="flex h-[107px] w-[451px] flex-col items-start justify-start gap-[15px]">
        <div className="upper flex gap-[72px]">
          <div className="phone-cont text-nowrap">
            <div>
              <div className="flex items-center gap-[3px] text-[22px] font-bold text-black">
                <img
                  src="/header/phone.jpg"
                  alt=""
                  className="h-[19px] w-[16px]"
                />
                <p className="h-[26px] leading-[26px]">{CONTACT_INFO.phone}</p>
              </div>
              <p className="mt-[10px] pl-[21px] text-[12px] leading-[12px] text-[#666666]">
                {CONTACT_INFO.hours}
              </p>
            </div>
          </div>

          <div className="mail-cont flex h-[24px] items-center gap-[3px]">
            <img
              src="/header/mail.jpg"
              alt="Mail"
              className="mb-[-5px] h-[18px] w-[36px]"
            />
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-nowrap text-[18px] leading-[12px] text-[#0098DD] underline"
            >
              {CONTACT_INFO.email}
            </a>
          </div>
        </div>

        <form
          action="/search"
          method="get"
          className="relative flex h-[43px] w-full items-center border-[3px] border-white bg-[#f3f3f3] font-bold text-[#666666] shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)]"
          style={{ paddingLeft: "15px", paddingRight: "45px" }}
        >
          <input
            name="q"
            placeholder="Поиск по каталогу"
            className="w-full border-none bg-transparent font-[18px] leading-[18px] outline-none"
          />
          <button
            type="submit"
            aria-label="Искать"
            className="absolute right-[15px]"
          >
            <img
              src="/header/search.jpg"
              alt="Поиск"
              className="h-[24px] w-[21px]"
            />
          </button>
        </form>
      </div>

      <div className="ml-[20px] flex w-[170px] gap-[5px]">
        <img src="/header/list.jpg" alt="" className="h-[22px] w-[18px]" />
        <div className="flex flex-col">
          <a
            href="/price.xls"
            download="price.xls"
            className="text-[18px] leading-[18px] text-[#0098DD] underline"
          >
            Скачать оптовый прайс-лист
          </a>
          <p className="text-[14px] text-[#666666]">от 18.02.2026, 29.4 Мб</p>
        </div>
      </div>
    </div>
  );
}
