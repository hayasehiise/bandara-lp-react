"use client";

import { useState } from "react";
import { useAsync } from "react-use";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  CloseButton,
  Combobox,
  Portal,
  useListCollection,
  Field,
  Fieldset,
  Flex,
  Input,
  HStack,
  Spinner,
  Span,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import prisma from "@/lib/prisma";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

type Category = {
  id: number;
  title: string;
};
export default function CreateNewsPage() {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const router = useRouter();

  const { collection, set } = useListCollection<Category>({
    initialItems: [],
    itemToString: (item) => item.title,
    itemToValue: (item) => item.title,
  });
  const state = useAsync(async () => {
    const res = await fetch("/api/news/category");
    const json = await res.json();
    set(json);
  }, [set]);

  // ini handle Submit Form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategoryId);

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
            <Field.Label>Kategori</Field.Label>
            <Combobox.Root
              collection={collection}
              onInputValueChange={(e) => {
                const matched = collection.items.find(
                  (item) => item.title === e.inputValue
                );
                if (matched) {
                  setSelectedCategoryId(matched.id.toString());
                }
              }}
              name="category"
            >
              <Combobox.Control>
                <Combobox.Input placeholder="Pilih Kategori" />
                <Combobox.IndicatorGroup>
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content>
                    {state.loading ? (
                      <HStack>
                        <Spinner size="xs" borderWidth="1px" />
                        <Span>Loading...</Span>
                      </HStack>
                    ) : state.error ? (
                      <Span p="2" color="fg.error">
                        Error fetching
                      </Span>
                    ) : (
                      collection.items?.map((data) => (
                        <Combobox.Item key={data.id} item={data}>
                          {data.title}
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))
                    )}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
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
