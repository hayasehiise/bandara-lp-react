"use client";

import SpinnerLoading from "@/components/spinnerLoading";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};
export default function DashboardCategoryPage() {
  const [name, setname] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/news/category");
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);
  if (loading) {
    return <SpinnerLoading />;
  }
  return (
    <>
      <Flex>List Kategori</Flex>
    </>
  );
}
