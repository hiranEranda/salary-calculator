// components/LoanPaymentCalculator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { formatCurrency } from "@/lib/salary";

interface CalculationResult {
	monthlyPayment: number;
	totalPayment: number;
	totalInterest: number;
}

export default function LoanPaymentCalculator(): JSX.Element {
	const [amount, setAmount] = useState("");
	const [rate, setRate] = useState("12");
	const [years, setYears] = useState("20");

	const result = useMemo<CalculationResult>(() => {
		const principal = parseFloat(amount) || 0;
		const annualRate = parseFloat(rate) || 0;
		const loanYears = parseInt(years, 10) || 0;

		if (principal <= 0 || annualRate <= 0 || loanYears <= 0) {
			return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
		}

		const monthlyRate = annualRate / 100 / 12;
		const numberOfPayments = loanYears * 12;

		const monthlyPayment =
			(principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
			(Math.pow(1 + monthlyRate, numberOfPayments) - 1);

		const totalPayment = monthlyPayment * numberOfPayments;
		const totalInterest = totalPayment - principal;

		return { monthlyPayment, totalPayment, totalInterest };
	}, [amount, rate, years]);

	return (
		<div className="tool-content">
			<div className="input-area">
				<label htmlFor="amount">Loan Amount</label>
				<div className="input-wrapper">
					<span className="input-prefix">LKR</span>
					<input
						id="amount"
						type="text"
						inputMode="decimal"
						className="salary-input"
						value={amount}
						onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
						placeholder="e.g., 10,000,000"
					/>
				</div>
			</div>

			<div className="input-group" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
				<div className="input-area" style={{ marginBottom: 0 }}>
					<label htmlFor="rate">Annual Interest Rate</label>
					<div className="input-wrapper">
						<span className="input-prefix">%</span>
						<input
							id="rate"
							type="text"
							inputMode="decimal"
							className="salary-input"
							value={rate}
							onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
						/>
					</div>
				</div>
				<div className="input-area" style={{ marginBottom: 0 }}>
					<label htmlFor="years">Loan Term</label>
					<div className="input-wrapper">
						<span className="input-prefix">YRS</span>
						<input
							id="years"
							type="text"
							inputMode="numeric"
							className="salary-input"
							value={years}
							onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
						/>
					</div>
				</div>
			</div>

			{result.monthlyPayment > 0 && (
				<div className="results-breakdown" style={{ marginTop: "1.75rem" }}>
					<div className="result-row loan-result-row">
						<span className="description">Monthly Installment</span>
						<span className="amount">{formatCurrency(result.monthlyPayment)}</span>
					</div>

					<div className="stats-strip" style={{ marginTop: "1rem" }}>
						<div className="stat-card highlight-red">
							<div className="stat-label">Total Interest Paid</div>
							<div className="stat-value">{formatCurrency(result.totalInterest)}</div>
						</div>
						<div className="stat-card">
							<div className="stat-label">Total Amount Paid</div>
							<div className="stat-value">{formatCurrency(result.totalPayment)}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
