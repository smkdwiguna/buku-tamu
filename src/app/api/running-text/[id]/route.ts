import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await req.json();

    const text = await prisma.runningText.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    return NextResponse.json(text);
  } catch (error) {
    console.error("Failed to update running text:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.runningText.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete running text:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
