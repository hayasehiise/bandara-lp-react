"use client";
import { Box, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

export default function DashboardNewsPage() {
  useEffect(() => {
    const flash = sessionStorage.getItem("flash");
    if (flash) {
      //   toast({
      //     title: message,
      //     status: "success",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      toaster.create({
        description: flash,
        type: "success",
      });
    }
  }, []);

  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>
        Daftar Berita
      </Text>
      {/* Tampilkan daftar berita di sini */}
    </Box>
  );
}
