import React from "react";
import { HeaderNav } from "@/components/layout/HeaderNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-full w-full overflow-hidden bg-background">
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderNav />
        <main className="flex-1 overflow-y-auto bg-background-panel flex flex-col p-3.5 sm:p-5 lg:p-6">
          <div className="page-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
