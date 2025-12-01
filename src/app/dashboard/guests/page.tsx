import DashboardLayout from "@/components/DashboardLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import GuestTable from "@/components/GuestTable";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getGuests() {
	return prisma.guest.findMany({
		orderBy: { checkIn: "desc" },
		include: {
			department: true,
		},
	});
}

export default async function GuestsPage() {
	const guests = await getGuests();

	return (
		<DashboardLayout title="Guest Data">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h4 className="mb-0">
					<i className="bi bi-people me-2"></i>
					Guest List
				</h4>
				<Link href="/dashboard/guests/new" className="btn btn-primary">
					<i className="bi bi-plus-circle me-2"></i>
					Add New Guest
				</Link>
			</div>

			<div className="card shadow-sm border-0">
				<div className="card-body p-0">
					<GuestTable initialGuests={guests} />
				</div>
			</div>
		</DashboardLayout>
	);
}
