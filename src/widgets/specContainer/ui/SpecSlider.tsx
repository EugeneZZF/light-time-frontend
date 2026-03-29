"use client";

import { Product } from "@/entities/product/model/types";
import SmallCardProduct from "@/entities/product/ui/SmallCardProduct";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

interface SpecSliderProps {
  productSale: Product[];
}

export default function SpecSlider({ productSale }: SpecSliderProps) {
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
      className="w-[550px] "
      style={{
        padding: "10px",
        paddingLeft: "10px",
        marginLeft: "-35px",
        marginTop: "-11px",
        height: "200px",
        // paddingBottom: "10px",
      }}
    >
      {productSale.map((product) => (
        <SwiperSlide key={product.id}>
          <SmallCardProduct product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
