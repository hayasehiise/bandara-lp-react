import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();

  const filePath = path.join(process.cwd(), "public", url.replace(/^\/+/, ""));

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("gagal hapus file", err);
    return NextResponse.json(
      { error: "File not found or failed to delete." },
      { status: 500 }
    );
  }
}
