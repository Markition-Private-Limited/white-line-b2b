"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Calendar,
  UserCheck,
  CheckCircle2,
  FileText,
  ChevronDown,
} from "lucide-react";
import dashboardService, { type DashboardData } from "@/services/dashboard.service";
import invoicesService, { type Invoice } from "@/services/invoices.service";
import { cn } from "@/utils/cn";

interface MonthlyDataItem {
  month: string;
  paid: number;
  unpaid: number;
}

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const FALLBACK_MONTHLY: MonthlyDataItem[] = ALL_MONTHS.map((month) => ({
  month,
  paid: 0,
  unpaid: 0,
}));

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const YEAR_OPTIONS = useMemo(() => {
    const current = new Date().getFullYear();
    return [current.toString(), (current - 1).toString(), (current - 2).toString(), (current - 3).toString()];
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      dashboardService.getDashboard(),
      invoicesService.list(1),
    ])
      .then(([dashRes, invRes]) => {
        if (dashRes.status === "fulfilled") {
          setStats(dashRes.value);
        }
        if (invRes.status === "fulfilled") {
          setInvoices(invRes.value.data ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthlyData: MonthlyDataItem[] = useMemo(() => {
    // 1. If backend stats already provides populated monthly_data with non-zero values, use it
    if (stats?.monthly_data && stats.monthly_data.some((d) => d.paid > 0 || d.unpaid > 0)) {
      const map = new Map(stats.monthly_data.map((d) => [d.month.toLowerCase(), d]));
      return ALL_MONTHS.map((month) => {
        const match = map.get(month.toLowerCase());
        return {
          month,
          paid: match?.paid ?? 0,
          unpaid: match?.unpaid ?? 0,
        };
      });
    }

    // 2. Otherwise calculate live monthly paid and unpaid totals directly from invoices
    const map = new Map<string, { paid: number; unpaid: number }>();
    ALL_MONTHS.forEach((m) => map.set(m.toLowerCase(), { paid: 0, unpaid: 0 }));

    if (invoices.length > 0) {
      invoices.forEach((inv) => {
        if (!inv.invoice_date) return;
        const d = new Date(inv.invoice_date);
        if (isNaN(d.getTime())) return;
        const currentYear = Number(selectedYear);
        if (d.getFullYear() === currentYear) {
          const monthKey = ALL_MONTHS[d.getMonth()]?.toLowerCase();
          const bucket = map.get(monthKey);
          if (bucket) {
            const amt = Number(inv.total_amount || 0);
            if (inv.status?.toLowerCase() === "paid") {
              bucket.paid += amt;
            } else {
              bucket.unpaid += amt;
            }
          }
        }
      });
    }

    return ALL_MONTHS.map((month) => {
      const bucket = map.get(month.toLowerCase()) || { paid: 0, unpaid: 0 };
      return {
        month,
        paid: bucket.paid,
        unpaid: bucket.unpaid,
      };
    });
  }, [stats?.monthly_data, invoices, selectedYear]);

  const maxVal = useMemo(() => {
    const highest = Math.max(...monthlyData.map((d) => Math.max(d.paid, d.unpaid)), 0);
    if (highest === 0) return 300000;
    if (highest <= 10000) return Math.ceil(highest / 1000) * 1000 || 10000;
    if (highest <= 50000) return Math.ceil(highest / 5000) * 5000 || 50000;
    if (highest <= 100000) return Math.ceil(highest / 10000) * 10000 || 100000;
    return Math.ceil(highest / 50000) * 50000 || 300000;
  }, [monthlyData]);

  const yAxisLabels = useMemo(() => {
    const steps = 6;
    const labels: string[] = [];
    for (let i = steps; i >= 0; i--) {
      const val = (maxVal / steps) * i;
      if (val >= 1000) {
        const k = val / 1000;
        labels.push(Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`);
      } else {
        labels.push(`${Math.round(val)}`);
      }
    }
    return labels;
  }, [maxVal]);

  return (
    <div className="space-y-4">
      {/* 5 Top Stats Cards Grid */}
      <div className="bg-white p-3 lg:p-4 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Requests */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">
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
            <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.active_requests ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">
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
            <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.pending_requests ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 3: Open Complaints */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">
              Open<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4">
            <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.open_complaints ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E4EEFD] border border-[#D0DFF8] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">
              Resolved<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#6888E0] text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4">
            <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : (stats?.resolved_complaints ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 5: Due Invoices */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#005C66] text-white shadow-[0_8px_30px_rgba(0,92,102,0.22)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_12px_36px_rgba(0,92,102,0.3)]">
          <div className="flex items-start justify-between relative z-10">
            <span className="text-[16px] lg:text-[17px] font-semibold leading-snug font-poppins text-white">
              Due<br />Invoices
            </span>
            <div className="w-8 h-8 rounded-full bg-white text-[#005C66] flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-4 relative z-10">
            <span className="text-[34px] lg:text-[38px] font-semibold font-poppins leading-none text-white">
              {loading ? "—" : (stats?.due_invoices ?? 0)}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Section: Analytics & Invoice Summary */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Invoice Analytics Chart */}
        <div className="flex-1 min-w-0 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
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
                <button
                  type="button"
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-wider cursor-pointer transition-colors select-none"
                >
                  YEARLY {selectedYear}
                  <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform duration-200", yearDropdownOpen && "rotate-180")} />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1 z-40">
                    {YEAR_OPTIONS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          setSelectedYear(yr);
                          setYearDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3.5 py-1.5 text-xs transition-colors cursor-pointer flex items-center justify-between",
                          selectedYear === yr
                            ? "text-primary font-bold bg-primary/5"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span>{yr}</span>
                        {selectedYear === yr && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="min-w-[540px]">
              <div className="flex gap-2">
                <div className="w-10 h-52 flex flex-col justify-between text-right text-[11px] text-gray-400 font-medium select-none pr-1.5 shrink-0">
                  {yAxisLabels.map((lbl, i) => (
                    <span key={i}>{lbl}</span>
                  ))}
                </div>
                <div className="flex-1 relative h-52">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`border-b ${i === 6 ? "border-gray-200" : "border-gray-100/80"} w-full h-0`} />
                    ))}
                  </div>
                  <div className="relative h-full flex items-end justify-between px-2 sm:px-4">
                    {monthlyData.map((item, idx) => {
                      const paidH = (item.paid / maxVal) * 100;
                      const unpaidH = (item.unpaid / maxVal) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center group z-10 flex-1 min-w-0">
                          <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-52 pb-0.5">
                            <div
                              className="w-2.5 sm:w-3 md:w-3.5 bg-[#199CA8] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs"
                              style={{ height: `${item.paid > 0 ? Math.min(100, Math.max(6, paidH)) : 0}%` }}
                              title={`${item.month} - Paid: SAR ${item.paid.toLocaleString()}`}
                            />
                            <div
                              className="w-2.5 sm:w-3 md:w-3.5 bg-[#9FE4EE] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs"
                              style={{ height: `${item.unpaid > 0 ? Math.min(100, Math.max(6, unpaidH)) : 0}%` }}
                              title={`${item.month} - Unpaid: SAR ${item.unpaid.toLocaleString()}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2.5">
                <div className="w-10 shrink-0" />
                <div className="flex-1 flex justify-between px-2 sm:px-4">
                  {monthlyData.map((item, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <span className="text-[11px] sm:text-xs text-gray-700 font-medium select-none">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Paid & Unpaid Summary */}
        <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 flex flex-col gap-4">
          <div className="flex-1 rounded-[28px] p-5 lg:p-6 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
            <span className="text-[15px] lg:text-[16px] font-semibold text-gray-800">Paid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : `SAR ${(stats?.paid_invoices_amount ?? 0).toLocaleString()}`}
            </span>
          </div>
          <div className="flex-1 rounded-[28px] p-5 lg:p-6 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
            <span className="text-[15px] lg:text-[16px] font-semibold text-gray-800">Unpaid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-semibold font-poppins text-gray-900 leading-none">
              {loading ? "—" : `SAR ${(stats?.unpaid_invoices_amount ?? 0).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
