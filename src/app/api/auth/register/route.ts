import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
	try {
		const { username, password, name } = await req.json();

		if (!username || !password || !name) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Check if username already exists
		const existing = await prisma.user.findUnique({
			where: { username },
		});

		if (existing) {
			return NextResponse.json(
				{ error: "Username already exists" },
				{ status: 400 }
			);
		}

		// Hash password before storing
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				username,
				password: hashedPassword,
			},
		});

		return NextResponse.json({
			success: true,
			user: { id: user.id, name: user.name, username: user.username },
		});
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
