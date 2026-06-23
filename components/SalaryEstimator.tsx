// components/SalaryEstimator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { calculateTax, formatCurrency } from "@/lib/salary";

type ApplicantType = "single" | "joint";

interface SalaryCombination {
	salaryA: number;
	salaryB: number;
	total: number;
}

interface EstimationResult {
	loanAmount: number;
	monthlyPayment: number;
	singleRequiredSalary: number;
	jointCombinations: SalaryCombination[];
	error: string | null;
}

const findRequiredSalary = (requiredInstallment: number): number => {
	if (requiredInstallment <= 0) return 0;

	let guessSalary = requiredInstallment * 1.5;
	const MAX_SALARY = 10000000;
	const INCREMENT = 100;

	while (guessSalary < MAX_SALARY) {
		const epf = guessSalary * 0.08;
		const tax = calculateTax(guessSalary);
		const eligibleInstallment = guessSalary * 0.6 - epf - tax;

		if (eligibleInstallment >= requiredInstallment) {
			return Math.ceil(guessSalary / INCREMENT) * INCREMENT;
		}
		guessSalary += INCREMENT;
	}
	return 0;
};

export default function SalaryEstimator(): JSX.Element {
	const [applicantType, setApplicantType] = useState<ApplicantType>("single");
	const [boq, setBoq] = useState("");
	const [downPayment, setDownPayment] = useState("");
	const [rate, setRate] = useState("12");
	const [years, setYears] = useState("25");

	const NUMBER_OF_SPLITS = 20;

	const result = useMemo<EstimationResult>(() => {
		const houseCost = parseFloat(boq) || 0;
		const initialPayment = parseFloat(downPayment) || 0;
		const annualRate = parseFloat(rate) || 0;
		const loanYears = parseInt(years, 10) || 0;

		const defaultResult: EstimationResult = {
			loanAmount: 0,
			monthlyPayment: 0,
			singleRequiredSalary: 0,
			jointCombinations: [],
			error: null,
		};

		if (houseCost <= 0 || annualRate <= 0 || loanYears <= 0) return defaultResult;

		const loanAmount = houseCost - initialPayment;
		if (loanAmount <= 0) return defaultResult;

		const monthlyRate = annualRate / 100 / 12;
		const numberOfPayments = loanYears * 12;

		const monthlyPayment =
			(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
			(Math.pow(1 + monthlyRate, numberOfPayments) - 1);

		const singleRequiredSalary = findRequiredSalary(monthlyPayment);

		const jointCombinations: SalaryCombination[] = [];
		if (monthlyPayment > 0 && NUMBER_OF_SPLITS > 1) {
			for (let i = 0; i < NUMBER_OF_SPLITS; i++) {
				const splitRatio = (i / (NUMBER_OF_SPLITS - 1.0)) * 0.5;

				const installmentA = monthlyPayment * splitRatio;
				const installmentB = monthlyPayment * (1 - splitRatio);

				const salaryA = findRequiredSalary(installmentA);
				const salaryB = findRequiredSalary(installmentB);

				const isSalaryAValid = installmentA > 0 ? salaryA > 0 : true;
				const isSalaryBValid = installmentB > 0 ? salaryB > 0 : true;

				if (isSalaryAValid && isSalaryBValid) {
					jointCombinations.push({ salaryA, salaryB, total: salaryA + salaryB });
				}
			}
		}

		let error: string | null = null;
		if (applicantType === "single" && monthlyPayment > 0 && singleRequiredSalary === 0) {
			error = "The required salary is likely too high to estimate. Please check your inputs.";
		} else if (applicantType === "joint" && monthlyPayment > 0 && jointCombinations.length === 0) {
			error = "The required combined salary is likely too high to estimate. Please check your inputs.";
		}

		return { loanAmount, monthlyPayment, singleRequiredSalary, jointCombinations, error };
	}, [applicantType, boq, downPayment, rate, years]);

	return (
		<div className="tool-content">
			<div className="toggle-group">
				<button
					className={`toggle-btn ${applicantType === "single" ? "active" : ""}`}
					onClick={() => setApplicantType("single")}
				>
					Single Applicant
				</button>
				<button
					className={`toggle-btn ${applicantType === "joint" ? "active" : ""}`}
					onClick={() => setApplicantType("joint")}
				>
					Joint Applicants
				</button>
			</div>

			<div className="input-group" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
				<div className="input-area" style={{ gridColumn: "1 / -1" }}>
					<label htmlFor="boq">House Cost / BOQ Estimate</label>
					<div className="input-wrapper">
						<span className="input-prefix">LKR</span>
						<input
							id="boq"
							type="text"
							inputMode="decimal"
							className="salary-input"
							value={boq}
							onChange={(e) => setBoq(e.target.value.replace(/[^0-9.]/g, ""))}
							placeholder="e.g., 15,000,000"
						/>
					</div>
				</div>
				<div className="input-area" style={{ marginBottom: 0 }}>
					<label htmlFor="downpayment">Down Payment (Optional)</label>
					<div className="input-wrapper">
						<span className="input-prefix">LKR</span>
						<input
							id="downpayment"
							type="text"
							inputMode="decimal"
							className="salary-input"
							value={downPayment}
							onChange={(e) => setDownPayment(e.target.value.replace(/[^0-9.]/g, ""))}
							placeholder="e.g., 3,000,000"
						/>
					</div>
				</div>
				<div className="input-area" style={{ marginBottom: 0 }}>
					<label htmlFor="rate4">Annual Interest Rate</label>
					<div className="input-wrapper">
						<span className="input-prefix">%</span>
						<input
							id="rate4"
							type="text"
							inputMode="decimal"
							className="salary-input"
							value={rate}
							onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
						/>
					</div>
				</div>
				<div className="input-area" style={{ gridColumn: "2 / 3", marginBottom: 0 }}>
					<label htmlFor="years4">Loan Term</label>
					<div className="input-wrapper">
						<span className="input-prefix">YRS</span>
						<input
							id="years4"
							type="text"
							inputMode="numeric"
							className="salary-input"
							value={years}
							onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
						/>
					</div>
				</div>
			</div>

			{result.loanAmount > 0 && !result.error && (
				<div className="results-breakdown" style={{ marginTop: "1.75rem" }}>
					<h3 className="applicant-header" style={{ textAlign: "center", marginTop: 0 }}>
						Calculation Summary
					</h3>

					<div className="stats-strip">
						<div className="stat-card">
							<div className="stat-label">Needed Loan Amount</div>
							<div className="stat-value">{formatCurrency(result.loanAmount)}</div>
						</div>
						<div className="stat-card highlight-blue">
							<div className="stat-label">Monthly Installment</div>
							<div className="stat-value">{formatCurrency(result.monthlyPayment)}</div>
						</div>
					</div>

					{applicantType === "single" && (
						<div className="result-row net-salary-row" style={{ marginTop: "0.5rem" }}>
							<span className="description">Required Gross Monthly Salary</span>
							<span className="amount">{formatCurrency(result.singleRequiredSalary)}</span>
						</div>
					)}

					{applicantType === "joint" && (
						<div className="combinations-table">
							<h4>Possible Salary Combinations</h4>
							<div className="result-row table-header">
								<span>Applicant 1</span>
								<span>Applicant 2</span>
								<span>Combined</span>
							</div>
							{result.jointCombinations.map((combo, index) => (
								<div className="result-row" key={index}>
									<span>{formatCurrency(combo.salaryA)}</span>
									<span>{formatCurrency(combo.salaryB)}</span>
									<span style={{ fontWeight: 700 }}>{formatCurrency(combo.total)}</span>
								</div>
							))}
							<p className="eligibility-note">
								The combined salary for a couple is often <strong>less</strong> than a single person needs for the same
								loan — because lower individual taxes apply.
							</p>
						</div>
					)}
				</div>
			)}

			{result.error && <p className="error-note">{result.error}</p>}
		</div>
	);
}
