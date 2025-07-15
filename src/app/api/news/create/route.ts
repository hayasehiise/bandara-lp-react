import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session?.user.id;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    let content = formData.get("content") as string;
    const categoryId = formData.get("category") as string;
    const status = formData.get("status") as string;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan konten wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.news.create({
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        content: "", // nanti diupdate setelah gambar dipindahkan
        categoryId,
        authorId: userId,
        status,
      },
    });

    const tempDir = path.join(process.cwd(), "public/uploads/temp");
    const targetDir = path.join(
      process.cwd(),
      `public/uploads/berita-${created.id}`
    );
    await fs.mkdir(targetDir, { recursive: true });

    const files = await fs.readdir(tempDir);
    const images: { url: string }[] = [];

    for (const file of files) {
      const src = path.join(tempDir, file);
      const dest = path.join(targetDir, file);
      await fs.rename(src, dest);

      content = content.replaceAll(
        `/uploads/temp/${file}`,
        `/uploads/berita-${created.id}/${file}`
      );

      images.push({ url: `/uploads/berita-${created.id}/${file}` });
    }

    await prisma.news.update({
      where: { id: created.id },
      data: { content },
    });

    await prisma.newsImage.createMany({
      data: images.map((img) => ({
        url: img.url,
        newsId: created.id,
      })),
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error creating news:", err);
    return NextResponse.json(
      { error: "Gagal membuat berita." },
      { status: 500 }
    );
  }
}
