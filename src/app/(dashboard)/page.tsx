"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  UserCheck,
  CheckCircle2,
  FileText,
  ChevronDown,
} from "lucide-react";
import dashboardService, { type DashboardData } from "@/services/dashboard.service";

interface MonthlyDataItem {
  month: string;
  paid: number;
  unpaid: number;
}

const FALLBACK_MONTHLY: MonthlyDataItem[] = [
  { month: "Jan", paid: 0, unpaid: 0 },
  { month: "Feb", paid: 0, unpaid: 0 },
  { month: "Mar", paid: 0, unpaid: 0 },
  { month: "Apr", paid: 0, unpaid: 0 },
  { month: "May", paid: 0, unpaid: 0 },
  { month: "Jun", paid: 0, unpaid: 0 },
  { month: "Jul", paid: 0, unpaid: 0 },
  { month: "Aug", paid: 0, unpaid: 0 },
];

export default function DashboardPage() {
  const [selectedYear] = useState(new Date().getFullYear().toString());
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthlyData = stats?.monthly_data ?? FALLBACK_MONTHLY;

  return (
    <div className="space-y-4">
      {/* 5 Top Stats Cards Grid */}
      <div className="bg-white p-3 lg:p-4 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Requests */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
              Active<br />Requests
            </span>
            <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                <Image src="/Avatar.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-400">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
            </div>
            <span className="text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.active_requests ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
              Pending<br />Requests
            </span>
            <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                <Image src="/Avatar.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
            </div>
            <span className="text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.pending_requests ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 3: Open Complaints */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
              Open<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4">
            <span className="text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.open_complaints ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E4EEFD] border border-[#D0DFF8] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
              Resolved<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#6888E0] text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4">
            <span className="text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.resolved_complaints ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 5: Due Invoices */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#005C66] text-white shadow-[0_8px_30px_rgba(0,92,102,0.22)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_12px_36px_rgba(0,92,102,0.3)]">
          <div className="flex items-start justify-between relative z-10">
            <span className="text-sm font-bold leading-tight font-poppins text-white">
              Due<br />Invoices
            </span>
            <div className="w-8 h-8 rounded-full bg-white text-[#005C66] flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4 relative z-10">
            <span className="text-[32px] font-bold font-poppins leading-none text-white">
              {loading ? "—" : (stats?.due_invoices ?? 0)}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Section: Analytics & Invoice Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Invoice Analytics Chart */}
        <div className="lg:col-span-8 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 font-poppins">Invoice Analytics</h3>
              <p className="text-xs text-gray-400 font-medium">Monthly Vs Payment Status</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 rounded-xs bg-[#199CA8]" />
                  <span className="text-xs text-gray-700 font-medium">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 rounded-xs bg-[#9FE4EE]" />
                  <span className="text-xs text-gray-700 font-medium">UnPaid</span>
                </div>
              </div>
              <div className="relative">
                <button type="button" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-wider cursor-pointer transition-colors">
                  YEARLY {selectedYear}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex gap-2">
              <div className="w-9 h-52 flex flex-col justify-between text-right text-[11px] text-gray-400 font-medium select-none pr-1.5 shrink-0">
                <span>300k</span><span>250k</span><span>200k</span><span>150k</span><span>100k</span><span>50k</span><span>0</span>
              </div>
              <div className="flex-1 relative h-52">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`border-b ${i === 6 ? "border-gray-200" : "border-gray-100/80"} w-full h-0`} />
                  ))}
                </div>
                <div className="relative h-full flex items-end justify-between px-3">
                  {monthlyData.map((item, idx) => {
                    const maxVal = 300;
                    const paidH = (item.paid / maxVal) * 100;
                    const unpaidH = (item.unpaid / maxVal) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center group z-10">
                        <div className="flex items-end gap-1 h-52 pb-0.5">
                          <div className="w-4 sm:w-5 bg-[#199CA8] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs" style={{ height: `${Math.min(100, paidH)}%` }} title={`${item.month} - Paid`} />
                          <div className="w-4 sm:w-5 bg-[#9FE4EE] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs" style={{ height: `${Math.min(100, unpaidH)}%` }} title={`${item.month} - Unpaid`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2.5">
              <div className="w-9 shrink-0" />
              <div className="flex-1 flex justify-between px-3">
                {monthlyData.map((item, idx) => (
                  <div key={idx} className="w-9 sm:w-10 md:w-11 text-center">
                    <span className="text-xs text-gray-700 font-medium select-none">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Paid & Unpaid Summary */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex-1 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-800 mb-3">Paid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : `SAR ${(stats?.paid_invoices_amount ?? 0).toLocaleString()}`}
            </span>
          </div>
          <div className="flex-1 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-800 mb-3">Unpaid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-bold font-poppins text-gray-900 leading-none">
              {loading ? "—" : `SAR ${(stats?.unpaid_invoices_amount ?? 0).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
