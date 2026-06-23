// components/EpfEtfCalculator.tsx

"use client";

import React, { useState, useMemo, JSX } from "react";
import { formatCurrency } from "@/lib/salary";

interface Rates {
	epfEmployee: string;
	epfEmployer: string;
	etfEmployer: string;
}

interface SalaryPeriod {
	id: string;
	salary: string;
	startMonth: string; // "YYYY-MM"
	endMonth: string;   // "YYYY-MM"
	isPresent: boolean;
}

interface PeriodResult {
	id: string;
	label: string;
	months: number;
	salary: number;
	epfEmployee: number;
	epfEmployer: number;
	etf: number;
	totalEpf: number;
	periodTotal: number;
}

interface Totals {
	months: number;
	epfEmployee: number;
	epfEmployer: number;
	etf: number;
	totalEpf: number;
	grandTotal: number;
}

const nowYM = (): string => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthsBetween = (start: string, end: string): number => {
	if (!start || !end) return 0;
	const [sy, sm] = start.split("-").map(Number);
	const [ey, em] = end.split("-").map(Number);
	return Math.max(0, (ey - sy) * 12 + (em - sm) + 1);
};

const fmtMonth = (ym: string): string => {
	if (!ym) return "";
	const [y, m] = ym.split("-");
	const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return `${names[parseInt(m) - 1]} ${y}`;
};

let counter = 0;
const uid = () => `p${++counter}`;

const makeDefaultPeriod = (): SalaryPeriod => ({
	id: uid(),
	salary: "",
	startMonth: "2022-01",
	endMonth: nowYM(),
	isPresent: true,
});

