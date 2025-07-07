// app/page.tsx

"use client";

import React, { JSX, useState } from "react";
import SalaryCalculator from "@/components/SalaryCalculator";
import LoanCalculator from "@/components/LoanCalculator";

type Tool = "salary" | "loan";

export default function HomePage(): JSX.Element {
	const [activeTool, setActiveTool] = useState<Tool>("salary");

	return (
		<main className="tool-container">
			<header className="App-header">
				<h1>📊 Financial Toolbox</h1>
				<p>Your one-stop calculator for salary and loans in LKR</p>
			</header>

			{/* Tool switcher / Tab navigation */}
			<div className="tool-switcher">
				<button
					className={`tool-btn ${activeTool === "salary" ? "active" : ""}`}
					onClick={() => setActiveTool("salary")}
				>
					Net Salary Calculator
				</button>
				<button className={`tool-btn ${activeTool === "loan" ? "active" : ""}`} onClick={() => setActiveTool("loan")}>
					Housing Loan Eligibility
				</button>
			</div>

			{/* Conditionally render the active tool */}
			{activeTool === "salary" && <SalaryCalculator />}
			{activeTool === "loan" && <LoanCalculator />}
		</main>
	);
}
