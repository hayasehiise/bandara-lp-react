"use client";
import SidebarDashboard from "@/components/dashboard/sidebar";
import { Flex } from "@chakra-ui/react";
export default function DashboardPage() {
  return (
    <>
      <Flex direction={"row"} width={"full"}>
        <SidebarDashboard />
        <Flex direction={"column"} width={"full"}>
          {/*  */}
        </Flex>
      </Flex>
    </>
  );
}
