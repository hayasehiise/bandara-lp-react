"use client";
import {
  Button,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

export default function LiveInfoAirplane() {
  return (
    <>
      <Flex
        direction={"column"}
        padding={5}
        justify={"center"}
        textAlign={"center"}
        backgroundColor={"green.400"}
      >
        <Heading color={"black"} size={"4xl"} fontWeight={"bold"}>
          Info Live Penerbangan
        </Heading>
        <HStack justify={"center"} marginTop={3} marginBottom={5}>
          <Button asChild>
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
          <Button asChild>
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
    </>
  );
}
