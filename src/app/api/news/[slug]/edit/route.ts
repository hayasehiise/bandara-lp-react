import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import { extractImageUrls } from "@/lib/extractImageUrls";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userId = session?.user.id;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    let content = formData.get("content") as string;
    const categoryId = formData.get("category") as string;
    const status = formData.get("status") as string;
    const thumbnailFile = formData.get("thumbnail") as File;

    const existingNews = await prisma.news.findUnique({
      where: { slug: slug },
      include: { images: true, category: true }, // if relation named `images`
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
      if (!file.startsWith("thumb-")) {
        await fs.unlink(path.join(oldDir, file));
      }
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

    // Update thumbnail
    let thumbnailPath = existingNews.thumbnail;
    if (thumbnailFile && typeof thumbnailFile === "object") {
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = thumbnailFile.name.split(".").pop();
      const filename = `thumb-${Date.now()}.${ext}`;
      const filePath = path.join(oldDir, filename);
      await fs.writeFile(filePath, buffer);
      thumbnailPath = `/uploads/berita-${newsId}/${filename}`;

      // Hapus thumbnail lama jika ada dan berbeda
      if (existingNews.thumbnail && existingNews.thumbnail !== thumbnailPath) {
        const oldThumb = path.join(
          process.cwd(),
          "public",
          existingNews.thumbnail
        );
        await fs.unlink(oldThumb).catch(() => {});
      }
    }

    // Update berita
    const updated = await prisma.news.update({
      where: { id: newsId },
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        content,
        categoryId,
        status,
        thumbnail: thumbnailPath,
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
