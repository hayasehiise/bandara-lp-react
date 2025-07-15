import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;

  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
      author: true,
    },
  });

  if (!news) {
    return NextResponse.json(
      { error: "Berita Tidak ditemukan" },
      { status: 400 }
    );
  }

  return NextResponse.json(news);
}
