// app/news/create/page.tsx
"use client";

import { Box, Button, Heading, Input, Stack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import TiptapEditor from "@/components/TipTapEditor";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const slug = slugify(title);
    const usedImages = Array.from(content.matchAll(/<img src="(.*?)"/g)).map(
      (m) => m[1]
    );

    const res = await fetch("/api/news/create", {
      method: "POST",
      body: JSON.stringify({ title, slug, content, images: usedImages }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toaster.create({
        description: "Berita Berhasil Tersimpan",
        type: "success",
        closable: true,
      });
      setTitle("");
      setContent("");
    } else {
      toaster.create({
        description: "Berita Gagal Tersimpan",
        type: "error",
        closable: true,
      });
    }
  };

  return (
    <Box maxW="3xl" mx="auto" mt={10} p={5}>
      <Heading mb={4}>Tambah Berita</Heading>
      <Stack gap={4}>
        <Input
          placeholder="Judul berita"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TiptapEditor content={content} onChange={setContent} />
        <Button colorScheme="blue" onClick={handleSubmit}>
          Simpan
        </Button>
      </Stack>
    </Box>
  );
}
