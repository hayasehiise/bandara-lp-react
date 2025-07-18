"use client";
import {
  Accordion,
  Button,
  Flex,
  Span,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
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
        <VStack alignItems={"start"}>
          <Accordion.Root variant={"subtle"} collapsible>
            <Accordion.Item value="news">
              <Accordion.ItemTrigger
                backgroundColor={"gray.200"}
                color={"black"}
                borderRadius={0}
              >
                <Span>Berita</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent
                backgroundColor={"gray.200"}
                color={"white"}
                borderRadius={0}
              >
                <Accordion.ItemBody>
                  <VStack alignItems={"start"} paddingLeft={4}>
                    <ChakraLink variant={"plain"} asChild>
                      <Link href={"/dashboard/news"}>List Berita</Link>
                    </ChakraLink>
                    <ChakraLink variant={"plain"} asChild>
                      <Link href={"/dashboard/news/create"}>Tambah Berita</Link>
                    </ChakraLink>
                  </VStack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
          <ChakraLink
            variant={"plain"}
            paddingLeft={4}
            _hover={{ textDecor: "none" }}
            _focus={{ outline: "none", boxShadow: "none" }}
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
