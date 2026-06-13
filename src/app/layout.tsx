import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InstaShield | AI Account Detector",
  description: "Detect fake Instagram accounts instantly using AI-powered NLP & behavioral analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased selection:bg-neon-purple/30 selection:text-neon-blue`}>
        {children}
      </body>
    </html>
  );
}
