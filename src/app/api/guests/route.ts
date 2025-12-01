import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const guest = await prisma.guest.create({
      data: {
        name: data.name,
        purpose: data.purpose,
        meetWhom: data.meetWhom,
        departmentId: parseInt(data.department),
        gender: data.gender,
        instance: data.instance,
        phone: data.phone,
        photo: data.photo,
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to create guest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { checkIn: "desc" },
      include: {
        department: true,
      },
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
