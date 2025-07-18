"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import "../../app/shapeDivider.css";
import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaArrowDown, FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Image } from "@chakra-ui/react";
import "swiper/css";
import dynamic from "next/dynamic";

const InstagramSlider = dynamic(() => import("./InstagramSlider"), {
  ssr: false,
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function IndexComponents() {
  // ref Const
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionLiveInfoRef = useRef<HTMLDivElement>(null);
  //   ==================================================
  // section Image Slider const and function
  const sliderImage = [
    "/image/slider/slider-1.png",
    "/image/slider/slider-2.png",
    "/image/slider/slider-3.png",
    "/image/slider/slider-4.png",
    "/image/slider/slider-5.png",
  ];
  //   ==============================================

  //   animation Hook
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play reverse play reverse",
          markers: false,
        },
      });

      tl.fromTo(
        [
          "#title-heading",
          "#subtitle-heading",
          "#subtitle-context",
          "#scroll-more",
        ],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.3 }
      ).to("#arrow", { y: 12, ease: "power1.inOut", repeat: -1, yoyo: true });

      return () => tl.scrollTrigger?.kill();
    },
    { scope: sectionRef }
  );
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionLiveInfoRef.current,
          start: "center bottom",
          end: "center top",
          toggleActions: "play reverse play reset",
          markers: false,
        },
      });
      tl.fromTo(
        "#button-arrival",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      ).fromTo(
        "#button-departure",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      );
      return () => tl.scrollTrigger?.kill();
    },
    { scope: sectionLiveInfoRef }
  );
  //   ===================================================================================

  return (
    <>
      <Flex
        ref={sectionRef}
        position={"relative"}
        height={"dvh"}
        backgroundImage={"url('/image/hero-background.jpg')"}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {/* Background Overlay */}
        <Box
          position={"absolute"}
          top={0}
          left={0}
          height={"full"}
          width={"full"}
          backgroundGradient={"to-tl"}
          gradientFrom={"green.500"}
          gradientTo={"blue.500"}
          opacity={0.6}
          zIndex={1}
        ></Box>
        {/* End Background Overlay */}
        {/* Shape Divider */}
        <Box className="custom-shape-divider-top-1750899544">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </Box>
        {/* End Shape Divider */}
        {/* Hero Headinng */}
        <Flex
          position={"relative"}
          zIndex={2}
          textAlign={"center"}
          direction={"column"}
        >
          <Heading
            id="title-heading"
            size={"6xl"}
            fontWeight={"bold"}
            color={"white"}
            textTransform={"uppercase"}
            cursor={"default"}
          >
            Bandara Mutiara Sis Al-Jufri
          </Heading>
          <Heading
            id="subtitle-heading"
            size={"3xl"}
            color={"white"}
            cursor={"default"}
          >
            Official Website Bandara Mutiara Sis Al-Jufri
          </Heading>
          <Heading
            id="subtitle-context"
            fontWeight={"light"}
            color={"white"}
            cursor={"default"}
          >
            | Informasi Penerbangan | Airlines | Berita | Profil |
          </Heading>
          <Flex
            direction={"column"}
            justify={"center"}
            alignItems={"center"}
            marginTop={30}
            color={"white"}
            id="scroll-more"
          >
            <Text>Scroll for more</Text>
            <FaArrowDown id="arrow" />
          </Flex>
        </Flex>
        {/* End Hero Heading */}
      </Flex>
      {/* End of Hero Section */}
      {/* Start of Image Slider */}
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay]}
      >
        {sliderImage.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              src={item}
              alt={"hanya slider"}
              fit={"cover"}
              width={"full"}
              height={"80%"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* end of Image Slider */}
      {/* start of Live Info Penerbangan */}
      <Flex
        direction={"column"}
        padding={5}
        justify={"center"}
        textAlign={"center"}
        backgroundColor={"green.400"}
        ref={sectionLiveInfoRef}
      >
        <Heading color={"white"} size={"4xl"} fontWeight={"bold"}>
          Info Live Penerbangan
        </Heading>
        <HStack justify={"center"} marginTop={3} marginBottom={5}>
          <Button asChild id="button-arrival">
            <ChakraLink asChild color={"white"} textDecoration={"none"}>
              <Link
                href={
                  "http://36.91.63.220/en/display/single/arrival-information-1366/?pagetype=CMS&type=PCTV&addr=13.13.13.13"
                }
                target="_blank"
              >
                <FaPlaneArrival />
                <Heading size={"2xl"}>Arrival</Heading>
              </Link>
            </ChakraLink>
          </Button>
          <Button asChild id="button-departure">
            <ChakraLink asChild color={"white"} textDecoration={"none"}>
              <Link
                href={
                  "http://36.91.63.220/en/display/single/departure-information-1366/?pagetype=PCTV&addr=12.12.12.12"
                }
                target="_blank"
              >
                <FaPlaneDeparture />
                <Heading size={"2xl"}>Departure</Heading>
              </Link>
            </ChakraLink>
          </Button>
        </HStack>
      </Flex>
      {/* end of Live Info Penerbangan */}
      {/* start of Instagram Reels */}
      <Flex padding={10}>
        <InstagramSlider />
      </Flex>
      {/* end of Instagram Reels */}
    </>
  );
}
