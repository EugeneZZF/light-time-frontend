"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const slides = ["Проект 1", "Проект 2", "Проект 3", "Проект 4"];

export default function SpecSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={2}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop
      className="w-[540px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide}>
          <div
            className="h-[180px] w-[245px] bg-neutral-200 
          p-4 flex items-end text-[18px] font-bold text-black"
          >
            {slide}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
