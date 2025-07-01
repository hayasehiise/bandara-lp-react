import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { title, slug, content, images } = await req.json();

  await prisma.news.create({
    data: { title, slug, content, images },
  });

  const uploadsDir = path.join(process.cwd(), "public/uploads");
  const allFiles = fs.readdirSync(uploadsDir);
  const usedFiles = images.map((url: string) => path.basename(url));
  const unusedFiles = allFiles.filter((file) => !usedFiles.includes(file));

  for (const file of unusedFiles) {
    const filePath = path.join(uploadsDir, file);
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  }

  return NextResponse.json({ success: true });
}
