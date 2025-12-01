"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/dashboard");
			} else {
				setError(data.error || "Invalid credentials");
			}
		} catch (err) {
			setError("An error occurred. Please try again. " + err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient px-3"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			<div
				className="card shadow-lg w-100"
				style={{ maxWidth: "400px", borderRadius: "15px" }}
			>
				<div className="card-body p-4 p-sm-5">
					<div className="text-center mb-4">
						<i className="bi bi-book fs-1 text-primary"></i>
						<h3 className="mt-3">Login</h3>
						<p className="text-muted">Guest Book</p>
					</div>

					{error && (
						<div
							className="alert alert-danger alert-dismissible fade show"
							role="alert"
						>
							{error}
							<button
								type="button"
								className="btn-close"
								onClick={() => setError("")}
							></button>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="username" className="form-label">
								<i className="bi bi-person me-1"></i>
								Username
							</label>
							<input
								type="text"
								className="form-control"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								placeholder="Enter your username"
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="password" className="form-label">
								<i className="bi bi-lock me-1"></i>
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="Enter your password"
							/>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-100 py-2"
							disabled={loading}
						>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2"></span>
									Logging in...
								</>
							) : (
								<>
									<i className="bi bi-box-arrow-in-right me-2"></i>
									Login
								</>
							)}
						</button>
					</form>

					<div className="text-center mt-4">
						<small className="text-muted">Ujian Kompetensi 2022</small>
					</div>
				</div>
			</div>
		</div>
	);
}
