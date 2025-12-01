import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	try {
		// Create Admin User
		const hashedPassword = await bcrypt.hash("password123", 10);
		const admin = await prisma.user.upsert({
			where: { username: "admin" },
			update: {},
			create: {
				name: "Administrator",
				username: "admin",
				password: hashedPassword,
			},
		});

		console.log("Admin created:", admin);

		// Create Departments
		const departments = [
			"Student Affairs",
			"Curriculum",
			"Administration",
			"Public Relations",
			"Facilities",
		];

		for (const dept of departments) {
			const created = await prisma.department.upsert({
				where: { id: departments.indexOf(dept) + 1 },
				update: {},
				create: {
					name: dept,
				},
			});
			console.log("Department created:", created);
		}

		console.log("✅ Database seeded successfully");
	} catch (error) {
		console.error("Seed error:", error);
		throw error;
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
