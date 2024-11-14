import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HEARTH - Hunting Exchange And Research Threat Hub",
  description: "A community-driven repository for threat hunting ideas, methodologies, and research.",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Navbar />
      <main>
        {children}
      </main>
      </body>
      </html>
  );
}