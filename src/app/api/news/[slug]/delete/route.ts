import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function DELETE(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const berita = await prisma.news.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!berita) {
    return NextResponse.json(
      { error: "Berita tidak ditemukan" },
      { status: 404 }
    );
  }

  const folderPath = path.join(
    process.cwd(),
    `public/uploads/berita-${berita.id}`
  );

  // Hapus folder gambar
  await fs.rm(folderPath, { recursive: true, force: true }).catch(() => {});

  // Hapus berita dari database
  await prisma.news.delete({ where: { id: berita.id } });

  return NextResponse.json(
    { success: true, message: "Berita Berhasil dihapus" },
    { status: 200 }
  );
}
