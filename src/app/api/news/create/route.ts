import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "Wajib Isi Title dan Konten" },
      { status: 400 }
    );
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.news.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  const news = await prisma.news.create({
    data: { title, content, slug },
  });

  return NextResponse.json(news);
}
