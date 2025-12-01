import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    const department = await prisma.department.create({
      data: { name },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Failed to create department:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
