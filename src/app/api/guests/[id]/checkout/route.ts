import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const guest = await prisma.guest.update({
      where: { id: parseInt(id) },
      data: { checkOut: new Date() },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to checkout guest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
