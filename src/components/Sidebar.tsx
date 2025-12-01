"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
	const pathname = usePathname();

	const menuItems = [
		{ href: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
		{ href: "/dashboard/guests", icon: "bi-people", label: "Guests" },
		{
			href: "/dashboard/departments",
			icon: "bi-building",
			label: "Departments",
		},
		{
			href: "/dashboard/running-text",
			icon: "bi-text-paragraph",
			label: "Running Text",
		},
	];

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
					style={{ zIndex: 1040 }}
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`bg-dark text-white vh-100 p-3 position-fixed d-flex flex-column ${
					isOpen ? "" : "d-none d-lg-flex"
				}`}
				style={{
					width: "250px",
					top: 0,
					left: 0,
					zIndex: 1050,
					transition: "transform 0.3s ease",
				}}
			>
				<div className="mb-4">
					<div className="d-flex justify-content-between align-items-center">
						<h5 className="mb-0">
							<i className="bi bi-book me-2"></i>
							Guest Book
						</h5>
						<button
							className="btn btn-link text-white d-lg-none p-0"
							onClick={onClose}
						>
							<i className="bi bi-x-lg"></i>
						</button>
					</div>
				</div>
				<hr className="bg-secondary" />
				<nav className="flex-grow-1">
					<ul className="nav flex-column">
						{menuItems.map((item) => (
							<li key={item.href} className="nav-item mb-2">
								<Link
									href={item.href}
									className={`nav-link text-${
										pathname === item.href ? "white bg-primary" : "secondary"
									} rounded`}
									onClick={onClose}
								>
									<i className={`bi ${item.icon} me-2`}></i>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<hr className="bg-secondary" />
				<form action="/api/auth/logout" method="POST">
					<button type="submit" className="btn btn-outline-danger w-100">
						<i className="bi bi-box-arrow-right me-2"></i>
						Logout
					</button>
				</form>
			</div>
		</>
	);
}
