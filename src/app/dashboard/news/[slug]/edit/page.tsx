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
  Portal,
  Select,
  createListCollection,
  HStack,
  Spinner,
  Span,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SpinnerLoading from "@/components/spinnerLoading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

type SelectStatusData = {
  value: string;
  onChange: (val: string) => void;
};

type SelectCategoryData = {
  value: string;
  onChange: (val: string) => void;
};

function SelectCategory({ value, onChange }: SelectCategoryData) {
  type CategoryDataType = {
    id: string;
    name: string;
  };
  const {
    data: categories,
    isLoading,
    error,
  } = useSWR<CategoryDataType[]>("/api/category", fetcher);
  const categoryCollection = createListCollection({
    items:
      categories?.map((cat) => ({
        label: cat.name,
        value: cat.id,
      })) ?? [],
  });

  if (isLoading) {
    return (
      <HStack>
        <Spinner size="xs" borderWidth="1px" />
        <Span>Loading...</Span>
      </HStack>
    );
  }
  if (error) {
    return (
      <Span p="2" color="fg.error">
        Error fetching
      </Span>
    );
  }
  return (
    <Select.Root
      collection={categoryCollection}
      width={"320px"}
      value={value ? [value] : []}
      onValueChange={(e) => onChange(e.value[0] ?? null)}
      disabled={categoryCollection.items.length === 0}
    >
      <Select.HiddenSelect name="categoryId" />
      <Select.Label>Kategori</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Pilih Kategori" />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {categoryCollection.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

function SelectStatus({ value, onChange }: SelectStatusData) {
  const statusData = createListCollection({
    items: [
      { label: "Draft", value: "draft" },
      { label: "Publish", value: "publish" },
      { label: "Archived", value: "archive" },
    ],
  });

  return (
    <Select.Root
      collection={statusData}
      width={"320px"}
      value={value ? [value] : []}
      onValueChange={(e) => onChange(e.value[0])}
    >
      <Select.HiddenSelect name="status" />
      <Select.Label>Status</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Pilih Status" />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {statusData.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

export default function EditNewsPage() {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState("");
  // const [initialCategory, setInitialCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      // const [newsRes, catRes] = await Promise.all([
      //   fetch(`/api/news/${slug}`),
      //   fetch("/api/category"),
      // ]);
      const newsRes = await fetch(`/api/news/${slug}`);
      const news = await newsRes.json();
      // const cat = await catRes.json();
      setTitle(news.title);
      setContent(news.content);
      setCategoryId(news.categoryId);
      setStatus(news.status);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    if (categoryId) {
      formData.set("category", categoryId);
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
            <Fieldset.Legend fontSize={32}>Edit Berita</Fieldset.Legend>
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
            <SelectCategory value={categoryId} onChange={setCategoryId} />
          </Field.Root>
          <Field.Root>
            <SelectStatus value={status} onChange={setStatus} />
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
