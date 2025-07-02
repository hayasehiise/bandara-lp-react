"use client";
import { prisma } from "@/lib/prisma";
import { Box, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardNewsPage() {
  useEffect(() => {
    const flash = sessionStorage.getItem("flash");
    if (flash) {
      queueMicrotask(() => {
        toaster.create({
          description: flash,
          type: "success",
        });
      });
    }
  }, []);

  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>
        Daftar Berita
      </Text>
      {/* Tampilkan daftar berita di sini */}
      <Toaster />
    </Box>
  );
}
