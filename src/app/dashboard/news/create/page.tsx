"use client";

import { Button, Field, Flex, Heading, Input, VStack } from "@chakra-ui/react";
// import { Editor } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TipTapEditor = dynamic(() => import("@/components/TitTapEditor"), {
  ssr: false,
});
export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  //   const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const router = useRouter();

  //   const insertImage = async (file: File) => {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const res = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     if (data.url) {
  //       editorInstance?.chain().focus().setImage({ src: data.url }).run();
  //       setUploadedImages((prev) => [...prev, data.url]);
  //     }
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const usedImages = Array.from(
  //       content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)
  //     ).map((match) => match[1]);

  //     const unusedImages = uploadedImages.filter(
  //       (url) => !usedImages.includes(url)
  //     );

  //     await Promise.all(
  //       unusedImages.map((url) =>
  //         fetch("/api/delete", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ url }),
  //         })
  //       )
  //     );

  //     const res = await fetch("/api/news/create", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ title, content }),
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       router.push(`/news/${data.slug}`);
  //     } else {
  //       alert("Gagal menyimpan");
  //     }
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usedImages = Array.from(
      content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)
    ).map((match) => match[1]);

    const unusedImages = uploadedImages.filter(
      (url) => !usedImages.includes(url)
    );

    await Promise.all(
      unusedImages.map((url) =>
        fetch("/api/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })
      )
    );

    const res = await fetch("/api/news/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/news/${data.slug}`);
    } else {
      alert("Gagal menyimpan");
    }
  };
  return (
    <>
      <Flex direction={"column"} padding={10} gap={5}>
        <Heading>Tambah Berita</Heading>
        <form onSubmit={handleSubmit}>
          <VStack width={"1/4"}>
            <Field.Root required>
              <Field.Label>
                Title Berita <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="title dari berita"
                variant={"flushed"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                marginBottom={5}
              />
            </Field.Root>
          </VStack>
          <TipTapEditor
            onChange={setContent}
            onUploadChange={(uploaded) => setUploadedImages(uploaded)}
          />
          <Button variant={"solid"} type="submit" marginTop={5}>
            Simpan
          </Button>
        </form>
      </Flex>
    </>
  );
}
