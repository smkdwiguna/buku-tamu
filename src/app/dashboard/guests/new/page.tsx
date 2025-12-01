"use client";

import DashboardLayout from "@/components/DashboardLayout";
import WebcamCapture from "@/components/WebcamCapture";
import RunningTextDisplay from "@/components/RunningTextDisplay";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Department {
	id: number;
	name: string;
}

export default function NewGuestPage() {
	const [formData, setFormData] = useState({
		name: "",
		purpose: "",
		meetWhom: "",
		department: "",
		gender: "male",
		instance: "",
		phone: "",
		photo: "",
	});
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		fetchDepartments();
	}, []);

	const fetchDepartments = async () => {
		try {
			const res = await fetch("/api/departments");
			const data = await res.json();
			setDepartments(data);
		} catch (err) {
			console.error("Failed to fetch departments:", err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/guests", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				router.push("/dashboard/guests");
			} else {
				const data = await res.json();
				setError(data.error || "Failed to create guest");
			}
		} catch (err) {
			setError("An error occurred. Please try again. " + err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout title="Add New Guest">
			<div className="row">
				<div className="col-12 col-lg-10 col-xl-8 mx-auto">
					<div className="card shadow-sm border-0">
						<div className="card-header bg-primary text-white">
							<h5 className="mb-0">
								<i className="bi bi-person-plus me-2"></i>
								Guest Registration Form
							</h5>
						</div>
						<div className="card-body p-3 p-md-4">
							{error && (
								<div className="alert alert-danger alert-dismissible fade show">
									{error}
									<button
										type="button"
										className="btn-close"
										onClick={() => setError("")}
									></button>
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="row">
									<div className="col-md-8 order-2 order-md-1">
										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-person me-1"></i>
												Full Name *
											</label>
											<input
												type="text"
												className="form-control"
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												required
											/>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-briefcase me-1"></i>
												Purpose of Visit *
											</label>
											<input
												type="text"
												className="form-control"
												value={formData.purpose}
												onChange={(e) =>
													setFormData({ ...formData, purpose: e.target.value })
												}
												required
											/>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-person-badge me-1"></i>
												Meet Whom *
											</label>
											<input
												type="text"
												className="form-control"
												value={formData.meetWhom}
												onChange={(e) =>
													setFormData({ ...formData, meetWhom: e.target.value })
												}
												required
											/>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-building me-1"></i>
												Department/Unit *
											</label>
											<select
												className="form-select"
												value={formData.department}
												onChange={(e) =>
													setFormData({
														...formData,
														department: e.target.value,
													})
												}
												required
											>
												<option value="">Select Department</option>
												{departments.map((dept) => (
													<option key={dept.id} value={dept.id}>
														{dept.name}
													</option>
												))}
											</select>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-gender-ambiguous me-1"></i>
												Gender *
											</label>
											<div>
												<div className="form-check form-check-inline">
													<input
														className="form-check-input"
														type="radio"
														name="gender"
														id="male"
														value="male"
														checked={formData.gender === "male"}
														onChange={(e) =>
															setFormData({
																...formData,
																gender: e.target.value,
															})
														}
													/>
													<label className="form-check-label" htmlFor="male">
														Male
													</label>
												</div>
												<div className="form-check form-check-inline">
													<input
														className="form-check-input"
														type="radio"
														name="gender"
														id="female"
														value="female"
														checked={formData.gender === "female"}
														onChange={(e) =>
															setFormData({
																...formData,
																gender: e.target.value,
															})
														}
													/>
													<label className="form-check-label" htmlFor="female">
														Female
													</label>
												</div>
											</div>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-bank me-1"></i>
												Instance/Company *
											</label>
											<input
												type="text"
												className="form-control"
												value={formData.instance}
												onChange={(e) =>
													setFormData({ ...formData, instance: e.target.value })
												}
												required
											/>
										</div>

										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-phone me-1"></i>
												Phone Number *
											</label>
											<input
												type="tel"
												className="form-control"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
												required
											/>
										</div>
									</div>

									<div className="col-md-4 order-1 order-md-2 mb-3 mb-md-0">
										<div className="mb-3">
											<label className="form-label">
												<i className="bi bi-camera me-1"></i>
												Photo *
											</label>
											<WebcamCapture
												onCapture={(imgSrc) =>
													setFormData({ ...formData, photo: imgSrc })
												}
											/>
										</div>
									</div>
								</div>

								<hr className="my-3 my-md-4" />

								<div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => router.back()}
									>
										<i className="bi bi-x-circle me-2"></i>
										Cancel
									</button>
									<button
										type="submit"
										className="btn btn-primary"
										disabled={loading || !formData.photo}
									>
										{loading ? (
											<>
												<span className="spinner-border spinner-border-sm me-2"></span>
												Saving...
											</>
										) : (
											<>
												<i className="bi bi-check-circle me-2"></i>
												Submit
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			<RunningTextDisplay />
		</DashboardLayout>
	);
}
