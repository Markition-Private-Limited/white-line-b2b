import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WhiteLine — B2B Client Portal",
  description: "Corporate & B2B Booking and Fleet Portal built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased overflow-hidden`}>
      <body className="h-full flex flex-col bg-background text-foreground font-sans overflow-hidden">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
