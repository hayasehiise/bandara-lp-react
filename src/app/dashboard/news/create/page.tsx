"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { createNews } from "./action";
import { useRouter } from "next/navigation";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

export default function CreateNewsPage() {
  const [content, setContent] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await createNews(formData);
    sessionStorage.setItem("flash", "Berita berhasil ditambahkan!");
    router.push("/dashboard/news");
  }
  return (
    <Box width={"full"} mx="auto" gap={5} py={10} px={4}>
      <form action={handleSubmit}>
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
