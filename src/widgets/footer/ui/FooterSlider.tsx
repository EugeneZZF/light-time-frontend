"use client";

import { useId } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const brands = Array.from({ length: 33 }, (_, index) => ({
  id: index + 1,
  src: `/brand/brand (${index + 1}).png`,
  alt: `Brand ${index + 1}`,
}));

export default function FooterSlider() {
  const sliderId = useId().replace(/:/g, "");
  const prevClassName = `footer-slider-prev-${sliderId}`;
  const nextClassName = `footer-slider-next-${sliderId}`;

  return (
    <div className="relative w-full   px-12 ">
      <button
        type="button"
        aria-label="Previous brands"
        className={`${prevClassName} absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[#cfcfcf] transition hover:text-[#9d9d9d]`}
      >
        {/* <span className="block h-6 w-6 rotate-45 border-b-2 border-l-2 border-current" /> */}
        <img src="/footer/stroke.png" alt="" className="rotate-180" />
      </button>

      <Swiper
        modules={[Navigation]}
        loop
        speed={700}
        spaceBetween={24}
        navigation={{
          prevEl: `.${prevClassName}`,
          nextEl: `.${nextClassName}`,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2.5,
          },
          960: {
            slidesPerView: 4,
          },
        }}
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id}>
            <div className="flex h-[72px] items-center justify-center">
              <img
                src={brand.src}
                alt={brand.alt}
                // width={186}
                // height={41}
                className=" w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Next brands"
        className={`${nextClassName} absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[#cfcfcf] transition hover:text-[#9d9d9d]`}
      >
        {/* <span className="block h-6 w-6 rotate-45 border-r-2 border-t-2 border-current" /> */}
        <img src="/footer/stroke.png" alt="" />
      </button>
    </div>
  );
}
