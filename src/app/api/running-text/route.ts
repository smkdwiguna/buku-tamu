import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const texts = await prisma.runningText.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(texts);
  } catch (error) {
    console.error("Failed to fetch running texts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    const text = await prisma.runningText.create({
      data: {
        title,
        content,
        adminId: parseInt(userId),
      },
    });

    return NextResponse.json(text);
  } catch (error) {
    console.error("Failed to create running text:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
