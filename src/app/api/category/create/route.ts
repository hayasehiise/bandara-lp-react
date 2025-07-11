import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const slug = slugify(name, { lower: true });

  try {
    const category = await prisma.category.create({
      data: { name, slug },
    });
    return NextResponse.json(
      { flash: "kategori Berhasil Ditambahkan", data: category },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
