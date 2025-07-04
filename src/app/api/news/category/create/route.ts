import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title } = await req.json();
  const category = await prisma.category.create({ data: { title } });
  return NextResponse.json(category);
}
