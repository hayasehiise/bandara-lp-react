"use client";

import SpinnerLoading from "@/components/spinnerLoading";
import { Toaster, toaster } from "@/components/ui/toaster";
import {
  Flex,
  Text,
  Button,
  Table,
  Pagination,
  ButtonGroup,
  Dialog,
  Portal,
  // VStack,
  Field,
  Input,
  HStack,
} from "@chakra-ui/react";
import { FcEditImage, FcEmptyTrash } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};
export default function DashboardCategoryPage() {
  const [page, setPage] = useState<number>(1);
  const [newCategory, setNewcategory] = useState<string>("");
  const [updateCategory, setUpdateCategory] = useState<string>("");

  const { data, error, isLoading, mutate } = useSWR(
    `/api/category/list?page=${page}&limit=10`,
    fetcher
  );
  const categories: Category[] = data?.data || [];
  const total = data?.pagination.total || 0;

  async function handleAddCantegory() {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/category/create", {
      method: "POST",
      body: JSON.stringify({ name: newCategory }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setNewcategory("");
      await mutate();
      toaster.create({
        description: "Kategori Berhasil Ditambahkan",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Kategori Gagal Ditambahkan",
        type: "error",
      });
    }
  }

  function resetAddCatgory() {
    setNewcategory("");
  }

  async function handleDeleteCategory(id: string) {
    const res = await fetch(`/api/category/${id}/delete`, {
      method: "DELETE",
    });
    if (res.ok) {
      await mutate();
      toaster.create({
        description: "Kategori Berhasil Dihapus",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Kategori Tidak Berhasil Dihapus",
        type: "error",
      });
    }
  }

  async function handleUpdateCategory(id: string) {
    const res = await fetch(`/api/category/${id}/edit`, {
      method: "PUT",
      body: JSON.stringify({ name: updateCategory }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      await mutate();
      toaster.create({
        description: "Kategori Berhasil Diupdate",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Kategori Gagal Diupdate",
        type: "error",
      });
    }
  }

  if (isLoading) return <SpinnerLoading />;

  if (error) return <h1>Gagal Memuat Data</h1>;

  return (
    <>
      <Flex direction={"column"} width={"full"} gap={5} padding={10}>
        <Flex direction={"row"} justify={"space-between"}>
          <Text fontSize="2xl">Daftar Kategori</Text>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button>Tambah Kategori</Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.CloseTrigger asChild>
                    <Button variant={"ghost"} onClick={resetAddCatgory}>
                      <RxCross2 size={60} />
                    </Button>
                  </Dialog.CloseTrigger>
                  <Dialog.Header>
                    <Dialog.Title>Tambahkan Kategori</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Field.Root>
                      <Field.Label>
                        Kategori :
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        name="name"
                        value={newCategory}
                        onChange={(e) => setNewcategory(e.target.value)}
                      />
                      <HStack>
                        <Dialog.ActionTrigger asChild>
                          <Button onClick={handleAddCantegory}>Save</Button>
                        </Dialog.ActionTrigger>
                        <Dialog.ActionTrigger asChild>
                          <Button variant={"outline"} onClick={resetAddCatgory}>
                            Cancel
                          </Button>
                        </Dialog.ActionTrigger>
                      </HStack>
                    </Field.Root>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
        {categories.length === 0 ? (
          <Flex justify={"center"}>
            <Text fontSize={"2xl"}>Tidak ada berita yang ditemukan.</Text>
          </Flex>
        ) : (
          <>
            <Table.ScrollArea maxW={"full"}>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>#</Table.ColumnHeader>
                    <Table.ColumnHeader>Nama Kategori</Table.ColumnHeader>
                    <Table.ColumnHeader>Dibuat Tanggal</Table.ColumnHeader>
                    <Table.ColumnHeader>Aksi</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {categories.map((data, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{data.name}</Table.Cell>
                      <Table.Cell>
                        {new Date(data.createdAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <Button
                              variant={"ghost"}
                              onClick={() => setUpdateCategory(data.name)}
                            >
                              <FcEditImage size={60} />
                            </Button>
                          </Dialog.Trigger>
                          <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                              <Dialog.Content>
                                <Dialog.CloseTrigger asChild>
                                  <Button variant={"ghost"}>
                                    <RxCross2 size={60} />
                                  </Button>
                                </Dialog.CloseTrigger>
                                <Dialog.Header>
                                  <Dialog.Title>Edit Kategori</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                  <Field.Root>
                                    <Field.Label>
                                      Kategori :
                                      <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                      name="name"
                                      value={updateCategory}
                                      onChange={(e) =>
                                        setUpdateCategory(e.target.value)
                                      }
                                    />
                                    <HStack>
                                      <Dialog.ActionTrigger asChild>
                                        <Button
                                          onClick={() =>
                                            handleUpdateCategory(data.id)
                                          }
                                        >
                                          Save
                                        </Button>
                                      </Dialog.ActionTrigger>
                                      <Dialog.ActionTrigger asChild>
                                        <Button variant={"outline"}>
                                          Cancel
                                        </Button>
                                      </Dialog.ActionTrigger>
                                    </HStack>
                                  </Field.Root>
                                </Dialog.Body>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                        {/* <Button
                          variant={"ghost"}
                          onClick={() => handleDeleteCategory(data.id)}
                          asChild
                        >
                          <FcEmptyTrash size={60} />
                        </Button> */}
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <Button variant={"ghost"}>
                              <FcEmptyTrash size={60} />
                            </Button>
                          </Dialog.Trigger>
                          <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                              <Dialog.Content>
                                <Dialog.CloseTrigger asChild>
                                  <Button variant={"ghost"}>
                                    <RxCross2 size={60} />
                                  </Button>
                                </Dialog.CloseTrigger>
                                <Dialog.Header>
                                  <Dialog.Title>Hapus Kategori</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body gap={5}>
                                  <Text marginBottom={3}>
                                    Apakah Anda akin ingin menghapus Kategori
                                    :&nbsp;
                                    {data.name}
                                  </Text>
                                  <HStack>
                                    <Dialog.ActionTrigger asChild>
                                      <Button
                                        colorPalette={"red"}
                                        onClick={() =>
                                          handleDeleteCategory(data.id)
                                        }
                                      >
                                        Hapus
                                      </Button>
                                    </Dialog.ActionTrigger>
                                    <Dialog.ActionTrigger asChild>
                                      <Button variant={"outline"}>
                                        Cancel
                                      </Button>
                                    </Dialog.ActionTrigger>
                                  </HStack>
                                </Dialog.Body>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <Pagination.Root
              count={total}
              pageSize={10}
              page={page}
              onPageChange={(e) => setPage(e.page)}
            >
              <ButtonGroup variant={"ghost"}>
                <Pagination.PrevTrigger asChild>
                  <TbChevronLeft />
                </Pagination.PrevTrigger>
                <Pagination.Items
                  render={(page) => (
                    <Button
                      variant={{ _selected: "solid" }}
                      onClick={() => setPage(page.value)}
                    >
                      {page.value}
                    </Button>
                  )}
                />
                <Pagination.NextTrigger asChild>
                  <TbChevronRight />
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </>
        )}
        <Toaster />
      </Flex>
    </>
  );
}
