"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Car,
  Calendar,
  UserCheck,
  CheckCircle2,
  FileText,
  ChevronDown,
  Coins,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Full 12 Monthly Analytics Data
  const monthlyData = [
    { month: "Jan", paid: 260, unpaid: 160 },
    { month: "Feb", paid: 280, unpaid: 200 },
    { month: "Mar", paid: 230, unpaid: 140 },
    { month: "Apr", paid: 300, unpaid: 240 },
    { month: "May", paid: 190, unpaid: 220 },
    { month: "Jun", paid: 260, unpaid: 150 },
    { month: "Jul", paid: 300, unpaid: 240 },
    { month: "Aug", paid: 265, unpaid: 170 },
    { month: "Sep", paid: 290, unpaid: 210 },
    { month: "Oct", paid: 245, unpaid: 175 },
    { month: "Nov", paid: 280, unpaid: 190 },
    { month: "Dec", paid: 310, unpaid: 260 },
  ];

  const handleScroll = () => {
    if (chartScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chartScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  const scrollByAmount = (amount: number) => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = chartScrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* 5 Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Requests */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
              Active<br />Requests
            </span>
            <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
              {/* Steering Wheel Icon */}
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
            {/* Avatar Stack */}
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
              154
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
            {/* Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                <Image src="/Avatar.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
            </div>

            <span className="text-[32px] font-bold font-poppins text-gray-900 leading-none">
              98
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
              34
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
              12
            </span>
          </div>
        </div>

        {/* Card 5: Due Invoices (Hero Dark Teal Card) */}
        <div className="rounded-[28px] p-5 lg:p-6 flex flex-col justify-between min-h-[165px] bg-[#005C66] text-white shadow-[0_8px_30px_rgba(0,92,102,0.22)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_12px_36px_rgba(0,92,102,0.3)]">
          {/* Subtle Money Bag Illustration */}
          <svg
            className="w-36 h-36 text-white/10 absolute -bottom-8 -left-6 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M50 20 C45 20, 42 12, 40 8 C48 10, 52 10, 60 8 C58 12, 55 20, 50 20 Z" fill="currentColor" fillOpacity="0.05" />
            <circle cx="50" cy="22" r="4" fill="currentColor" fillOpacity="0.2" />
            <path d="M50 24 C30 24, 15 45, 15 70 C15 88, 30 92, 50 92 C70 92, 85 88, 85 70 C85 45, 70 24, 50 24 Z" />
            <path d="M42 24 C36 40, 36 60, 42 90" strokeDasharray="3 3" opacity="0.3" />
            <path d="M58 24 C64 40, 64 60, 58 90" strokeDasharray="3 3" opacity="0.3" />
          </svg>

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
              23
            </span>
          </div>
        </div>
      </div>

      {/* Middle / Bottom Section: Analytics & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Wide Card: Invoice Analytics Chart */}
        <div className="lg:col-span-8 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 font-poppins">Invoice Analytics</h3>
              <p className="text-xs text-gray-400 font-medium">Monthly Vs Payment Status</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Legend */}
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

              {/* Year Selector */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-wider cursor-pointer transition-colors"
                >
                  YEARLY {selectedYear}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Chart Area with Fixed Y-Axis and Scrollable Bars */}
          <div className="pt-2">
            <div className="flex gap-2 relative">
              {/* Fixed Left Y-Axis Column */}
              <div className="w-10 h-52 flex flex-col justify-between text-right text-[11px] text-gray-400 font-medium select-none pr-2 shrink-0 z-20 bg-white">
                <span>300k</span>
                <span>250k</span>
                <span>200k</span>
                <span>150k</span>
                <span>100k</span>
                <span>50k</span>
                <span>0</span>
              </div>

              {/* Scrollable Chart Body */}
              <div
                ref={chartScrollRef}
                className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing pb-1"
              >
                <div className="min-w-[760px] relative h-52">
                  {/* Full-width Horizontal Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-100/80 w-full h-0" />
                    <div className="border-b border-gray-200 w-full h-0" />
                  </div>

                  {/* Dual Bars per Month */}
                  <div className="relative h-full flex items-end justify-between px-3">
                    {monthlyData.map((item, idx) => {
                      const paidHeight = (item.paid / 300) * 100;
                      const unpaidHeight = (item.unpaid / 300) * 100;

                      return (
                        <div key={idx} className="flex flex-col items-center group z-10 min-w-[50px]">
                          <div className="flex items-end gap-1 h-52 pb-0.5">
                            {/* Paid Bar */}
                            <div
                              className="w-5 sm:w-6 bg-[#199CA8] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs"
                              style={{ height: `${Math.min(100, paidHeight)}%` }}
                              title={`${item.month} - Paid: SAR ${item.paid}k`}
                            />
                            {/* Unpaid Bar */}
                            <div
                              className="w-5 sm:w-6 bg-[#9FE4EE] rounded-t-full transition-all duration-300 group-hover:brightness-105 cursor-pointer shadow-xs"
                              style={{ height: `${Math.min(100, unpaidHeight)}%` }}
                              title={`${item.month} - Unpaid: SAR ${item.unpaid}k`}
                            />
                          </div>
                          {/* Month Label */}
                          <span className="text-xs text-gray-700 font-medium mt-2.5 block select-none">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Bottom Scroll/Timeline Slider */}
            <div className="flex items-center justify-center gap-3 mt-4 text-gray-400">
              <button
                type="button"
                onClick={() => scrollByAmount(-200)}
                aria-label="Scroll left"
                className="p-1 text-xs hover:text-gray-700 transition-colors cursor-pointer select-none"
              >
                ◄
              </button>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  if (chartScrollRef.current) {
                    const maxScroll = chartScrollRef.current.scrollWidth - chartScrollRef.current.clientWidth;
                    chartScrollRef.current.scrollTo({ left: ratio * maxScroll, behavior: "smooth" });
                  }
                }}
                className="w-44 h-1.5 bg-gray-100 rounded-full overflow-hidden relative cursor-pointer"
              >
                <div
                  className="h-full bg-gray-300 rounded-full transition-all duration-150"
                  style={{
                    width: "40%",
                    transform: `translateX(${scrollProgress * 150}%)`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => scrollByAmount(200)}
                aria-label="Scroll right"
                className="p-1 text-xs hover:text-gray-700 transition-colors cursor-pointer select-none"
              >
                ►
              </button>
            </div>
          </div>
        </div>

        {/* Right Stacked Cards: Paid & Unpaid Summary */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Paid Invoices */}
          <div className="flex-1 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-800 mb-3">Paid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-bold font-poppins text-gray-900 leading-none">
              SAR 42,500
            </span>
          </div>

          {/* Card 2: Unpaid Invoices */}
          <div className="flex-1 rounded-[28px] p-6 lg:p-7 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-800 mb-3">Unpaid Invoices</span>
            <span className="text-[28px] lg:text-[32px] font-bold font-poppins text-gray-900 leading-none">
              SAR 8,120.50
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
