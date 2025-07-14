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
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toaster, Toaster } from "@/components/ui/toaster";

const TinyEditor = dynamic(() => import("@/components/TinyEditor"), {
  ssr: false,
});

type Category = {
  id: number;
  name: string;
};

type SelectStatusData = {
  value: string;
  onChange: (val: string) => void;
};

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
      <Select.HiddenSelect />
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

export default function CreateNewsPage() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<string>("");

  // ini handle Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategoryId);
    formData.append("status", selectStatus);

    const result = await fetch("/api/news/create", {
      method: "POST",
      body: formData,
    });

    // const data = await result.json();
    // console.log(result.ok);

    if (!result.ok) {
      toaster.create({
        description: "gagal",
        type: "error",
      });
    } else {
      sessionStorage.setItem("flash", "data berhasil diinput");
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard/news");
      }, 1000);
    }
  };

  const { collection, set } = useListCollection<Category>({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.name,
  });
  const state = useAsync(async () => {
    const res = await fetch("/api/category");
    const json = await res.json();
    set(json);
  }, [set]);

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
                  (item) => item.name === e.inputValue
                );
                if (matched) {
                  setSelectedCategoryId(matched.id.toString());
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
                          {data.name}
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
            <SelectStatus value={selectStatus} onChange={setSelectStatus} />
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
