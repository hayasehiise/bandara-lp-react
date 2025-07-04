"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Field,
  Fieldset,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SpinnerLoading from "@/components/spinnerLoading";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

export default function EditNewsPage() {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/news/${slug}`);
      const json = await res.json();
      setTitle(json.title);
      setContent(json.content);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);

    const res = await fetch(`/api/news/${slug}/edit`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      sessionStorage.setItem("flash", "Berita Berhasil Diedit");
      router.push("/dashboard/news");
    }
  }

  if (loading) return <SpinnerLoading />;

  return (
    <Box width={"full"} mx="auto" gap={5} py={10} px={4}>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root>
          <Flex direction={"row"} justify={"space-between"}>
            <Fieldset.Legend fontSize={32}>Tambah Berita</Fieldset.Legend>
            <Link href={"/dashboard/news"}>
              <CloseButton variant={"ghost"} size={"xl"} />
            </Link>
          </Flex>
          <Field.Root>
            <Field.Label>Title Berita</Field.Label>
            <Input
              width={"1/4"}
              id="title"
              name="title"
              type="text"
              placeholder="Masukkan judul berita"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Konten Berita</Field.Label>
            <input type="hidden" name="content" value={content} />
            <TinyEditor value={content} onChange={setContent} />
          </Field.Root>
        </Fieldset.Root>
        <Button
          marginTop={5}
          type="submit"
          colorScheme="blue"
          alignSelf="flex-end"
        >
          Simpan Berita
        </Button>
      </form>
    </Box>
  );
}
