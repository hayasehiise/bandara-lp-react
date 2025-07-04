import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import { extractImageUrls } from "@/lib/extractImageUrls";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    let content = formData.get("content") as string;

    const existingNews = await prisma.news.findUnique({
      where: { slug: params.slug },
      include: { images: true }, // if relation named `images`
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    const newsId = existingNews.id;
    const oldDir = path.join(process.cwd(), `public/uploads/berita-${newsId}`);
    await fs.mkdir(oldDir, { recursive: true });

    const usedUrls = extractImageUrls(content);
    const usedNewFiles = usedUrls
      .filter((url) => url.includes("/uploads/berita-"))
      .map((url) => url.split("/").pop());

    // Hapus file lama yang tidak digunakan
    const allFiles = await fs.readdir(oldDir);
    const unused = allFiles.filter((file) => !usedNewFiles.includes(file));
    for (const file of unused) {
      await fs.unlink(path.join(oldDir, file));
    }

    // Pindahkan dari temp → berita-{id}
    const tempFiles = usedUrls.filter((url) => url.includes("/uploads/temp/"));
    for (const url of tempFiles) {
      const filename = url.split("/").pop()!;
      const src = path.join(process.cwd(), "public/uploads/temp", filename);
      const dest = path.join(oldDir, filename);

      await fs.rename(src, dest);
      content = content.replaceAll(
        `/uploads/temp/${filename}`,
        `/uploads/berita-${newsId}/${filename}`
      );
    }

    // Update berita
    const updated = await prisma.news.update({
      where: { id: newsId },
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        content,
      },
    });

    // Refresh relasi gambar
    await prisma.newsImage.deleteMany({ where: { newsId } });
    await prisma.newsImage.createMany({
      data: extractImageUrls(content).map((url) => ({
        url,
        newsId,
      })),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
