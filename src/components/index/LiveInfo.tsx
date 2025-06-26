"use client";
import { Box, Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

export default function LiveInfoAirplane() {
  const [showArrival, setShowArrival] = useState(false);
  const [showDeparture, setShowDeparture] = useState(false);
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
          <Button
            onClick={() => {
              setShowArrival(!showArrival);
              setShowDeparture(false);
            }}
          >
            <FaPlaneArrival />
            <Heading size={"2xl"}>Arrival</Heading>
          </Button>
          <Button
            onClick={() => {
              setShowDeparture(!showDeparture);
              setShowArrival(false);
            }}
          >
            <FaPlaneDeparture />
            <Heading size={"2xl"}>Departure</Heading>
          </Button>
        </HStack>
        {/* IFrame Live Schedule Bandara */}
        {showArrival && (
          <Box width={"full"}>
            <iframe
              title="arrival"
              src="http://36.91.63.220/en/display/single/arrival-information-1366/?pagetype=CMS&type=PCTV&addr=13.13.13.13"
              className="w-[92.3%] h-dvh "
            />
          </Box>
        )}
        {showDeparture && (
          <Box width={"full"}>
            <iframe
              title="Departure"
              src="http://36.91.63.220/en/display/single/departure-information-1366/?pagetype=PCTV&addr=12.12.12.12"
              className="w-[92.3%] h-dvh"
            />
          </Box>
        )}
      </Flex>
    </>
  );
}
