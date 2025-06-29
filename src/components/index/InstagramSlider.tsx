"use client";
import { InstagramEmbed } from "react-social-media-embed";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Flex } from "@chakra-ui/react";

export default function InstagramSlider() {
  const instagramFeed = [
    "https://www.instagram.com/reel/DIf-O3Xyugm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/reel/DHfXaQVSMgX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/reel/DHXYcfqyhS7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/p/DHC09VlybSG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/reel/C_MjirivE4k/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/reel/C937dWUvd3-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "https://www.instagram.com/reel/C9yZTkovFMX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  ];

  return (
    <>
      <Flex width={"full"}>
        <Swiper
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          spaceBetween={10}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Autoplay, Pagination, Scrollbar, A11y]}
          loop={true}
          autoplay={{ delay: 3500 }}
        >
          {instagramFeed.map((item, index) => (
            <SwiperSlide key={index}>
              <Flex justifyContent={"center"} width={"full"}>
                <InstagramEmbed url={item} width={"100%"} />
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Flex>
    </>
  );
}
