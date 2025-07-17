import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // pengecekan session apakah sudah login atau belum
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session?.user.id;

    // initialize data form untuk di input
    const formData = await req.formData();
    const title = formData.get("title") as string;
    let content = formData.get("content") as string;
    const categoryId = formData.get("category") as string;
    const status = formData.get("status") as string;
    const thumbnailFile = formData.get("thumbnail") as File;

    console.log(formData);

    // validation jika title atau konten kosong
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan konten wajib diisi." },
        { status: 400 }
      );
    }

    // memasukan data awal ke database untuk mendapatkan UUID
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

    // memulai upload gambar
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

    // Handle thumbnail
    let thumbnailPath: string | null = null;
    if (thumbnailFile && typeof thumbnailFile === "object") {
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = thumbnailFile.name.split(".").pop();
      const filename = `thumb-${Date.now()}.${ext}`;
      const filePath = path.join(targetDir, filename);
      await fs.writeFile(filePath, buffer);
      thumbnailPath = `/uploads/berita-${created.id}/${filename}`;
    }

    // memasukan data image setelah upload gambar
    await prisma.news.update({
      where: { id: created.id },
      data: {
        content,
        thumbnail: thumbnailPath,
      },
    });

    if (images.length > 0) {
      await prisma.newsImage.createMany({
        data: images.map((img) => ({
          url: img.url,
          newsId: created.id,
        })),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error creating news:", err);
    return NextResponse.json(
      { error: "Gagal membuat berita." },
      { status: 500 }
    );
  }
}
