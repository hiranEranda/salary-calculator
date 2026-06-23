// app/page.tsx

"use client";

import React, { JSX, useState, useEffect } from "react";
import SalaryCalculator from "@/components/SalaryCalculator";
import LoanEligibilityCalculator from "@/components/LoanCalculator";
import LoanPaymentCalculator from "@/components/LoanPaymentCalculator";
import SalaryEstimator from "@/components/SalaryEstimator";
import EpfEtfCalculator from "@/components/EpfEtfCalculator";

type Tool = "salary" | "eligibility" | "payment" | "estimator" | "epf";
type Theme = "light" | "dark";

/* ── Tab icons ── */
const SalaryIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
		<line x1="1.5" y1="6.5" x2="14.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" />
		<rect x="3" y="9" width="3" height="1.5" rx="0.75" fill="currentColor" />
		<rect x="10" y="9" width="2" height="1.5" rx="0.75" fill="currentColor" />
	</svg>
);

const BankIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 1.5L14.5 5H1.5L8 1.5Z" fill="currentColor" />
		<rect x="1.5" y="13" width="13" height="1.5" rx="0.75" fill="currentColor" />
		<rect x="1.5" y="5.5" width="13" height="1.2" rx="0.6" fill="currentColor" />
		<rect x="3" y="7.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
		<rect x="7.25" y="7.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
		<rect x="11.5" y="7.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
	</svg>
);

const CalendarIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<rect x="1.5" y="3" width="13" height="11.5" rx="1.75" stroke="currentColor" strokeWidth="1.4" />
		<line x1="1.5" y1="7" x2="14.5" y2="7" stroke="currentColor" strokeWidth="1.4" />
		<line x1="5" y1="1.5" x2="5" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
		<line x1="11" y1="1.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
		<rect x="4" y="9" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
		<rect x="9.5" y="9" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
	</svg>
);

const TargetIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
		<circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
		<circle cx="8" cy="8" r="1.25" fill="currentColor" />
	</svg>
);

const CoinsIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<ellipse cx="8" cy="4.5" rx="5" ry="1.75" stroke="currentColor" strokeWidth="1.4" />
		<path d="M3 4.5v3C3 8.88 5.24 10 8 10s5-1.12 5-2.5v-3" stroke="currentColor" strokeWidth="1.4" />
		<path d="M3 7.5v3C3 11.88 5.24 13 8 13s5-1.12 5-2.5v-3" stroke="currentColor" strokeWidth="1.4" />
	</svg>
);

const LogoIcon = () => (
	<svg viewBox="0 0 26 26" fill="none" aria-hidden="true">
		<rect x="2" y="2" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.9" />
		<rect x="14" y="2" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.6" />
		<rect x="2" y="14" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.6" />
		<rect x="14" y="14" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.85" />
	</svg>
);

/* ── Theme icons ── */
const SunIcon = () => (
	<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
		<circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" />
		<line x1="10" y1="2" x2="10" y2="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="16" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="14.36" y1="14.36" x2="15.78" y2="15.78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="4.22" y1="15.78" x2="5.64" y2="14.36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		<line x1="14.36" y1="5.64" x2="15.78" y2="4.22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
);

const MoonIcon = () => (
	<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
		<path
			d="M17.5 11.5A7.5 7.5 0 1 1 8.5 2.5a5.5 5.5 0 0 0 9 9z"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const tools: { id: Tool; title: string; icon: JSX.Element; component: React.FC }[] = [
	{ id: "salary",      title: "Net Salary",       icon: <SalaryIcon />,   component: SalaryCalculator },
	{ id: "eligibility", title: "Loan Eligibility",  icon: <BankIcon />,     component: LoanEligibilityCalculator },
	{ id: "payment",     title: "Loan Payments",     icon: <CalendarIcon />, component: LoanPaymentCalculator },
	{ id: "estimator",   title: "Salary Estimator",  icon: <TargetIcon />,   component: SalaryEstimator },
	{ id: "epf",         title: "EPF & ETF",          icon: <CoinsIcon />,    component: EpfEtfCalculator },
];

export default function HomePage(): JSX.Element {
	const [activeTool, setActiveTool] = useState<Tool>("salary");
	const [theme, setTheme] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const saved = localStorage.getItem("theme") as Theme | null;
		const preferred: Theme =
			saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(preferred);
	}, []);

	const toggleTheme = () => {
		const next: Theme = theme === "light" ? "dark" : "light";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.setAttribute("data-theme", next);
	};

	const ActiveComponent = tools.find((t) => t.id === activeTool)?.component ?? SalaryCalculator;

	return (
		<main className="tool-container">
			<div className="tool-inner">
				<header className="App-header">
					{mounted && (
						<button
							className="theme-toggle"
							onClick={toggleTheme}
							aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
						>
							{theme === "dark" ? <SunIcon /> : <MoonIcon />}
						</button>
					)}

					<div className="app-logo">
						<LogoIcon />
					</div>
					<h1>Financial Toolbox</h1>
					<p>Salary &amp; loan calculator for Sri Lanka</p>
				</header>

				<nav className="tool-switcher" role="tablist" aria-label="Calculator tools">
					{tools.map((tool) => (
						<button
							key={tool.id}
							role="tab"
							aria-selected={activeTool === tool.id}
							className={`tool-btn ${activeTool === tool.id ? "active" : ""}`}
							onClick={() => setActiveTool(tool.id)}
						>
							{tool.icon}
							{tool.title}
						</button>
					))}
				</nav>

				<ActiveComponent />

				<footer className="app-footer">Built for Sri Lankan professionals</footer>
			</div>
		</main>
	);
}
