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
        const [basicSalary, setBasicSalary] = useState<string>("");
        const [welfareCharge, setWelfareCharge] = useState<string>("75");

        const handleInputChange = (
                setter: React.Dispatch<React.SetStateAction<string>>,
        ) => (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                        setter(value);
                }
        };

        const salaryDetails = useMemo<SalaryBreakdown>(() => {
                const gross = parseFloat(grossSalary) || 0;
                const basic = parseFloat(basicSalary) || 0;
                const welfare = parseFloat(welfareCharge) || 0;

                if (gross === 0 && basic === 0 && welfare === 0) {
                        return { gross: 0, epf: 0, tax: 0, welfare: 0, totalDeductions: 0, netSalary: 0 };
                }

                const epf = basic * 0.08;
                const tax = calculateTax(gross);
                const totalDeductions = epf + tax + welfare;
                const netSalary = gross - totalDeductions;

                return { gross, epf, tax, welfare, totalDeductions, netSalary };
        }, [grossSalary, basicSalary, welfareCharge]);

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
                                        onChange={handleInputChange(setGrossSalary)}
                                        placeholder="e.g., 250000"
                                        autoFocus
                                />
                        </div>
                        <div className="input-area">
                                <label htmlFor="basic-salary">Enter Basic Monthly Salary (LKR)</label>
                                <input
                                        id="basic-salary"
                                        type="text"
                                        inputMode="decimal"
                                        className="salary-input"
                                        value={basicSalary}
                                        onChange={handleInputChange(setBasicSalary)}
                                        placeholder="e.g., 150000"
                                />
                        </div>
                        <div className="input-area">
                                <label htmlFor="welfare-charge">Welfare Charge (LKR)</label>
                                <input
                                        id="welfare-charge"
                                        type="text"
                                        inputMode="decimal"
                                        className="salary-input"
                                        value={welfareCharge}
                                        onChange={handleInputChange(setWelfareCharge)}
                                        placeholder="e.g., 75"
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
                                               💰 Tax (APIT)
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
