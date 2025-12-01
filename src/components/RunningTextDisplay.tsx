"use client";

import { useEffect, useState } from "react";

interface RunningText {
	id: number;
	title: string;
	content: string;
}

export default function RunningTextDisplay() {
	const [texts, setTexts] = useState<RunningText[]>([]);

	const fetchTexts = async () => {
		try {
			const res = await fetch("/api/running-text");
			const data = await res.json();
			setTexts(data);
		} catch (err) {
			console.error("Failed to fetch running texts:", err);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchTexts();
		const interval = setInterval(fetchTexts, 30000); // Refresh every 30 seconds
		return () => clearInterval(interval);
	}, []);

	if (texts.length === 0) return null;

	const displayText = texts.map((t) => `${t.title}: ${t.content}`).join(" • ");

	return (
		<div className="running-text-container bg-primary text-white py-2 mt-3 overflow-hidden">
			<div className="container-fluid">
				<div className="d-flex align-items-center">
					<i className="bi bi-megaphone-fill me-2 flex-shrink-0"></i>
					<div
						className="overflow-hidden flex-grow-1 position-relative"
						style={{ height: "24px" }}
					>
						<div className="running-text-wrapper">
							<div className="running-text-scroll">
								<span>{displayText}</span>
								<span>{displayText}</span>
								<span>{displayText}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				.running-text-wrapper {
					width: 100%;
					overflow: hidden;
				}

				.running-text-scroll {
					display: flex;
					white-space: nowrap;
					animation: scroll-left 30s linear infinite;
				}

				.running-text-scroll span {
					padding-right: 4rem;
					display: inline-block;
				}

				@keyframes scroll-left {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-33.333%);
					}
				}
			`}</style>
		</div>
	);
}
