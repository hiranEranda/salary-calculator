// components/SalaryCalculator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { calculateTax, formatCurrency } from "@/lib/salary";

type DedType = "fixed" | "percentage";

interface CustomDeduction {
	id: string;
	label: string;
	type: DedType;
	value: string;
	enabled: boolean;
}

let _seq = 0;
const nextId = () => `cd${++_seq}`;

export default function SalaryCalculator(): JSX.Element {
	const [grossSalary, setGrossSalary] = useState("");

	// Built-in configurable deductions
	const [epfEnabled, setEpfEnabled]       = useState(true);
	const [epfRate, setEpfRate]             = useState("8");
	const [taxEnabled, setTaxEnabled]       = useState(true);
	const [welfareEnabled, setWelfareEnabled] = useState(true);
	const [welfareAmount, setWelfareAmount] = useState("75");

	// Custom deductions
	const [customDeds, setCustomDeds] = useState<CustomDeduction[]>([]);

	const addCustomDed = () =>
		setCustomDeds((prev) => [
			...prev,
			{ id: nextId(), label: "", type: "fixed", value: "", enabled: true },
		]);

	const removeCustomDed = (id: string) =>
		setCustomDeds((prev) => prev.filter((d) => d.id !== id));

	const updateCustomDed = (id: string, patch: Partial<CustomDeduction>) =>
		setCustomDeds((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));

	const gross = parseFloat(grossSalary) || 0;

	const calc = useMemo(() => {
		const epf     = epfEnabled && gross > 0 ? gross * ((parseFloat(epfRate) || 0) / 100) : 0;
		const tax     = taxEnabled && gross > 0 ? calculateTax(gross) : 0;
		const welfare = welfareEnabled && gross > 0 ? parseFloat(welfareAmount) || 0 : 0;

		const customItems = customDeds
			.filter((d) => d.enabled && gross > 0)
			.map((d) => {
				const v = parseFloat(d.value) || 0;
				return { ...d, amount: d.type === "percentage" ? gross * (v / 100) : v };
			});

		const customTotal = customItems.reduce((s, d) => s + d.amount, 0);
		const totalDeductions = epf + tax + welfare + customTotal;
		const netSalary = Math.max(0, gross - totalDeductions);

		return { epf, tax, welfare, customItems, customTotal, totalDeductions, netSalary };
	}, [gross, epfEnabled, epfRate, taxEnabled, welfareEnabled, welfareAmount, customDeds]);

	// Bar percentages
	const pct = (v: number) => (gross > 0 ? (v / gross) * 100 : 0);
	const netPct    = pct(calc.netSalary);
	const epfPct    = pct(calc.epf);
	const taxPct    = pct(calc.tax);
	const otherPct  = pct(calc.welfare + calc.customTotal);
	const hasOther  = calc.welfare > 0 || calc.customTotal > 0;
	const epfLabel  = `EPF (${epfRate || "0"}%)`;

	return (
		<div className="tool-content">

			{/* ── Gross Salary ── */}
			<div className="input-area">
				<label htmlFor="gross-salary">Gross Monthly Salary</label>
				<div className="input-wrapper">
					<span className="input-prefix">LKR</span>
					<input
						id="gross-salary"
						type="text"
						inputMode="decimal"
						className="salary-input"
						value={grossSalary}
						onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setGrossSalary(e.target.value); }}
						placeholder="e.g., 250,000"
						autoFocus
					/>
				</div>
			</div>

			{/* ── Deduction Settings ── */}
			<div className="ded-settings">
				<div className="ded-settings-header">
					<span className="ded-settings-title">Deductions</span>
					<button className="add-ded-btn" onClick={addCustomDed}>
						<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
							<line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
							<line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
						</svg>
						Add
					</button>
				</div>

				{/* EPF row */}
				<div className={`ded-row${!epfEnabled ? " ded-row-off" : ""}`}>
					<button
						className={`ded-toggle${!epfEnabled ? " ded-toggle-off" : ""}`}
						onClick={() => setEpfEnabled((v) => !v)}
						aria-label={epfEnabled ? "Disable EPF" : "Enable EPF"}
					/>
					<span className="ded-row-label">EPF (Employee)</span>
					<input
						type="text"
						inputMode="decimal"
						className="ded-amount-input"
						value={epfRate}
						disabled={!epfEnabled}
						onChange={(e) => setEpfRate(e.target.value.replace(/[^0-9.]/g, ""))}
					/>
					<span className="ded-unit">%</span>
				</div>

				{/* Tax row */}
				<div className={`ded-row${!taxEnabled ? " ded-row-off" : ""}`}>
					<button
						className={`ded-toggle${!taxEnabled ? " ded-toggle-off" : ""}`}
						onClick={() => setTaxEnabled((v) => !v)}
						aria-label={taxEnabled ? "Disable Tax" : "Enable Tax"}
					/>
					<span className="ded-row-label">Income Tax (APIIT)</span>
					<span className="ded-auto-badge">Auto</span>
				</div>

				{/* Welfare row */}
				<div className={`ded-row${!welfareEnabled ? " ded-row-off" : ""}`}>
					<button
						className={`ded-toggle${!welfareEnabled ? " ded-toggle-off" : ""}`}
						onClick={() => setWelfareEnabled((v) => !v)}
						aria-label={welfareEnabled ? "Disable Welfare" : "Enable Welfare"}
					/>
					<span className="ded-row-label">Welfare Levy</span>
					<input
						type="text"
						inputMode="decimal"
						className="ded-amount-input"
						value={welfareAmount}
						disabled={!welfareEnabled}
						onChange={(e) => setWelfareAmount(e.target.value.replace(/[^0-9.]/g, ""))}
					/>
					<span className="ded-unit">LKR</span>
				</div>

				{/* Custom deductions */}
				{customDeds.map((ded) => (
					<div key={ded.id} className={`ded-row ded-row-custom${!ded.enabled ? " ded-row-off" : ""}`}>
						<button
							className={`ded-toggle${!ded.enabled ? " ded-toggle-off" : ""}`}
							onClick={() => updateCustomDed(ded.id, { enabled: !ded.enabled })}
							aria-label={ded.enabled ? "Disable" : "Enable"}
						/>
						<input
							type="text"
							className="ded-label-input"
							value={ded.label}
							placeholder="Name"
							onChange={(e) => updateCustomDed(ded.id, { label: e.target.value })}
						/>
						<input
							type="text"
							inputMode="decimal"
							className="ded-amount-input"
							value={ded.value}
							placeholder="0"
							disabled={!ded.enabled}
							onChange={(e) => updateCustomDed(ded.id, { value: e.target.value.replace(/[^0-9.]/g, "") })}
						/>
						<div className="ded-type-toggle">
							<button
								className={`ded-type-btn${ded.type === "percentage" ? " active" : ""}`}
								onClick={() => updateCustomDed(ded.id, { type: "percentage" })}
							>%</button>
							<button
								className={`ded-type-btn${ded.type === "fixed" ? " active" : ""}`}
								onClick={() => updateCustomDed(ded.id, { type: "fixed" })}
							>LKR</button>
						</div>
						<button className="ded-remove-btn" onClick={() => removeCustomDed(ded.id)} aria-label="Remove deduction">
							<svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
								<line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
								<line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
							</svg>
						</button>
					</div>
				))}
			</div>

			{/* ── Breakdown bar ── */}
			{gross > 0 && (
				<div className="breakdown-viz">
					<div className="breakdown-bar">
						<div className="bar-segment bar-net"     style={{ width: `${netPct}%` }} />
						<div className="bar-segment bar-epf"     style={{ width: `${epfPct}%` }} />
						<div className="bar-segment bar-tax"     style={{ width: `${taxPct}%` }} />
						<div className="bar-segment bar-welfare" style={{ width: `${otherPct}%` }} />
					</div>
					<div className="breakdown-legend">
						<span className="legend-chip net">Net {Math.round(netPct)}%</span>
						{epfEnabled && calc.epf > 0 && (
							<span className="legend-chip epf">EPF {Math.round(epfPct)}%</span>
						)}
						{taxEnabled && calc.tax > 0 && (
							<span className="legend-chip tax">Tax {Math.round(taxPct)}%</span>
						)}
						{hasOther && <span className="legend-chip welfare">Other {Math.round(otherPct)}%</span>}
					</div>
				</div>
			)}

			{/* ── Results ── */}
			<div className="results-breakdown">
				<div className="result-row">
					<span className="description">Gross Salary</span>
					<span className="amount">{formatCurrency(gross)}</span>
				</div>

				<div className="result-row section-heading-row">
					<span className="description">Deductions</span>
				</div>

				{epfEnabled && (
					<div className="result-row detail-row">
						<span className="description">{epfLabel}</span>
						<span className="amount">– {formatCurrency(calc.epf)}</span>
					</div>
				)}
				{taxEnabled && (
					<div className="result-row detail-row">
						<span className="description">Income Tax (APIIT)</span>
						<span className="amount">– {formatCurrency(calc.tax)}</span>
					</div>
				)}
				{welfareEnabled && calc.welfare > 0 && (
					<div className="result-row detail-row">
						<span className="description">Welfare Levy</span>
						<span className="amount">– {formatCurrency(calc.welfare)}</span>
					</div>
				)}
				{calc.customItems.map((d) => (
					<div className="result-row detail-row" key={d.id}>
						<span className="description">
							{d.label || "Custom Deduction"}
							{d.type === "percentage" && d.value ? ` (${d.value}%)` : ""}
						</span>
						<span className="amount">– {formatCurrency(d.amount)}</span>
					</div>
				))}

				<div className="result-row total-row">
					<span className="description">Total Deductions</span>
					<span className="amount">– {formatCurrency(calc.totalDeductions)}</span>
				</div>

				<div className="result-row net-salary-row">
					<span className="description">Net Salary</span>
					<span className="amount">{formatCurrency(calc.netSalary)}</span>
				</div>
			</div>
		</div>
	);
}
