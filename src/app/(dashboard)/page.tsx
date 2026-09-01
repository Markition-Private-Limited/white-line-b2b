"use client";

import React, { useState } from "react";
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

  // Monthly Analytics Data
  const monthlyData = [
    { month: "Jan", paid: 260, unpaid: 160 },
    { month: "Feb", paid: 280, unpaid: 200 },
    { month: "Mar", paid: 230, unpaid: 140 },
    { month: "Apr", paid: 300, unpaid: 240 },
    { month: "May", paid: 190, unpaid: 220 },
    { month: "Jun", paid: 260, unpaid: 150 },
    { month: "Jul", paid: 300, unpaid: 240 },
    { month: "Aug", paid: 265, unpaid: 170 },
  ];

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Wide Card: Invoice Analytics Chart */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="h2 font-medium text-text-primary">Invoice Analytics</h3>
              <p className="body-2 text-gray-text">Monthly Vs Payment Status</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Legend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-fs-11 text-text-secondary font-medium">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B4D8]" />
                  <span className="text-fs-11 text-text-secondary font-medium">UnPaid</span>
                </div>
              </div>

              {/* Year Selector */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-fs-11 font-bold text-text-secondary hover:bg-gray-50 uppercase tracking-wider cursor-pointer"
                >
                  YEARLY {selectedYear}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Bar Chart Visual Representation */}
          <div className="pt-4 overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Y-Axis Grid & Bars */}
              <div className="relative h-52 flex items-end justify-between px-4 pb-2 border-b border-gray-100">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-fs-9 text-gray-300">
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>300k</span></div>
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>250k</span></div>
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>200k</span></div>
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>150k</span></div>
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>100k</span></div>
                  <div className="border-b border-gray-50 flex items-center justify-between"><span>50k</span></div>
                  <div className="flex items-center justify-between"><span>0</span></div>
                </div>

                {/* Bars per Month */}
                {monthlyData.map((item, idx) => {
                  const paidHeight = (item.paid / 320) * 100;
                  const unpaidHeight = (item.unpaid / 320) * 100;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 z-10 group">
                      <div className="flex items-end gap-1.5 h-44">
                        {/* Paid Bar */}
                        <div
                          className="w-4 bg-primary rounded-t-full transition-all duration-300 group-hover:opacity-90"
                          style={{ height: `${paidHeight}%` }}
                          title={`Paid: SAR ${item.paid}k`}
                        />
                        {/* Unpaid Bar */}
                        <div
                          className="w-4 bg-[#96E3ED] rounded-t-full transition-all duration-300 group-hover:opacity-90"
                          style={{ height: `${unpaidHeight}%` }}
                          title={`Unpaid: SAR ${item.unpaid}k`}
                        />
                      </div>
                      <span className="text-fs-11 text-text-secondary font-medium">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Scroll/Timeline Slider Indicator */}
              <div className="flex items-center justify-between px-2 pt-2 text-gray-300">
                <span className="text-[10px] select-none">◄</span>
                <div className="flex-1 mx-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gray-300 rounded-full" />
                </div>
                <span className="text-[10px] select-none">►</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Cards: Paid & Unpaid Summary */}
        <div className="flex flex-col gap-4">
          {/* Card 1: Paid Invoices */}
          <div className="flex-1 card-base p-6 flex flex-col justify-center">
            <span className="text-fs-12 font-medium text-text-secondary mb-1">Paid Invoices</span>
            <span className="text-fs-27 font-bold font-poppins text-text-primary">
              SAR 42,500
            </span>
          </div>

          {/* Card 2: Unpaid Invoices */}
          <div className="flex-1 card-base p-6 flex flex-col justify-center">
            <span className="text-fs-12 font-medium text-text-secondary mb-1">Unpaid Invoices</span>
            <span className="text-fs-27 font-bold font-poppins text-text-primary">
              SAR 8,120.50
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
