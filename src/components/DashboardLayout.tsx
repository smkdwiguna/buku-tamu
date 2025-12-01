"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function DashboardLayout({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="d-flex">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div
				className="w-100"
				style={{
					marginLeft: "0",
				}}
			>
				<div className="d-none d-lg-block" style={{ marginLeft: "250px" }}>
					<Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
					<main className="p-4 bg-light min-vh-100">{children}</main>
				</div>
				<div className="d-lg-none">
					<Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
					<main className="p-3 bg-light min-vh-100">{children}</main>
				</div>
			</div>
		</div>
	);
}
