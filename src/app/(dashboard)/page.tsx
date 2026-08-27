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
import { cn } from "@/utils/cn";

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
    <div className="space-y-6">
      {/* 5 Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Requests */}
        <div className="bg-[#E6F8FA] rounded-[24px] p-5 flex flex-col justify-between min-h-[160px] border border-cyan-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              Active<br />Requests
            </span>
            <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-sm">
              <Car className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            {/* Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                <Image src="/person.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-400">
                <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
              </div>
            </div>

            <span className="text-3xl font-bold font-poppins text-gray-900 leading-none">
              154
            </span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[160px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              Pending<br />Requests
            </span>
            <div className="w-8 h-8 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
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
                <Image src="/person.png" alt="Passenger" width={24} height={24} className="object-cover" />
              </div>
            </div>

            <span className="text-3xl font-bold font-poppins text-gray-900 leading-none">
              98
            </span>
          </div>
        </div>

        {/* Card 3: Open Complaints */}
        <div className="bg-[#FFF9E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[160px] border border-amber-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              Open<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EAB308] text-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-4">
            <span className="text-3xl font-bold font-poppins text-gray-900 leading-none">
              34
            </span>
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="bg-[#E8EEFB] rounded-[24px] p-5 flex flex-col justify-between min-h-[160px] border border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              Resolved<br />Complaints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-4">
            <span className="text-3xl font-bold font-poppins text-gray-900 leading-none">
              12
            </span>
          </div>
        </div>

        {/* Card 5: Due Invoices (Hero Dark Teal Card) */}
        <div className="bg-[#005C66] text-white rounded-[24px] p-5 flex flex-col justify-between min-h-[160px] shadow-[0_8px_30px_rgba(0,92,102,0.18)] relative overflow-hidden">
          {/* Subtle Watermark Money Bag Illustration */}
          <Coins className="w-28 h-28 text-white/10 absolute -bottom-6 -left-6 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <span className="text-sm font-bold leading-tight">
              Due<br />Invoices
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-end justify-end mt-4 relative z-10">
            <span className="text-3xl font-bold font-poppins leading-none">
              23
            </span>
          </div>
        </div>
      </div>

      {/* Middle / Bottom Section: Analytics & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Wide Card: Invoice Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold font-poppins text-gray-900">Invoice Analytics</h3>
              <p className="text-xs text-gray-400">Monthly Vs Payment Status</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Legend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#005C66]" />
                  <span className="text-xs text-gray-600 font-medium">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#00B4D8]" />
                  <span className="text-xs text-gray-600 font-medium">UnPaid</span>
                </div>
              </div>

              {/* Year Selector */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-wider"
                >
                  YEARLY {selectedYear}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Bar Chart Visual Representation */}
          <div className="pt-6 overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Y-Axis Grid & Bars */}
              <div className="relative h-56 flex items-end justify-between px-6 pb-2 border-b border-gray-100">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-300">
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
                    <div key={idx} className="flex flex-col items-center gap-2 z-10 group">
                      <div className="flex items-end gap-1.5 h-48">
                        {/* Paid Bar */}
                        <div
                          className="w-5 bg-[#005C66] rounded-t-full transition-all duration-300 group-hover:opacity-90"
                          style={{ height: `${paidHeight}%` }}
                          title={`Paid: SAR ${item.paid}k`}
                        />
                        {/* Unpaid Bar */}
                        <div
                          className="w-5 bg-[#96E3ED] rounded-t-full transition-all duration-300 group-hover:opacity-90"
                          style={{ height: `${unpaidHeight}%` }}
                          title={`Unpaid: SAR ${item.unpaid}k`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Cards: Paid & Unpaid Summary */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Paid Invoices */}
          <div className="flex-1 bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-700 mb-2">Paid Invoices</span>
            <span className="text-2xl lg:text-3xl font-bold font-poppins text-gray-900">
              SAR 42,500
            </span>
          </div>

          {/* Card 2: Unpaid Invoices */}
          <div className="flex-1 bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-700 mb-2">Unpaid Invoices</span>
            <span className="text-2xl lg:text-3xl font-bold font-poppins text-gray-900">
              SAR 8,120.50
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
