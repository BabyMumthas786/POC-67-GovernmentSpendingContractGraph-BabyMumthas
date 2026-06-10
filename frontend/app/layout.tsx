import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Government Spending Contract Graph | Intelligence Dashboard",
  description:
    "Interactive intelligence platform visualizing government spending relationships between agencies and vendors through contract data analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
