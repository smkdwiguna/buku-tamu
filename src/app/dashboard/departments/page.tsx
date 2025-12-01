"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

interface Department {
	id: number;
	name: string;
}

export default function DepartmentsPage() {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [form, setForm] = useState({ name: "" });
	const [editingId, setEditingId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

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

		try {
			if (editingId) {
				await fetch(`/api/departments/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/departments", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			}

			setForm({ name: "" });
			setEditingId(null);
			fetchDepartments();
		} catch (err) {
			console.error("Failed to save department:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (dept: Department) => {
		setEditingId(dept.id);
		setForm({ name: dept.name });
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this department?")) return;

		try {
			await fetch(`/api/departments/${id}`, { method: "DELETE" });
			fetchDepartments();
		} catch (err) {
			console.error("Failed to delete department:", err);
		}
	};

	return (
		<DashboardLayout title="Department Management">
			<div className="row">
				<div className="col-12 col-lg-5 mb-3 mb-lg-4">
					<div className="card shadow-sm border-0">
						<div className="card-header bg-primary text-white">
							<h5 className="mb-0">
								<i className="bi bi-plus-circle me-2"></i>
								{editingId ? "Edit" : "Add"} Department
							</h5>
						</div>
						<div className="card-body p-3 p-md-4">
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label">Department Name</label>
									<input
										type="text"
										className="form-control"
										value={form.name}
										onChange={(e) => setForm({ name: e.target.value })}
										required
										placeholder="e.g., Administration, Curriculum"
									/>
								</div>
								<div className="d-flex flex-column flex-sm-row gap-2">
									{editingId && (
										<button
											type="button"
											className="btn btn-secondary"
											onClick={() => {
												setEditingId(null);
												setForm({ name: "" });
											}}
										>
											Cancel
										</button>
									)}
									<button
										type="submit"
										className="btn btn-primary"
										disabled={loading}
									>
										{loading ? "Saving..." : editingId ? "Update" : "Add"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-12 col-lg-7">
					<div className="card shadow-sm border-0">
						<div className="card-header bg-white">
							<h5 className="mb-0">
								<i className="bi bi-building me-2"></i>
								Departments List
							</h5>
						</div>
						<div className="card-body p-0">
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead className="bg-light">
										<tr>
											<th>#</th>
											<th>Department Name</th>
											<th style={{ width: "120px" }}>Actions</th>
										</tr>
									</thead>
									<tbody>
										{departments.map((dept, index) => (
											<tr key={dept.id}>
												<td>{index + 1}</td>
												<td>
													<i className="bi bi-building me-2 text-muted"></i>
													{dept.name}
												</td>
												<td>
													<div className="btn-group btn-group-sm">
														<button
															className="btn btn-outline-primary"
															onClick={() => handleEdit(dept)}
															title="Edit"
														>
															<i className="bi bi-pencil"></i>
														</button>
														<button
															className="btn btn-outline-danger"
															onClick={() => handleDelete(dept.id)}
															title="Delete"
														>
															<i className="bi bi-trash"></i>
														</button>
													</div>
												</td>
											</tr>
										))}
										{departments.length === 0 && (
											<tr>
												<td colSpan={3} className="text-center text-muted py-4">
													No departments yet
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
