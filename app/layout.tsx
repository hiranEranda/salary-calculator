// app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "600"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "Financial Toolbox",
	description: "Sri Lankan salary and housing loan calculator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={poppins.variable}>{children}</body>
		</html>
	);
}
