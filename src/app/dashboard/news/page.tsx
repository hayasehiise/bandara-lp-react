"use client";

import {
  Text,
  Flex,
  Button,
  Table,
  Pagination,
  ButtonGroup,
  Dialog,
  HStack,
  Portal,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FcEditImage, FcEmptyTrash, FcViewDetails } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useEffect, useState } from "react";
import Link from "next/link";
import SpinnerLoading from "@/components/spinnerLoading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import SidebarDashboard from "@/components/dashboard/sidebar";

type NewsData = {
  category: {
    name: string;
  };
  author: {
    name: string;
  };
  slug: string;
  id: number;
  title: string;
  content: string;
  createdAt: string;
  status: string;
};
type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

type NewsListData = {
  data: NewsData[];
  pagination: PaginationData;
};

export default function DashboardNewsPage() {
  const [pages, setPages] = useState<number>(1);
  const { data, error, isLoading, mutate } = useSWR<NewsListData>(
    `/api/news/list?page=${pages}&limit=10`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const news = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  useEffect(() => {
    const flash = sessionStorage.getItem("flash");
    if (flash) {
      queueMicrotask(() => {
        toaster.create({
          description: flash,
          type: "success",
        });
        sessionStorage.removeItem("flash");
      });
    }
  }, []);

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/news/${slug}/delete`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate((current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.filter((n) => n.slug !== slug),
          pagination: {
            ...current.pagination,
            total: current.pagination.total - 1,
          },
        };
      }, false);
      toaster.create({
        description: "Berita Berhasil Dihapus",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Berita tidak berhasil dihapus",
        type: "error",
      });
    }
  }

  if (isLoading) return <SpinnerLoading />;

  if (error)
    return (
      <Flex p={8} justify="center">
        <Text>Terjadi kesalahan: {String(error)}</Text>
      </Flex>
    );

  return (
    <Flex direction={"row"}>
      <SidebarDashboard />
      <Flex p={8} direction={"column"} width={"full"} gap={5}>
        <Flex direction={"row"} justify={"space-between"}>
          <Text fontSize="2xl">Daftar Berita</Text>
          <Button asChild>
            <Link href={"/dashboard/news/create"}>Tambah Berita</Link>
          </Button>
        </Flex>
        {news.length === 0 ? (
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
                    <Table.ColumnHeader>Title</Table.ColumnHeader>
                    <Table.ColumnHeader>Category</Table.ColumnHeader>
                    <Table.ColumnHeader>Author</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Created At</Table.ColumnHeader>
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {news.map((data, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{data.title}</Table.Cell>
                      <Table.Cell>{data.category.name}</Table.Cell>
                      <Table.Cell>{data.author.name}</Table.Cell>
                      <Table.Cell>{data.status}</Table.Cell>
                      <Table.Cell>
                        {new Date(data.createdAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Button variant={"ghost"} asChild>
                          <Link href={`/dashboard/news/${data.slug}/edit`}>
                            <FcEditImage size={60} />
                          </Link>
                        </Button>
                        {/* <Button
                        variant={"ghost"}
                        onClick={() => handleDelete(data.slug)}
                        asChild
                      >
                        <FcEmptyTrash size={60} />
                      </Button> */}
                        {/* Tombol Hapus News */}
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
                                  <Dialog.Title>Hapus Berita</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body gap={5}>
                                  <Text marginBottom={3}>
                                    Apakah Anda akin ingin menghapus berita?
                                  </Text>
                                  <HStack>
                                    <Dialog.ActionTrigger asChild>
                                      <Button
                                        colorPalette={"red"}
                                        onClick={() => handleDelete(data.slug)}
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
                        {/* =============================================================== */}
                        <Button variant={"ghost"} asChild>
                          <Link href={`/dashboard/news/${data.slug}`}>
                            <FcViewDetails size={60} />
                          </Link>
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <Pagination.Root
              count={total}
              pageSize={10}
              page={pages}
              onPageChange={(e) => setPages(e.page)}
            >
              <ButtonGroup variant={"ghost"}>
                <Pagination.PrevTrigger asChild>
                  <TbChevronLeft />
                </Pagination.PrevTrigger>
                <Pagination.Items
                  render={(pages) => (
                    <Button
                      variant={{ _selected: "solid" }}
                      onClick={() => setPages(pages.value)}
                    >
                      {pages.value}
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
    </Flex>
  );
}
