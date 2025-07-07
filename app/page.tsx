// app/page.tsx

"use client";

import React, { JSX, useState } from "react";
import SalaryCalculator from "@/components/SalaryCalculator";
import LoanEligibilityCalculator from "@/components/LoanCalculator"; // Renamed for clarity
import LoanPaymentCalculator from "@/components/LoanPaymentCalculator";
import SalaryEstimator from "@/components/SalaryEstimator";

// Expanded type to include all four tools
type Tool = "salary" | "eligibility" | "payment" | "estimator";

// Define tool metadata for cleaner mapping
const tools: { id: Tool; title: string; component: React.FC }[] = [
	{ id: "salary", title: "Net Salary", component: SalaryCalculator },
	{ id: "eligibility", title: "Loan Eligibility", component: LoanEligibilityCalculator },
	{ id: "payment", title: "Loan Payments", component: LoanPaymentCalculator },
	{ id: "estimator", title: "Salary Estimator", component: SalaryEstimator },
];

export default function HomePage(): JSX.Element {
	const [activeTool, setActiveTool] = useState<Tool>("salary");

	const ActiveComponent = tools.find((tool) => tool.id === activeTool)?.component || SalaryCalculator;

	return (
		<main className="tool-container">
			<header className="App-header">
				<h1>📊 Financial Toolbox</h1>
				<p>Your one-stop calculator for salary and loans in LKR</p>
			</header>

			<div className="tool-switcher">
				{tools.map((tool) => (
					<button
						key={tool.id}
						className={`tool-btn ${activeTool === tool.id ? "active" : ""}`}
						onClick={() => setActiveTool(tool.id)}
					>
						{tool.title}
					</button>
				))}
			</div>

			<ActiveComponent />
		</main>
	);
}
