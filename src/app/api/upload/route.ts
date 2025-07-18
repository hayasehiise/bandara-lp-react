import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${randomUUID()}-${file.name}`;
  const tempDir = path.join(process.cwd(), "public/uploads/temp");
  await mkdir(tempDir, { recursive: true });

  const filepath = path.join(tempDir, filename);
  await writeFile(filepath, buffer);

  return NextResponse.json({ location: `/uploads/temp/${filename}` });
}
