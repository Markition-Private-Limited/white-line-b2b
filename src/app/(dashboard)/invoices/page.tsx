"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  ChevronDown,
  FileText,
  Clock,
  AlertCircle,
  Download,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface InvoiceItem {
  id: string;
  date: string;
  dueDate: string;
  description: string;
  amount: string;
  status: "active" | "pending";
  companyName: string;
  tier: string;
  driversRequired: number;
  vehiclesRequired: number;
}

const mockInvoices: InvoiceItem[] = [
  { id: "#INV-9283", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Blackwood Estate Corp", amount: "SAR 4,250.00", status: "active", companyName: "Global Corp", tier: "Tier 1 Enterprise Account", driversRequired: 2, vehiclesRequired: 1 },
  { id: "#INV-9284", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Harlow & Co.", amount: "SAR 4,250.00", status: "pending", companyName: "Harlow & Co.", tier: "Corporate Premium", driversRequired: 4, vehiclesRequired: 2 },
  { id: "#INV-9285", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Vanguard Logistics", amount: "SAR 4,250.00", status: "pending", companyName: "Vanguard Logistics", tier: "Enterprise Logistics", driversRequired: 6, vehiclesRequired: 3 },
  { id: "#INV-9286", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Stellar Media Ltd", amount: "SAR 4,250.00", status: "active", companyName: "Stellar Media", tier: "VIP Media Fleet", driversRequired: 1, vehiclesRequired: 1 },
  { id: "#INV-9287", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Enterprise HQ", amount: "SAR 4,250.00", status: "pending", companyName: "Enterprise HQ", tier: "Global HQ Corporate", driversRequired: 5, vehiclesRequired: 2 },
  { id: "#INV-9288", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Julianne Moore", amount: "SAR 4,250.00", status: "active", companyName: "Moore Associates", tier: "Executive Charter", driversRequired: 1, vehiclesRequired: 1 },
  { id: "#INV-9289", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Vanguard Logistics", amount: "SAR 4,250.00", status: "pending", companyName: "Vanguard Logistics", tier: "Logistics Hub", driversRequired: 3, vehiclesRequired: 2 },
  { id: "#INV-9290", date: "June 22, 2023", dueDate: "Feb 07, 2023", description: "Julianne Moore", amount: "SAR 4,250.00", status: "active", companyName: "Moore Executive", tier: "Chauffeur Fleet", driversRequired: 2, vehiclesRequired: 1 },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  const filteredInvoices = mockInvoices.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.amount.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold font-poppins text-gray-900">Billing &amp; Invoices</h1>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-4">
          {/* Stat 1: Paid Invoices */}
          <div className="bg-[#E6F8FA] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-cyan-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Paid<br />Invoices
              </span>
              <div className="w-7 h-7 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Due Soon */}
          <div className="bg-[#FFF9E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-amber-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Due<br />Soon
              </span>
              <div className="w-7 h-7 rounded-full bg-[#EAB308] text-white flex items-center justify-center shadow-sm">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Unpaid Invoices */}
          <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Unpaid<br />Invoices
              </span>
              <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>
        </div>

        {/* Right Column: Table Container */}
        <div className="lg:col-span-3 bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between min-h-[500px]">
          <div>
            {/* Toolbar Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by invoice #, description, or amount"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-50/80 border border-gray-200 rounded-full pl-4 pr-8 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#005C66] cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="active">Status: Active</option>
                    <option value="pending">Status: Pending</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200 rounded-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Date
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#005C66] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4 rounded-tl-xl">INVOICE #</th>
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">DUE DATE</th>
                    <th className="py-3 px-4">INVOICE DESCRIPTION</th>
                    <th className="py-3 px-4">AMOUNT</th>
                    <th className="py-3 px-4 rounded-tr-xl text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredInvoices.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedInvoice(row)}
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.id}</td>
                      <td className="py-3 px-4 text-gray-500">{row.date}</td>
                      <td className="py-3 px-4 text-gray-500">{row.dueDate}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{row.description}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.amount}</td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400 mt-4">
            <span>Showing 5 of 1,284 results</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-full bg-[#005C66] text-white font-bold flex items-center justify-center text-[10px]">
                1
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
                2
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
                3
              </button>
              <span>...</span>
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
                124
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="max-w-md"
        className="p-6 md:p-8"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold font-poppins text-gray-900">Invoice Details</h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {selectedInvoice.id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF3E6] text-[#FF8A00] px-2.5 py-0.5 rounded-full ml-auto">
                DUE
              </span>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5 text-[#005C66]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{selectedInvoice.companyName}</h4>
                <p className="text-[10px] text-gray-400">{selectedInvoice.tier}</p>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  CONTRACT PERIOD
                </span>
                <span className="text-xs font-bold text-gray-800">Jan 01, 2024 — Dec 31, 2024</span>
              </div>
              <div className="p-3 bg-gray-50/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  DUE DATE
                </span>
                <span className="text-xs font-bold text-gray-800">Oct 28, 2023</span>
              </div>
            </div>

            {/* Service Details Box */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                SERVICE DETAILS
              </span>
              <div className="flex items-center justify-between text-xs border-b border-gray-200/60 pb-2">
                <span className="text-gray-600">Number of Drivers Required</span>
                <span className="font-bold text-gray-900">{selectedInvoice.driversRequired}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Number of Vehicles Required</span>
                <span className="font-bold text-gray-900">{selectedInvoice.vehiclesRequired}</span>
              </div>
            </div>

            {/* Cyan Gradient Amount Box */}
            <div className="bg-gradient-to-r from-[#00B4D8] to-[#00C4DF] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 block">
                  INVOICE AMOUNT
                </span>
                <span className="text-xl font-bold font-poppins text-white">
                  {selectedInvoice.amount}
                </span>
              </div>
              {/* Graphic Equalizer Bars */}
              <div className="flex items-end gap-1 opacity-40">
                <span className="w-1.5 h-4 bg-white rounded-full" />
                <span className="w-1.5 h-6 bg-white rounded-full" />
                <span className="w-1.5 h-8 bg-white rounded-full" />
                <span className="w-1.5 h-5 bg-white rounded-full" />
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => setSelectedInvoice(null)}
              className="w-full py-3 text-xs font-semibold rounded-full bg-[#005C66] text-white hover:bg-[#004b54] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
