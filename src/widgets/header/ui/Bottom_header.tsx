import Link from "next/link";
import { CONTACT_INFO } from "../model/links";

export function BottomHeader() {
  return (
    <div className="w-full  h-[157px] pt-[25px] pb-[25px] pl-[57px] gap-[57px] flex">
      <img src="/header/logo.png" alt="Logo" className="w-[215px] h-[82px]" />
      <div className="w-[451px] h-[107px]  flex-col gap-[15px] flex items-start justify-start">
        <div className="upper flex gap-[72px]">
          <div className="phone-cont text-nowrap">
            <div>
              <div className="flex gap-[3px] text-[22px] text-black font-bold items-center ">
                <img
                  src="/header/phone.jpg"
                  className="w-[16px] h-[19px]"
                ></img>
                <p className="h-[26px] leading-[26px]">{CONTACT_INFO.phone}</p>
              </div>
              <p
                className="pl-[21px] mt-[10px] text-[#666666]
              text-[12px] leading-[12px] 
              "
              >
                {CONTACT_INFO.hours}
              </p>
            </div>
          </div>
          <div className="mail-cont flex h-[24px] items-center gap-[3px]">
            <img
              src="/header/mail.jpg"
              alt="Logo"
              className="w-[36px] h-[18px] mb-[-5px]"
            />
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-[12px] text-nowrap text-[#0098DD] text-[18px] leading-[12px] underline"
            >
              {CONTACT_INFO.email}
            </a>
          </div>
        </div>
        {/* <div className="down w-full"></div> */}
        <div
          className="w-full bg-[#f3f3f3] border-[3px] shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] border-white text-[#666666] flex items-center relative font-bold h-[43px]"
          style={{ paddingLeft: "15px", paddingRight: "45px" }}
        >
          <input
            placeholder="Поиск по каталогу"
            className="w-full active:none border-none outline-none bg-transparent font-[18px] leading-[18px]"
          ></input>
          <img
            src="/header/search.jpg"
            alt="Logo"
            className="w-[21px] h-[24px] absolute right-[15px]"
          />
        </div>
      </div>
      <div className="flex  w-[170px] ml-[20px] gap-[5px] ">
        <img src="/header/list.jpg" className="w-[18px] h-[22px]"></img>
        <div className="flex flex-col">
          <Link
            href={"/"}
            className="text-[#0098DD] underline 
            
            line-[23.4px] text-[18px] leading-[18px]
            "
          >
            Скачать оптовый прайс-лист
          </Link>
          <p className="text-[14px] text-[#666666]">от 18.02.2026, 29.4 Мб</p>
        </div>
      </div>
    </div>
  );
}
