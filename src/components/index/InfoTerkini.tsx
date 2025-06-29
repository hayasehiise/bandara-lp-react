"use client";
import { Flex, Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

export default function InfoTerkini() {
  const InstagramSlider = dynamic(
    () => import("@/components/index/InstagramSlider"),
    {
      ssr: false,
    }
  );
  return (
    <>
      <Flex
        direction={"column"}
        justify={"center"}
        alignItems={"center"}
        padding={"5"}
        gap={5}
      >
        <Heading size={"4xl"} fontWeight={"bold"}>
          Info Terkini
        </Heading>
        {/* Instagram Slider */}
        <InstagramSlider />
        {/* End Instagram Slider */}
      </Flex>
    </>
  );
}
