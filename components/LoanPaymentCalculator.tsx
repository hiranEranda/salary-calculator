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
	const [rate, setRate] = useState("12"); // Default to 12%
	const [years, setYears] = useState("20"); // Default to 20 years

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
			<div className="input-group">
				<div className="input-area">
					<label htmlFor="amount">Loan Amount (LKR)</label>
					<input
						id="amount"
						type="text"
						inputMode="decimal"
						className="salary-input"
						value={amount}
						onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
						placeholder="e.g., 10000000"
					/>
				</div>
				<div className="input-area">
					<label htmlFor="rate">Annual Interest Rate (%)</label>
					<input
						id="rate"
						type="text"
						inputMode="decimal"
						className="salary-input"
						value={rate}
						onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
					/>
				</div>
				<div className="input-area">
					<label htmlFor="years">Loan Term (Years)</label>
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

			{result.monthlyPayment > 0 && (
				<div className="results-breakdown" style={{ marginTop: "2rem" }}>
					<div className="result-row loan-result-row">
						<span className="description">💰 Monthly Installment</span>
						<span className="amount">{formatCurrency(result.monthlyPayment)}</span>
					</div>
					<div className="result-row">
						<span className="description">📈 Total Interest Paid</span>
						<span className="amount">{formatCurrency(result.totalInterest)}</span>
					</div>
					<div className="result-row total-row">
						<span className="description">🧾 Total Amount Paid</span>
						<span className="amount">{formatCurrency(result.totalPayment)}</span>
					</div>
				</div>
			)}
		</div>
	);
}
