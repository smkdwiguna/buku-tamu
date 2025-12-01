/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Guest = {
	id: number;
	name: string;
	purpose: string;
	meetWhom: string;
	gender: string;
	instance: string;
	phone: string;
	photo: string | null;
	checkIn: Date;
	checkOut: Date | null;
	department: {
		id: number;
		name: string;
	};
};

export default function GuestTable({
	initialGuests,
}: {
	initialGuests: Guest[];
}) {
	const [guests, setGuests] = useState(initialGuests);
	const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
	const [showCheckoutModal, setShowCheckoutModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const router = useRouter();

	// Initialize Bootstrap modal
	useEffect(() => {
		if (typeof window !== "undefined") {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			require("bootstrap/dist/js/bootstrap.bundle.min.js");
		}
	}, []);

	const openCheckoutModal = (guest: Guest) => {
		setSelectedGuest(guest);
		setShowCheckoutModal(true);
	};

	const openDetailModal = (guest: Guest) => {
		setSelectedGuest(guest);
		setShowDetailModal(true);
	};

	const closeModal = () => {
		setShowCheckoutModal(false);
		setShowDetailModal(false);
		setSelectedGuest(null);
	};

	const handleCheckout = async () => {
		if (!selectedGuest) return;

		setIsCheckingOut(true);

		try {
			const res = await fetch(`/api/guests/${selectedGuest.id}/checkout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (res.ok) {
				// Update local state immediately
				setGuests(
					guests.map((g) =>
						g.id === selectedGuest.id ? { ...g, checkOut: new Date() } : g
					)
				);

				// Close modal
				closeModal();

				// Trigger server refresh
				router.refresh();
			} else {
				const error = await res.json();
				alert("Failed to check out guest: " + (error.error || "Unknown error"));
			}
		} catch (err) {
			console.error("Failed to checkout guest:", err);
			alert("An error occurred while checking out");
		} finally {
			setIsCheckingOut(false);
		}
	};

	return (
		<>
			<div className="table-responsive">
				<table className="table table-hover mb-0">
					<thead className="bg-light">
						<tr>
							<th className="d-none d-md-table-cell" style={{ width: "80px" }}>
								Photo
							</th>
							<th>Name</th>
							<th className="d-none d-lg-table-cell">Purpose</th>
							<th className="d-none d-xl-table-cell">Meet Whom</th>
							<th>Department</th>
							<th className="d-none d-sm-table-cell">Gender</th>
							<th className="d-none d-xl-table-cell">Instance</th>
							<th className="d-none d-xl-table-cell">Phone</th>
							<th className="d-none d-lg-table-cell">Check In</th>
							<th className="d-none d-md-table-cell">Check Out</th>
							<th>Status</th>
							<th style={{ width: "140px" }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{guests.map((guest) => (
							<tr key={guest.id}>
								<td className="d-none d-md-table-cell">
									{guest.photo ? (
										<img
											src={guest.photo}
											alt={guest.name}
											className="rounded-circle"
											style={{
												width: "50px",
												height: "50px",
												objectFit: "cover",
											}}
										/>
									) : (
										<div
											className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
											style={{ width: "50px", height: "50px" }}
										>
											<i className="bi bi-person text-white"></i>
										</div>
									)}
								</td>
								<td>
									<div className="fw-bold">{guest.name}</div>
									<small className="text-muted d-lg-none">
										{guest.purpose}
									</small>
								</td>
								<td className="d-none d-lg-table-cell">{guest.purpose}</td>
								<td className="d-none d-xl-table-cell">{guest.meetWhom}</td>
								<td>
									<span className="badge bg-info">{guest.department.name}</span>
								</td>
								<td className="d-none d-sm-table-cell">
									<i
										className={`bi bi-gender-${
											guest.gender === "male" ? "male" : "female"
										} fs-5 text-${
											guest.gender === "male" ? "primary" : "danger"
										}`}
										title={guest.gender}
									></i>
								</td>
								<td className="d-none d-xl-table-cell">{guest.instance}</td>
								<td className="d-none d-xl-table-cell">{guest.phone}</td>
								<td className="d-none d-lg-table-cell">
									<small>
										{new Date(guest.checkIn).toLocaleString("id-ID")}
									</small>
								</td>
								<td className="d-none d-md-table-cell">
									{guest.checkOut ? (
										<small>
											{new Date(guest.checkOut).toLocaleString("id-ID")}
										</small>
									) : (
										<span className="text-muted">-</span>
									)}
								</td>
								<td>
									{guest.checkOut ? (
										<span className="badge bg-danger">
											<i className="bi bi-x-circle d-md-none"></i>
											<span className="d-none d-md-inline">Checked Out</span>
										</span>
									) : (
										<span className="badge bg-success">
											<i className="bi bi-check-circle d-md-none"></i>
											<span className="d-none d-md-inline">Active</span>
										</span>
									)}
								</td>
								<td>
									<div className="btn-group btn-group-sm">
										<button
											className="btn btn-outline-info"
											onClick={() => openDetailModal(guest)}
											title="View details"
										>
											<i className="bi bi-eye"></i>
											<span className="d-none d-lg-inline ms-1">Detail</span>
										</button>
										{!guest.checkOut && (
											<button
												className="btn btn-outline-danger"
												onClick={() => openCheckoutModal(guest)}
												title="Check out this guest"
											>
												<i className="bi bi-box-arrow-right"></i>
												<span className="d-none d-lg-inline ms-1">
													Checkout
												</span>
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
						{guests.length === 0 && (
							<tr>
								<td colSpan={12} className="text-center text-muted py-4">
									No guests registered yet
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Guest Detail Modal */}
			{showDetailModal && selectedGuest && (
				<div
					className="modal fade show d-block"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
					onClick={closeModal}
				>
					<div
						className="modal-dialog modal-dialog-centered modal-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="modal-content">
							<div className="modal-header bg-info text-white">
								<h5 className="modal-title">
									<i className="bi bi-person-badge me-2"></i>
									Guest Details
								</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={closeModal}
								></button>
							</div>
							<div className="modal-body">
								<div className="row">
									<div className="col-md-4 text-center mb-3 mb-md-0">
										{selectedGuest.photo ? (
											<img
												src={selectedGuest.photo}
												alt={selectedGuest.name}
												className="img-fluid rounded-circle mb-3"
												style={{
													width: "150px",
													height: "150px",
													objectFit: "cover",
												}}
											/>
										) : (
											<div
												className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3"
												style={{ width: "150px", height: "150px" }}
											>
												<i className="bi bi-person fs-1 text-white"></i>
											</div>
										)}
										<div className="mb-2">
											{selectedGuest.checkOut ? (
												<span className="badge bg-danger fs-6">
													<i className="bi bi-x-circle me-1"></i>
													Checked Out
												</span>
											) : (
												<span className="badge bg-success fs-6">
													<i className="bi bi-check-circle me-1"></i>
													Active
												</span>
											)}
										</div>
									</div>
									<div className="col-md-8">
										<h4 className="mb-3">{selectedGuest.name}</h4>
										<div className="row g-3">
											<div className="col-12">
												<div className="d-flex align-items-start">
													<i className="bi bi-gender-ambiguous me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">Gender</small>
														<div>
															<i
																className={`bi bi-gender-${
																	selectedGuest.gender === "male"
																		? "male"
																		: "female"
																} me-1 text-${
																	selectedGuest.gender === "male"
																		? "primary"
																		: "danger"
																}`}
															></i>
															<span className="text-capitalize">
																{selectedGuest.gender}
															</span>
														</div>
													</div>
												</div>
											</div>
											<div className="col-12">
												<div className="d-flex align-items-start">
													<i className="bi bi-briefcase me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">
															Purpose of Visit
														</small>
														<strong>{selectedGuest.purpose}</strong>
													</div>
												</div>
											</div>
											<div className="col-12">
												<div className="d-flex align-items-start">
													<i className="bi bi-person-badge me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">
															Meet Whom
														</small>
														<strong>{selectedGuest.meetWhom}</strong>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="d-flex align-items-start">
													<i className="bi bi-building me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">
															Department
														</small>
														<span className="badge bg-info">
															{selectedGuest.department.name}
														</span>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="d-flex align-items-start">
													<i className="bi bi-bank me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">
															Instance
														</small>
														<strong>{selectedGuest.instance}</strong>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="d-flex align-items-start">
													<i className="bi bi-phone me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">Phone</small>
														<strong>{selectedGuest.phone}</strong>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="d-flex align-items-start">
													<i className="bi bi-clock me-2 mt-1 text-muted"></i>
													<div>
														<small className="text-muted d-block">
															Check In
														</small>
														<strong>
															{new Date(selectedGuest.checkIn).toLocaleString(
																"id-ID"
															)}
														</strong>
													</div>
												</div>
											</div>
											{selectedGuest.checkOut && (
												<div className="col-sm-6">
													<div className="d-flex align-items-start">
														<i className="bi bi-clock-history me-2 mt-1 text-muted"></i>
														<div>
															<small className="text-muted d-block">
																Check Out
															</small>
															<strong>
																{new Date(
																	selectedGuest.checkOut
																).toLocaleString("id-ID")}
															</strong>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								{!selectedGuest.checkOut && (
									<button
										type="button"
										className="btn btn-danger"
										onClick={() => {
											closeModal();
											openCheckoutModal(selectedGuest);
										}}
									>
										<i className="bi bi-box-arrow-right me-1"></i>
										Check Out Guest
									</button>
								)}
								<button
									type="button"
									className="btn btn-secondary"
									onClick={closeModal}
								>
									<i className="bi bi-x-circle me-1"></i>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Checkout Confirmation Modal */}
			{showCheckoutModal && selectedGuest && (
				<div
					className="modal fade show d-block"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header bg-danger text-white">
								<h5 className="modal-title">
									<i className="bi bi-box-arrow-right me-2"></i>
									Confirm Checkout
								</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={closeModal}
									disabled={isCheckingOut}
								></button>
							</div>
							<div className="modal-body">
								<div className="text-center mb-3">
									{selectedGuest.photo ? (
										<img
											src={selectedGuest.photo}
											alt={selectedGuest.name}
											className="rounded-circle mb-2"
											style={{
												width: "80px",
												height: "80px",
												objectFit: "cover",
											}}
										/>
									) : (
										<div
											className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-2"
											style={{ width: "80px", height: "80px" }}
										>
											<i className="bi bi-person fs-1 text-white"></i>
										</div>
									)}
								</div>
								<p className="mb-2">
									Are you sure you want to check out{" "}
									<strong>{selectedGuest.name}</strong>?
								</p>
								<div className="small text-muted">
									<div>
										<i className="bi bi-briefcase me-1"></i> Purpose:{" "}
										{selectedGuest.purpose}
									</div>
									<div>
										<i className="bi bi-building me-1"></i> Department:{" "}
										{selectedGuest.department.name}
									</div>
									<div>
										<i className="bi bi-clock me-1"></i> Check-in:{" "}
										{new Date(selectedGuest.checkIn).toLocaleString("id-ID")}
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={closeModal}
									disabled={isCheckingOut}
								>
									<i className="bi bi-x-circle me-1"></i>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-danger"
									onClick={handleCheckout}
									disabled={isCheckingOut}
								>
									{isCheckingOut ? (
										<>
											<span className="spinner-border spinner-border-sm me-2"></span>
											Checking out...
										</>
									) : (
										<>
											<i className="bi bi-check-circle me-1"></i>
											Yes, Check Out
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
