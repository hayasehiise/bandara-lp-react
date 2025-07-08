import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { name } = await req.json();
  const slug = slugify(name, { lower: true });

  try {
    const update = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug },
    });
    return NextResponse.json(
      { flash: "Kategori Berhasil diupdate", data: update },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
