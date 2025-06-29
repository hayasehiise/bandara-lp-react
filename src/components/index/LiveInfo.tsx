"use client";
import { Box, Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

export default function LiveInfoAirplane() {
  const [showActiveIframe, setShowActiveIframe] = useState<string | null>(null);

  const toggleIframe = (id: string) => {
    setShowActiveIframe((prev) => (prev === id ? null : id));
  };
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
          <Button onClick={() => toggleIframe("arrival")}>
            <FaPlaneArrival />
            <Heading size={"2xl"}>Arrival</Heading>
          </Button>
          <Button onClick={() => toggleIframe("departure")}>
            <FaPlaneDeparture />
            <Heading size={"2xl"}>Departure</Heading>
          </Button>
        </HStack>
        {/* IFrame Live Schedule Bandara */}
        {showActiveIframe === "arrival" && (
          <Box width={"full"} overflow={"scroll"}>
            <iframe
              title="arrival"
              src="http://36.91.63.220/en/display/single/arrival-information-1366/?pagetype=CMS&type=PCTV&addr=13.13.13.13"
              className="w-[1366px] h-dvh"
            />
          </Box>
        )}
        {showActiveIframe === "departure" && (
          <Box width={"full"} overflow={"scroll"}>
            <iframe
              title="Departure"
              src="http://36.91.63.220/en/display/single/departure-information-1366/?pagetype=PCTV&addr=12.12.12.12"
              className="w-[1366px] h-dvh"
            />
          </Box>
        )}
      </Flex>
    </>
  );
}
