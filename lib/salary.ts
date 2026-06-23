// lib/salary.ts

/**
 * Defines the structure of the calculated salary details object.
 */
export interface SalaryDetails {
	gross: number;
	epf: number;
	tax: number;
	welfare: number;
	totalDeductions: number;
	netSalary: number;
	maxLoanInstallment: number; // <-- ADD THIS NEW PROPERTY
}

/**
 * Defines the structure for a tax bracket.
 */
interface TaxBracket {
	limit: number;
	rate: number;
}

/**
 * Calculates the monthly APIT (tax) based on Sri Lankan tax brackets.
 * @param {number} salary - The gross monthly salary.
 * @returns {number} The calculated monthly tax, rounded to 2 decimal places.
 */
export const calculateTax = (salary: number): number => {
	const taxRelief = 150000;
	let remainingSalary = salary - taxRelief;

	if (remainingSalary <= 0) {
		return 0;
	}

	let tax = 0;

	const brackets: TaxBracket[] = [
		{ limit: 1000000 / 12, rate: 0.06 },
		{ limit: 500000 / 12, rate: 0.18 },
		{ limit: 500000 / 12, rate: 0.24 },
		{ limit: 500000 / 12, rate: 0.3 },
		{ limit: Infinity, rate: 0.36 },
	];

	for (const bracket of brackets) {
		if (remainingSalary <= 0) break;

		const taxableAtThisBracket = Math.min(remainingSalary, bracket.limit);
		tax += taxableAtThisBracket * bracket.rate;
		remainingSalary -= taxableAtThisBracket;
	}

	return Math.round(tax * 100) / 100;
};

/**
 * Formats a number into a currency string with two decimal places.
 * @param {number} value - The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (value: number): string => {
	return value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};
