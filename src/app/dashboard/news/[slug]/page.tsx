"use client";

import {
  Box,
  Heading,
  Text,
  //   Image,
  //   VStack,
  Separator,
  Spinner,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";
import Link from "next/link";

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  images: { url: string }[];
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchNews() {
      const res = await fetch(`/api/news/${slug}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(null);
      }
      setLoading(false);
    }

    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <Box p={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={8}>
        <Text>Berita tidak ditemukan.</Text>
      </Box>
    );
  }

  const StyledContent = styled.div`
    * {
      margin-bottom: 1rem;
    }

    img {
      max-width: 100%;
      height: auto;
      margin-bottom: 1rem;
    }
  `;

  return (
    <Flex direction={"column"} padding={5}>
      <Flex direction={"row"} justify={"space-between"}>
        <Flex direction={"column"}>
          <Heading mb={2}>{data.title}</Heading>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Diterbitkan pada: {new Date(data.createdAt).toLocaleString()}
          </Text>
        </Flex>
        <Link href={"/dashboard/news"}>
          <CloseButton variant={"ghost"} size={"xl"} />
        </Link>
      </Flex>
      <Separator mb={4} />
      {/* Render konten HTML */}
      <StyledContent dangerouslySetInnerHTML={{ __html: data.content }} />
    </Flex>
  );
}
