"use client";

import {
  Text,
  Flex,
  Button,
  Table,
  Pagination,
  ButtonGroup,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FcEditImage, FcEmptyTrash, FcViewDetails } from "react-icons/fc";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useEffect, useState } from "react";
import Link from "next/link";
import SpinnerLoading from "@/components/spinnerLoading";
// import { useRouter } from "next/navigation";
// import prisma from "@/lib/prisma";

type NewsData = {
  slug: string;
  id: number;
  title: string;
  content: string;
  createdAt: string;
};
export default function DashboardNewsPage() {
  // const router = useRouter();
  const [news, setNews] = useState<NewsData[]>([]);
  const [pages, setPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/news/list?page=${pages}&limit=10`);
      const json = await res.json();
      setNews(json.data);
      setTotal(json.pagination.total);
      // setTotalPage(json.pagination.totalPage);
      setLoading(false);
    }
    fetchData();
  }, [pages]);

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/news/${slug}/delete`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNews((prev) => prev.filter((item) => item.slug !== slug));
      setTotal((prev) => prev - 1);
      toaster.create({
        description: "Berita Berhasil Dihapus",
        type: "success",
      });
    }
  }

  return (
    <Flex p={8} direction={"column"} width={"full"} gap={5}>
      <Flex direction={"row"} justify={"space-between"}>
        <Text fontSize="2xl">Daftar Berita</Text>
        <Button asChild>
          <Link href={"/dashboard/news/create"}>Tambah Berita</Link>
        </Button>
      </Flex>
      {loading ? (
        <SpinnerLoading />
      ) : news.length === 0 ? (
        <Flex justify={"center"}>
          <Text fontSize={"2xl"}>Tidak ada berita yang ditemukan.</Text>
        </Flex>
      ) : (
        <>
          <Table.ScrollArea maxW={"full"}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Title</Table.ColumnHeader>
                  <Table.ColumnHeader>Created At</Table.ColumnHeader>
                  <Table.ColumnHeader>Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {news.map((data, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{data.title}</Table.Cell>
                    <Table.Cell>
                      {new Date(data.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Button variant={"ghost"} asChild>
                        <Link href={`/dashboard/news/${data.slug}/edit`}>
                          <FcEditImage size={60} />
                        </Link>
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={() => handleDelete(data.slug)}
                        asChild
                      >
                        <FcEmptyTrash size={60} />
                      </Button>
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
  );
}
