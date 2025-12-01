"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
	title?: string;
	onMenuClick?: () => void;
}

export default function Navbar({
	title = "Dashboard",
	onMenuClick,
}: NavbarProps) {
	const [currentDate, setCurrentDate] = useState("");

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCurrentDate(
			new Date().toLocaleDateString("en-ID", {
				weekday: "short",
				year: "numeric",
				month: "numeric",
				day: "numeric",
			})
		);
	}, []);

	return (
		<nav className="navbar navbar-light bg-white border-bottom shadow-sm">
			<div className="container-fluid">
				<div className="d-flex align-items-center">
					<button
						className="btn btn-link text-dark d-lg-none p-0 me-3"
						onClick={onMenuClick}
					>
						<i className="bi bi-list fs-3"></i>
					</button>
					<h4 className="mb-0">{title}</h4>
				</div>
				<div className="d-flex align-items-center">
					{currentDate && (
						<span className="me-2 me-md-3 text-muted d-none d-sm-inline">
							<i className="bi bi-calendar me-2"></i>
							<span className="d-none d-md-inline">{currentDate}</span>
						</span>
					)}
				</div>
			</div>
		</nav>
	);
}
