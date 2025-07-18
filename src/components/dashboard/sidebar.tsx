"use client";
import { Button, Flex, Link as ChakraLink, VStack } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function SidebarDashboard() {
  return (
    <>
      <Flex
        direction={"column"}
        width={"1/4"}
        backgroundColor={"gray.200"}
        height={"dvh"}
        position={"sticky"}
        top={0}
        left={0}
        paddingTop={10}
        paddingBottom={10}
        justify={"space-between"}
      >
        <VStack alignItems={"start"} width={"full"}>
          <ChakraLink
            variant={"plain"}
            paddingLeft={4}
            paddingY={3}
            _hover={{ textDecor: "none", backgroundColor: "white" }}
            transition={"background 0.5s ease-in-out"}
            _focus={{
              outline: "none",
              boxShadow: "none",
            }}
            fontWeight={"semibold"}
            width={"full"}
            asChild
          >
            <Link href={"/dashboard/news"}>Berita</Link>
          </ChakraLink>
          <ChakraLink
            variant={"plain"}
            paddingLeft={4}
            paddingY={3}
            _hover={{ textDecor: "none", backgroundColor: "white" }}
            transition={"background 0.5s ease-in-out"}
            _focus={{ outline: "none", boxShadow: "none" }}
            fontWeight={"semibold"}
            width={"full"}
            asChild
          >
            <Link href={"/dashboard/category"}>Kategori</Link>
          </ChakraLink>
        </VStack>
        <Flex width={"full"} justifyContent={"center"}>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            width={150}
          >
            Sign Out
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
