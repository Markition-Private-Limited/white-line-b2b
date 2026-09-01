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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Card 1: Active Requests */}
        <div className="card-base p-5 flex flex-col justify-between min-h-[145px] bg-[#E6F8FA] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
              Active<br />Requests
            </span>
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-3">
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

            <span className="text-fs-27 font-bold font-poppins text-text-primary leading-none">
              154
            </span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="card-base p-5 flex flex-col justify-between min-h-[145px] bg-[#EAF8E6] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
              Pending<br />Requests
            </span>
            <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-3">
            {/* Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                <Image src="/Avatar.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
            </div>

            <span className="text-fs-27 font-bold font-poppins text-text-primary leading-none">
              98
            </span>
          </div>
        </div>

        {/* Card 3: Open Complaints */}
        <div className="card-base p-5 flex flex-col justify-between min-h-[145px] bg-[#FFF9E6] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
              Open<br />Complaints
            </span>
            <div className="w-7 h-7 rounded-full bg-[#EAB308] text-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-3">
            <span className="text-fs-27 font-bold font-poppins text-text-primary leading-none">
              34
            </span>
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="card-base p-5 flex flex-col justify-between min-h-[145px] bg-[#E8EEFB] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
              Resolved<br />Complaints
            </span>
            <div className="w-7 h-7 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-3">
            <span className="text-fs-27 font-bold font-poppins text-text-primary leading-none">
              12
            </span>
          </div>
        </div>

        {/* Card 5: Due Invoices (Hero Dark Teal Card) */}
        <div className="card-base p-5 flex flex-col justify-between min-h-[145px] bg-primary text-white border-none shadow-[0_8px_30px_rgba(0,92,102,0.18)] relative overflow-hidden">
          {/* Subtle Watermark Illustration */}
          <Coins className="w-28 h-28 text-white/10 absolute -bottom-6 -left-6 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <span className="text-fs-12 font-semibold leading-tight">
              Due<br />Invoices
            </span>
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shadow-sm">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-3 relative z-10">
            <span className="text-fs-27 font-bold font-poppins leading-none">
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
