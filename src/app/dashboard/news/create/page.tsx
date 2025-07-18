"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  CloseButton,
  Portal,
  Field,
  Fieldset,
  Flex,
  Input,
  HStack,
  Spinner,
  Span,
  Select,
  createListCollection,
  FileUpload,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toaster, Toaster } from "@/components/ui/toaster";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import SidebarDashboard from "@/components/dashboard/sidebar";
// import SpinnerLoading from "@/components/spinnerLoading";

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

export default function CreateNewsPage() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);

  // ini handle Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategoryId);
    formData.append("status", selectStatus);
    if (thumbnailImage) {
      formData.append("thumbnail", thumbnailImage);
    }

    const result = await fetch("/api/news/create", {
      method: "POST",
      body: formData,
    });

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

  return (
    <>
      <Flex direction={"row"} width={"full"}>
        <SidebarDashboard />
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
                <SelectCategory
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                />
              </Field.Root>
              <Field.Root>
                <FileUpload.Root gap="1" maxWidth="300px">
                  <FileUpload.HiddenInput
                    name="thumbnail"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setThumbnailImage(file);
                    }}
                  />
                  <FileUpload.Label>Upload Thumbnail</FileUpload.Label>
                  <Input asChild>
                    <FileUpload.Trigger>
                      <FileUpload.FileText />
                    </FileUpload.Trigger>
                  </Input>
                </FileUpload.Root>
                {thumbnailImage && (
                  <Box mt={2}>
                    <Image
                      src={URL.createObjectURL(thumbnailImage)}
                      alt="Preview"
                      style={{ maxHeight: "150px", objectFit: "contain" }}
                    />
                  </Box>
                )}
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
      </Flex>
    </>
  );
}
