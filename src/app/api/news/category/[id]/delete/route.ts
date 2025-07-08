import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { flash: "Kategori berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
