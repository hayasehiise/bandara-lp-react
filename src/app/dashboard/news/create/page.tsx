"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

export default function CreateNewsPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const res = await fetch("/api/news/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem("flash", `${data.message}`);
      router.push("/dashboard/news");
    } else {
      toaster.create({
        description: data.error,
        type: "error",
      });
    }
  }
  return (
    <Box width={"full"} mx="auto" gap={5} py={10} px={4}>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <Fieldset.Root>
          <Fieldset.Legend fontSize={32}>Tambah Berita</Fieldset.Legend>
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
