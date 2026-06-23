// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Financial Toolbox — Salary & Loan Calculator",
	description:
		"Calculate your net salary, loan eligibility, monthly payments, and required salary for home loans in Sri Lanka (LKR).",
	keywords: ["salary calculator", "loan calculator", "Sri Lanka", "LKR", "EPF", "tax"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,opsz,wdth,wght@0,6..144,50..200,100..900;1,6..144,50..200,100..900&display=swap"
					rel="stylesheet"
				/>
				{/* Prevent flash of wrong theme before React hydrates */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var s=localStorage.getItem('theme');var p=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',p);})();`,
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
