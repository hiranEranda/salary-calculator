// app/page.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
// Import our typed functions and interface
import { calculateTax, formatCurrency, type SalaryDetails } from "@/lib/salary";

export default function HomePage(): JSX.Element {
	// The input value is always a string, so we type the state as a string.
	const [grossSalary, setGrossSalary] = useState<string>("");

	// Correctly type the event handler for an HTML input element.
	const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		// Regex validation remains the same.
		if (/^\d*\.?\d*$/.test(value)) {
			setGrossSalary(value);
		}
	};

	// Use the SalaryDetails interface to type the return value of useMemo.
	// This ensures the object we create always has the correct shape.
	const salaryDetails = useMemo<SalaryDetails>(() => {
		const salaryNum = parseFloat(grossSalary) || 0;

		const initialValues: SalaryDetails = {
			gross: 0,
			epf: 0,
			tax: 0,
			welfare: 0,
			totalDeductions: 0,
			netSalary: 0,
		};

		if (salaryNum === 0) {
			// We can directly return salaryNum for gross, or keep it consistent with an object
			return { ...initialValues, gross: salaryNum };
		}

		const epf = salaryNum * 0.08;
		const tax = calculateTax(salaryNum);
		const welfare = 75;
		const totalDeductions = epf + tax + welfare;
		const netSalary = salaryNum - totalDeductions;

		return {
			gross: salaryNum,
			epf,
			tax,
			welfare,
			totalDeductions,
			netSalary,
		};
	}, [grossSalary]);

	return (
		<main>
			<header className="App-header">
				<h1>📊 LKR Salary Calculator</h1>
				<p>Instantly see your take-home pay</p>
			</header>

			<div className="input-area">
				<label htmlFor="gross-salary">Enter Gross Monthly Salary (LKR)</label>
				<input
					id="gross-salary"
					type="text"
					inputMode="decimal"
					className="salary-input"
					value={grossSalary}
					onChange={handleSalaryChange}
					placeholder="e.g., 250000"
					autoFocus
				/>
			</div>

			<div className="results-breakdown">
				<div className="result-row">
					<span className="description">💼 Gross Salary</span>
					<span className="amount">{formatCurrency(salaryDetails.gross)}</span>
				</div>
				<div className="result-row">
					<span className="description" style={{ fontWeight: 600 }}>
						Deductions
					</span>
				</div>
				<div className="result-row">
					<span className="description" style={{ paddingLeft: "1.5rem" }}>
						🛠️ EPF (8%)
					</span>
					<span className="amount">- {formatCurrency(salaryDetails.epf)}</span>
				</div>
				<div className="result-row">
					<span className="description" style={{ paddingLeft: "1.5rem" }}>
						💰 Tax (APIIT)
					</span>
					<span className="amount">- {formatCurrency(salaryDetails.tax)}</span>
				</div>
				<div className="result-row">
					<span className="description" style={{ paddingLeft: "1.5rem" }}>
						🤝 Welfare
					</span>
					<span className="amount">- {formatCurrency(salaryDetails.welfare)}</span>
				</div>
				<div className="result-row total-row">
					<span className="description">❌ Total Deductions</span>
					<span className="amount">- {formatCurrency(salaryDetails.totalDeductions)}</span>
				</div>
				<div className="result-row net-salary-row">
					<span className="description">✅ Net Salary</span>
					<span className="amount">{formatCurrency(salaryDetails.netSalary)}</span>
				</div>
			</div>
		</main>
	);
}
