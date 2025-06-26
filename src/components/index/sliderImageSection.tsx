"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Image } from "@chakra-ui/react";
import "swiper/css";

export default function SliderImage() {
  const sliderImage = [
    "/image/slider/slider-1.png",
    "/image/slider/slider-2.png",
    "/image/slider/slider-3.png",
  ];

  return (
    <>
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3500 }}
        modules={[Autoplay]}
      >
        {sliderImage.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              src={item}
              alt={"hanya slider"}
              fit={"cover"}
              width={"full"}
              height={"95%"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
