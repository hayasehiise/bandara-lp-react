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
  Combobox,
  Portal,
  useListCollection,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SpinnerLoading from "@/components/spinnerLoading";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

type Category = {
  id: number;
  name: string;
};

export default function EditNewsPage() {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { collection, set } = useListCollection<Category>({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.name,
  });

  useEffect(() => {
    async function fetchData() {
      const [newsRes, catRes] = await Promise.all([
        fetch(`/api/news/${slug}`),
        fetch("/api/news/category"),
      ]);
      const news = await newsRes.json();
      const cat = await catRes.json();
      setTitle(news.title);
      setContent(news.content);
      setCategoryId(news.categoryId);
      set(cat);
      const matchedCat = cat.find(
        (cat: Category) => cat.id === news.categoryId
      );
      setInitialCategory(matchedCat?.name || "");
      setLoading(false);
    }
    fetchData();
  }, [slug, set]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    if (categoryId) {
      formData.set("category", String(categoryId));
    }

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
            <Field.Label>Kategori</Field.Label>
            <Combobox.Root
              collection={collection}
              defaultInputValue={initialCategory}
              onInputValueChange={(e) => {
                const matched = collection.items.find(
                  (item) => item.name === e.inputValue
                );
                if (matched) {
                  setCategoryId(matched.id);
                }
              }}
              name="category"
              width={"1/4"}
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
                    {collection.items?.map((data) => (
                      <Combobox.Item key={data.id} item={data}>
                        {data.name}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
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
