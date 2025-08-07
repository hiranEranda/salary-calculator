// components/LoanCalculator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { calculateTax, formatCurrency } from "@/lib/salary";

type LoanType = "single" | "joint";

interface ApplicantDetails {
	salary: number;
	loanPortion: number;
	epf: number; // <-- ADD
	tax: number; // <-- ADD
	totalDeductions: number; // <-- RENAME for clarity
	installment: number;
}

interface LoanBreakdown {
	applicant1: ApplicantDetails;
	applicant2: ApplicantDetails;
	totalMaxInstallment: number;
}

export default function LoanCalculator(): JSX.Element {
	const [loanType, setLoanType] = useState<LoanType>("single");
	const [salary1, setSalary1] = useState("");
	const [salary2, setSalary2] = useState("");

	const calculation = useMemo<LoanBreakdown>(() => {
		const calcForApplicant = (salaryStr: string): ApplicantDetails => {
			const salary = parseFloat(salaryStr) || 0;
			if (salary === 0) {
				return { salary: 0, loanPortion: 0, epf: 0, tax: 0, totalDeductions: 0, installment: 0 };
			}

			const epf = salary * 0.08;
			const tax = calculateTax(salary);
			const totalDeductions = epf + tax; // Use the new name
			const loanPortion = salary * 0.6;
			const installment = Math.max(0, loanPortion - totalDeductions);

			// Return the full breakdown
			return { salary, loanPortion, epf, tax, totalDeductions, installment };
		};

		const applicant1 = calcForApplicant(salary1);
		const applicant2 = loanType === "joint" ? calcForApplicant(salary2) : calcForApplicant("0");

		return {
			applicant1,
			applicant2,
			totalMaxInstallment: applicant1.installment + applicant2.installment,
		};
	}, [loanType, salary1, salary2]);

	return (
		<div className="tool-content">
			<div className="toggle-group">
				<button className={`toggle-btn ${loanType === "single" ? "active" : ""}`} onClick={() => setLoanType("single")}>
					👤 Single
				</button>
				<button className={`toggle-btn ${loanType === "joint" ? "active" : ""}`} onClick={() => setLoanType("joint")}>
					👥 Joint
				</button>
			</div>

			<div className="input-group">
				<div className="input-area">
					<label htmlFor="salary1">Applicant 1 Gross Salary (LKR)</label>
					<input
						id="salary1"
						type="text"
						inputMode="decimal"
						className="salary-input"
						value={salary1}
						onChange={(e) => setSalary1(e.target.value.replace(/[^0-9.]/g, ""))}
						placeholder="e.g., 250000"
					/>
				</div>

				{loanType === "joint" && (
					<div className="input-area">
						<label htmlFor="salary2">Applicant 2 Gross Salary (LKR)</label>
						<input
							id="salary2"
							type="text"
							inputMode="decimal"
							className="salary-input"
							value={salary2}
							onChange={(e) => setSalary2(e.target.value.replace(/[^0-9.]/g, ""))}
							placeholder="e.g., 180000"
						/>
					</div>
				)}
			</div>

			{(salary1 || (loanType === "joint" && salary2)) && (
				<div className="loan-eligibility">
					{/* Applicant 1 Breakdown */}
					<h3 className="applicant-header">👤 Applicant 1 Breakdown</h3>
					<div className="result-row">
						<span>Loanable Portion (60%)</span>
						<span>{formatCurrency(calculation.applicant1.loanPortion)}</span>
					</div>
					<div className="result-row sub-header-row">
						<span style={{ paddingLeft: "1.5rem" }}>Less: Deductions</span>
					</div>
					<div className="result-row detail-row">
						<span style={{ paddingLeft: "3rem" }}>EPF (8%)</span>
						<span>- {formatCurrency(calculation.applicant1.epf)}</span>
					</div>
					<div className="result-row detail-row">
                                               <span style={{ paddingLeft: "3rem" }}>Tax (APIT)</span>
						<span>- {formatCurrency(calculation.applicant1.tax)}</span>
					</div>
					<div className="result-row subtotal-row">
						<span>Eligible Installment</span>
						<span>{formatCurrency(calculation.applicant1.installment)}</span>
					</div>

					{/* Applicant 2 Breakdown */}
					{loanType === "joint" && (
						<>
							<h3 className="applicant-header">👥 Applicant 2 Breakdown</h3>
							<div className="result-row">
								<span>Loanable Portion (60%)</span>
								<span>{formatCurrency(calculation.applicant2.loanPortion)}</span>
							</div>
							<div className="result-row sub-header-row">
								<span style={{ paddingLeft: "1.5rem" }}>Less: Deductions</span>
							</div>
							<div className="result-row detail-row">
								<span style={{ paddingLeft: "3rem" }}>EPF (8%)</span>
								<span>- {formatCurrency(calculation.applicant2.epf)}</span>
							</div>
							<div className="result-row detail-row">
                                                            <span style={{ paddingLeft: "3rem" }}>Tax (APIT)</span>
								<span>- {formatCurrency(calculation.applicant2.tax)}</span>
							</div>
							<div className="result-row subtotal-row">
								<span>Eligible Installment</span>
								<span>{formatCurrency(calculation.applicant2.installment)}</span>
							</div>
						</>
					)}

					{/* Final Combined Result */}
					<div className="result-row loan-result-row">
						<span className="description">✅ Total Max. Monthly Installment</span>
						<span className="amount">{formatCurrency(calculation.totalMaxInstallment)}</span>
					</div>
				</div>
			)}
		</div>
	);
}
