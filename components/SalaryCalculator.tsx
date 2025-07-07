// components/SalaryCalculator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { calculateTax, formatCurrency } from "@/lib/salary";

interface SalaryBreakdown {
	gross: number;
	epf: number;
	tax: number;
	welfare: number;
	totalDeductions: number;
	netSalary: number;
}

export default function SalaryCalculator(): JSX.Element {
	const [grossSalary, setGrossSalary] = useState<string>("");

	const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			setGrossSalary(value);
		}
	};

	const salaryDetails = useMemo<SalaryBreakdown>(() => {
		const salaryNum = parseFloat(grossSalary) || 0;

		if (salaryNum === 0) {
			return { gross: 0, epf: 0, tax: 0, welfare: 0, totalDeductions: 0, netSalary: 0 };
		}

		const epf = salaryNum * 0.08;
		const tax = calculateTax(salaryNum);
		const welfare = 75;
		const totalDeductions = epf + tax + welfare;
		const netSalary = salaryNum - totalDeductions;

		return { gross: salaryNum, epf, tax, welfare, totalDeductions, netSalary };
	}, [grossSalary]);

	return (
		<div className="tool-content">
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
				{/* ... all other deduction rows ... */}
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
		</div>
	);
}
