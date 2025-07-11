"use client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Test() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/dashboard/news")}>Go to news</Button>
  );
}
