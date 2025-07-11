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
// import prisma from "@/lib/prisma";

type NewsData = {
  slug: string;
  id: number;
  title: string;
  content: string;
  createdAt: string;
};
type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

export default function DashboardNewsPage() {
  const [news, setNews] = useState<NewsData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    total: 1,
    limit: 1,
    totalPage: 1,
  });
  // const [pages, setPages] = useState<number>(1);
  // const [total, setTotal] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

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
      const res = await fetch(
        `/api/news/list?page=${pagination.page}&limit=10`
      );
      const json = await res.json();
      setNews(json.data);
      setPagination((prev) => ({
        ...prev,
        total: json.pagination.total,
        totalPage: json.pagination.totalPage,
      }));
      // setTotal(json.pagination.total);
      // setTotalPage(json.pagination.totalPage);
      setLoading(false);
    }
    fetchData();
  }, [pagination.page]);

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/news/${slug}/delete`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNews((prev) => prev.filter((item) => item.slug !== slug));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      // setTotal((prev) => prev - 1);
      toaster.create({
        description: "Berita Berhasil Dihapus",
        type: "success",
      });
    }
  }

  if (loading) return <SpinnerLoading />;

  return (
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
            count={pagination.total}
            pageSize={10}
            page={pagination.page}
            // onPageChange={(e) => setPages(e.page)}
            onPageChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                page: e.page,
              }))
            }
          >
            <ButtonGroup variant={"ghost"}>
              <Pagination.PrevTrigger asChild>
                <TbChevronLeft />
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(pages) => (
                  <Button
                    variant={{ _selected: "solid" }}
                    // onClick={() => setPages(pages.value)}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: pages.value,
                      }))
                    }
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
