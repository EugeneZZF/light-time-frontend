"use client";

import { useMemo, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

type ProjectImageGalleryProps = {
  images: {
    sortOrder: number;
    url: string;
  }[];
  title: string;
};

export default function ProjectImageGallery({
  images,
  title,
}: ProjectImageGalleryProps) {
  const orderedImages = useMemo(
    () => [...images].sort((left, right) => left.sortOrder - right.sortOrder),
    [images],
  );
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-[515px] w-[765px]">
      {orderedImages.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          autoplay={
            orderedImages.length > 1
              ? {
                  delay: 5000,
                  disableOnInteraction: false,
                }
              : false
          }
          loop={orderedImages.length > 1}
          slidesPerView={1}
          className="w-full"
        >
          {orderedImages.map((image, index) => (
            <SwiperSlide key={`${image.url}-${index}`}>
              <div
                className="aspect-[16/10] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
                aria-label={`${title} ${index + 1}`}
                role="img"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#f1f1f1] text-[16px] text-[#7a7a7a]">
          No image
        </div>
      )}

      {orderedImages.length > 1 ? (
        <div className="mt-[14px] flex justify-center gap-[10px]">
          {orderedImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => swiper?.slideToLoop(index)}
                className={`h-[16px] w-[16px] rounded-full border transition ${
                  isActive
                    ? "border-[#3a9f49] bg-[#3a9f49]"
                    : "border-[#3a9f49] bg-white hover:bg-[#dff1e2]"
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={isActive}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
