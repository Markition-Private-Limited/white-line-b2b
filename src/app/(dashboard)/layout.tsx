import React from "react";
import { HeaderNav } from "@/components/layout/HeaderNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <HeaderNav />
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
