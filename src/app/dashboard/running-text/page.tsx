"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

interface RunningText {
	id: number;
	title: string;
	content: string;
}

export default function RunningTextPage() {
	const [texts, setTexts] = useState<RunningText[]>([]);
	const [form, setForm] = useState({ title: "", content: "" });
	const [editingId, setEditingId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTexts();
	}, []);

	const fetchTexts = async () => {
		try {
			const res = await fetch("/api/running-text");
			const data = await res.json();
			setTexts(data);
		} catch (err) {
			console.error("Failed to fetch running texts:", err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (editingId) {
				await fetch(`/api/running-text/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/running-text", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			}

			setForm({ title: "", content: "" });
			setEditingId(null);
			fetchTexts();
		} catch (err) {
			console.error("Failed to save running text:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (text: RunningText) => {
		setEditingId(text.id);
		setForm({ title: text.title, content: text.content });
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this text?")) return;

		try {
			await fetch(`/api/running-text/${id}`, { method: "DELETE" });
			fetchTexts();
		} catch (err) {
			console.error("Failed to delete running text:", err);
		}
	};

	return (
		<DashboardLayout title="Running Text Management">
			<div className="row">
				<div className="col-12 col-lg-5 mb-3 mb-lg-4">
					<div className="card shadow-sm border-0">
						<div className="card-header bg-primary text-white">
							<h5 className="mb-0">
								<i className="bi bi-plus-circle me-2"></i>
								{editingId ? "Edit" : "Add"} Running Text
							</h5>
						</div>
						<div className="card-body p-3 p-md-4">
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label">Title</label>
									<input
										type="text"
										className="form-control"
										value={form.title}
										onChange={(e) =>
											setForm({ ...form, title: e.target.value })
										}
										required
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Content</label>
									<textarea
										className="form-control"
										rows={4}
										value={form.content}
										onChange={(e) =>
											setForm({ ...form, content: e.target.value })
										}
										required
									></textarea>
								</div>
								<div className="d-flex flex-column flex-sm-row gap-2">
									{editingId && (
										<button
											type="button"
											className="btn btn-secondary"
											onClick={() => {
												setEditingId(null);
												setForm({ title: "", content: "" });
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
								<i className="bi bi-list-ul me-2"></i>
								Running Text List
							</h5>
						</div>
						<div className="card-body p-0">
							{texts.length === 0 ? (
								<div className="text-center text-muted py-5">
									<i className="bi bi-inbox fs-1"></i>
									<p className="mt-2">No running texts yet</p>
								</div>
							) : (
								<div className="list-group list-group-flush">
									{texts.map((text) => (
										<div key={text.id} className="list-group-item">
											<div className="d-flex justify-content-between align-items-start">
												<div className="flex-grow-1">
													<h6 className="mb-1">{text.title}</h6>
													<p className="mb-0 text-muted small">
														{text.content}
													</p>
												</div>
												<div className="btn-group btn-group-sm ms-3">
													<button
														className="btn btn-outline-primary"
														onClick={() => handleEdit(text)}
													>
														<i className="bi bi-pencil"></i>
													</button>
													<button
														className="btn btn-outline-danger"
														onClick={() => handleDelete(text.id)}
													>
														<i className="bi bi-trash"></i>
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
