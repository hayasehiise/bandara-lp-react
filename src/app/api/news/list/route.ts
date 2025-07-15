import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const userId = session?.user.id;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const total = await prisma.news.count();
  const news = await prisma.news.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      images: true,
    },
  });

  try {
    return NextResponse.json(
      {
        data: news,
        pagination: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