export default function EpfEtfCalculator(): JSX.Element {
	const [rates, setRates] = useState<Rates>({
		epfEmployee: "8",
		epfEmployer: "12",
		etfEmployer: "3",
	});

	const [periods, setPeriods] = useState<SalaryPeriod[]>([makeDefaultPeriod()]);

	const addPeriod = () => {
		setPeriods((prev) => [
			...prev,
			{
				id: uid(),
				salary: "",
				startMonth: nowYM(),
				endMonth: nowYM(),
				isPresent: true,
			},
		]);
	};

	const removePeriod = (id: string) =>
		setPeriods((prev) => prev.filter((p) => p.id !== id));

	const updatePeriod = (id: string, patch: Partial<SalaryPeriod>) =>
		setPeriods((prev) =>
			prev.map((p) => {
				if (p.id !== id) return p;
				const next = { ...p, ...patch };
				if (patch.isPresent === true) next.endMonth = nowYM();
				return next;
			})
		);

	const epfEmpPct = (parseFloat(rates.epfEmployee) || 0) / 100;
	const epfErPct  = (parseFloat(rates.epfEmployer) || 0) / 100;
	const etfPct    = (parseFloat(rates.etfEmployer)  || 0) / 100;

	const results = useMemo<PeriodResult[]>(() => {
		return periods.map((p) => {
			const salary = parseFloat(p.salary) || 0;
			const end    = p.isPresent ? nowYM() : p.endMonth;
			const months = monthsBetween(p.startMonth, end);

			const epfEmployee = salary * epfEmpPct * months;
			const epfEmployer = salary * epfErPct  * months;
			const etf         = salary * etfPct    * months;
			const totalEpf    = epfEmployee + epfEmployer;
			const periodTotal = totalEpf + etf;

			const endLabel = p.isPresent ? "Present" : fmtMonth(end);
			const label    = `${fmtMonth(p.startMonth)} – ${endLabel}`;

			return { id: p.id, label, months, salary, epfEmployee, epfEmployer, etf, totalEpf, periodTotal };
		});
	}, [periods, epfEmpPct, epfErPct, etfPct]);

	const totals = useMemo<Totals>(() => {
		return results.reduce(
			(acc, r) => ({
				months:      acc.months      + r.months,
				epfEmployee: acc.epfEmployee + r.epfEmployee,
				epfEmployer: acc.epfEmployer + r.epfEmployer,
				etf:         acc.etf         + r.etf,
				totalEpf:    acc.totalEpf    + r.totalEpf,
				grandTotal:  acc.grandTotal  + r.periodTotal,
			}),
			{ months: 0, epfEmployee: 0, epfEmployer: 0, etf: 0, totalEpf: 0, grandTotal: 0 }
		);
	}, [results]);

	const hasResults = results.some((r) => r.salary > 0 && r.months > 0);
	const visibleResults = results.filter((r) => r.salary > 0 && r.months > 0);

	return (
		<div className="tool-content">

			{/* ── Contribution Rates ── */}
			<div className="epf-section">
				<p className="epf-section-label">Contribution Rates</p>
				<div className="epf-rate-grid">
					<div className="input-area" style={{ marginBottom: 0 }}>
						<label htmlFor="epf-emp">Your EPF %</label>
						<div className="input-wrapper">
							<span className="input-prefix">%</span>
							<input
								id="epf-emp"
								type="text"
								inputMode="decimal"
								className="salary-input"
								value={rates.epfEmployee}
								onChange={(e) => setRates((r) => ({ ...r, epfEmployee: e.target.value.replace(/[^0-9.]/g, "") }))}
							/>
						</div>
					</div>
					<div className="input-area" style={{ marginBottom: 0 }}>
						<label htmlFor="epf-er">Employer EPF %</label>
						<div className="input-wrapper">
							<span className="input-prefix">%</span>
							<input
								id="epf-er"
								type="text"
								inputMode="decimal"
								className="salary-input"
								value={rates.epfEmployer}
								onChange={(e) => setRates((r) => ({ ...r, epfEmployer: e.target.value.replace(/[^0-9.]/g, "") }))}
							/>
						</div>
					</div>
					<div className="input-area" style={{ marginBottom: 0 }}>
						<label htmlFor="etf-er">Employer ETF %</label>
						<div className="input-wrapper">
							<span className="input-prefix">%</span>
							<input
								id="etf-er"
								type="text"
								inputMode="decimal"
								className="salary-input"
								value={rates.etfEmployer}
								onChange={(e) => setRates((r) => ({ ...r, etfEmployer: e.target.value.replace(/[^0-9.]/g, "") }))}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* ── Salary Timeline ── */}
			<div className="epf-section" style={{ marginTop: "1.5rem" }}>
				<div className="epf-timeline-header">
					<p className="epf-section-label" style={{ margin: 0 }}>Salary Timeline</p>
					<button className="add-period-btn" onClick={addPeriod}>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
							<line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
							<line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
						</svg>
						Add Period
					</button>
				</div>

				<div className="period-list">
					{periods.map((period, index) => {
						const resolvedEnd = period.isPresent ? nowYM() : period.endMonth;
						const months = monthsBetween(period.startMonth, resolvedEnd);
						return (
							<div className="period-card" key={period.id}>
								<div className="period-card-top">
									<span className="period-badge">Period {index + 1}</span>
									{periods.length > 1 && (
										<button
											className="remove-period-btn"
											onClick={() => removePeriod(period.id)}
											aria-label="Remove period"
										>
											<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
												<line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
												<line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
											</svg>
										</button>
									)}
								</div>

								<div className="period-dates">
									<div className="period-date-col">
										<label className="period-date-label">From</label>
										<input
											type="month"
											className="month-input"
											value={period.startMonth}
											max={resolvedEnd}
											onChange={(e) => updatePeriod(period.id, { startMonth: e.target.value })}
										/>
									</div>
									<span className="period-date-arrow">→</span>
									<div className="period-date-col">
										<label className="period-date-label">To</label>
										<input
											type="month"
											className={`month-input ${period.isPresent ? "month-input-disabled" : ""}`}
											value={resolvedEnd}
											min={period.startMonth}
											disabled={period.isPresent}
											onChange={(e) => updatePeriod(period.id, { endMonth: e.target.value })}
										/>
									</div>
									<label className="present-label">
										<input
											type="checkbox"
											className="present-checkbox"
											checked={period.isPresent}
											onChange={(e) => updatePeriod(period.id, { isPresent: e.target.checked })}
										/>
										<span>Present</span>
									</label>
								</div>

								<div className="input-area" style={{ marginBottom: 0, marginTop: "0.875rem" }}>
									<label>
										Monthly Salary
										{months > 0 && (
											<span className="duration-badge">
												{months} month{months !== 1 ? "s" : ""}
											</span>
										)}
									</label>
									<div className="input-wrapper">
										<span className="input-prefix">LKR</span>
										<input
											type="text"
											inputMode="decimal"
											className="salary-input"
											value={period.salary}
											placeholder="e.g., 150,000"
											onChange={(e) =>
												updatePeriod(period.id, {
													salary: e.target.value.replace(/[^0-9.]/g, ""),
												})
											}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* ── Results ── */}
			{hasResults && (
				<div className="epf-results">

					{/* Per-period breakdown table */}
					<div className="pbt-wrap">
						<div className="pbt-scroll">
							<div className="pbt-head">
								<span className="pbt-col-period">Period</span>
								<span className="pbt-col-num">EPF (You)</span>
								<span className="pbt-col-num">EPF (Employer)</span>
								<span className="pbt-col-num">ETF</span>
								<span className="pbt-col-num">Total</span>
							</div>
							{visibleResults.map((r) => (
								<div className="pbt-row" key={r.id}>
									<span className="pbt-col-period">
										<span className="pbt-period-name">{r.label}</span>
										<span className="pbt-period-sub">
											{r.months} mo · {formatCurrency(r.salary)}/mo
										</span>
									</span>
									<span className="pbt-col-num">{formatCurrency(r.epfEmployee)}</span>
									<span className="pbt-col-num">{formatCurrency(r.epfEmployer)}</span>
									<span className="pbt-col-num">{formatCurrency(r.etf)}</span>
									<span className="pbt-col-num pbt-col-total">{formatCurrency(r.periodTotal)}</span>
								</div>
							))}
						</div>
					</div>

					{/* Summary totals */}
					<div className="epf-totals">
						<div className="stats-strip" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
							<div className="stat-card">
								<div className="stat-label">Your EPF</div>
								<div className="stat-value">{formatCurrency(totals.epfEmployee)}</div>
							</div>
							<div className="stat-card">
								<div className="stat-label">Employer EPF</div>
								<div className="stat-value">{formatCurrency(totals.epfEmployer)}</div>
							</div>
							<div className="stat-card">
								<div className="stat-label">Employer ETF</div>
								<div className="stat-value">{formatCurrency(totals.etf)}</div>
							</div>
						</div>

						<div className="stats-strip">
							<div className="stat-card highlight-blue">
								<div className="stat-label">Total EPF Fund</div>
								<div className="stat-value">{formatCurrency(totals.totalEpf)}</div>
							</div>
							<div className="stat-card highlight-green">
								<div className="stat-label">Grand Total Savings</div>
								<div className="stat-value">{formatCurrency(totals.grandTotal)}</div>
							</div>
						</div>

						<div className="epf-duration-note">
							Across {totals.months} months ({Math.floor(totals.months / 12)} yr{Math.floor(totals.months / 12) !== 1 ? "s" : ""}
							{totals.months % 12 > 0 ? ` ${totals.months % 12} mo` : ""})
							&nbsp;·&nbsp;
							Rates: {rates.epfEmployee}% + {rates.epfEmployer}% EPF, {rates.etfEmployer}% ETF
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
