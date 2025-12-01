import DashboardLayout from "@/components/DashboardLayout";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getStats() {
	const totalGuests = await prisma.guest.count();
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);

	const guestsToday = await prisma.guest.count({
		where: {
			checkIn: {
				gte: todayStart,
			},
		},
	});

	const activeGuests = await prisma.guest.count({
		where: {
			checkOut: null,
		},
	});

	const departments = await prisma.department.count();

	return { totalGuests, guestsToday, activeGuests, departments };
}

async function getRecentGuests() {
	return prisma.guest.findMany({
		take: 5,
		orderBy: { checkIn: "desc" },
		include: {
			department: true,
		},
	});
}

export default async function DashboardPage() {
	const stats = await getStats();
	const recentGuests = await getRecentGuests();

	return (
		<DashboardLayout title="Dashboard">
			<div className="row g-3 g-md-4">
				{/* Stats Cards */}
				<div className="col-sm-6 col-md-4">
					<div className="card shadow-sm border-0 bg-primary text-white">
						<div className="card-body p-3 p-md-4">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h6 className="text-uppercase opacity-75 mb-1 small">
										Total Guests
									</h6>
									<h2 className="mb-0">{stats.totalGuests}</h2>
								</div>
								<i className="bi bi-people fs-1 opacity-50 d-none d-md-block"></i>
							</div>
						</div>
					</div>
				</div>

				<div className="col-sm-6 col-md-4">
					<div className="card shadow-sm border-0 bg-info text-white">
						<div className="card-body p-3 p-md-4">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h6 className="text-uppercase opacity-75 mb-1 small">
										Today
									</h6>
									<h2 className="mb-0">{stats.guestsToday}</h2>
								</div>
								<i className="bi bi-calendar-check fs-1 opacity-50 d-none d-md-block"></i>
							</div>
						</div>
					</div>
				</div>

				<div className="col-sm-6 col-md-4">
					<div className="card shadow-sm border-0 bg-warning text-dark">
						<div className="card-body p-3 p-md-4">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h6 className="text-uppercase opacity-75 mb-1 small">
										Active Now
									</h6>
									<h2 className="mb-0">{stats.activeGuests}</h2>
								</div>
								<i className="bi bi-person-check fs-1 opacity-50 d-none d-md-block"></i>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Guests Table */}
				<div className="col-12">
					<div className="card shadow-sm border-0">
						<div className="card-header bg-white py-2 py-md-3">
							<h5 className="mb-0">
								<i className="bi bi-clock-history me-2"></i>
								Recent Guests
							</h5>
						</div>
						<div className="card-body p-0">
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead className="bg-light">
										<tr>
											<th>Name</th>
											<th className="d-none d-md-table-cell">Purpose</th>
											<th>Department</th>
											<th className="d-none d-lg-table-cell">Check In</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{recentGuests.map((guest) => (
											<tr key={guest.id}>
												<td>
													<i className="bi bi-person-circle me-2 text-muted"></i>
													{guest.name}
												</td>
												<td className="d-none d-md-table-cell">
													{guest.purpose}
												</td>
												<td>
													<span className="badge bg-secondary">
														{guest.department.name}
													</span>
												</td>
												<td className="d-none d-lg-table-cell">
													<small>
														{new Date(guest.checkIn).toLocaleString("id-ID")}
													</small>
												</td>
												<td>
													{guest.checkOut ? (
														<span className="badge bg-danger">
															<i className="bi bi-x-circle d-md-none"></i>
															<span className="d-none d-md-inline">
																Checked Out
															</span>
														</span>
													) : (
														<span className="badge bg-success">
															<i className="bi bi-check-circle d-md-none"></i>
															<span className="d-none d-md-inline">Active</span>
														</span>
													)}
												</td>
											</tr>
										))}
										{recentGuests.length === 0 && (
											<tr>
												<td colSpan={5} className="text-center text-muted py-4">
													No guests yet
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
