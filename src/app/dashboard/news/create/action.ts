"use server";

import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";

export async function createNews(formData: FormData) {
  const title = formData.get("title") as string;
  let content = formData.get("content") as string;

  // Simpan berita kosong dulu untuk dapat ID
  const created = await prisma.news.create({
    data: {
      title,
      slug: slugify(title, { lower: true, strict: true }),
      content: "",
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

  // Simpan konten berita yang sudah diperbarui (dengan path gambar)
  await prisma.news.update({
    where: { id: created.id },
    data: {
      content,
    },
  });

  // Simpan data gambar ke tabel Image (relasi berita)
  await prisma.newsImage.createMany({
    data: images.map((img) => ({
      url: img.url,
      newsId: created.id,
    })),
  });
}
