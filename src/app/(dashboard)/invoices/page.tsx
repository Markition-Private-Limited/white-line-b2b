"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  AlertCircle,
  Download,
  Building2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, FilterDef } from "@/components/layout/PageToolbar";
import { DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";

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
  { id: "#INV-9283", date: "2023-06-22", dueDate: "2023-02-07", description: "Blackwood Estate Corp", amount: "SAR 4,250.00", status: "active", companyName: "Global Corp", tier: "Tier 1 Enterprise Account", driversRequired: 2, vehiclesRequired: 1 },
  { id: "#INV-9284", date: "2023-06-22", dueDate: "2023-02-07", description: "Harlow & Co.", amount: "SAR 4,250.00", status: "pending", companyName: "Harlow & Co.", tier: "Corporate Premium", driversRequired: 4, vehiclesRequired: 2 },
  { id: "#INV-9285", date: "2023-06-22", dueDate: "2023-02-07", description: "Vanguard Logistics", amount: "SAR 4,250.00", status: "pending", companyName: "Vanguard Logistics", tier: "Enterprise Logistics", driversRequired: 6, vehiclesRequired: 3 },
  { id: "#INV-9286", date: "2023-06-22", dueDate: "2023-02-07", description: "Stellar Media Ltd", amount: "SAR 4,250.00", status: "active", companyName: "Stellar Media", tier: "VIP Media Fleet", driversRequired: 1, vehiclesRequired: 1 },
  { id: "#INV-9287", date: "2023-06-22", dueDate: "2023-02-07", description: "Enterprise HQ", amount: "SAR 4,250.00", status: "pending", companyName: "Enterprise HQ", tier: "Global HQ Corporate", driversRequired: 5, vehiclesRequired: 2 },
  { id: "#INV-9288", date: "2023-06-22", dueDate: "2023-02-07", description: "Julianne Moore", amount: "SAR 4,250.00", status: "active", companyName: "Moore Associates", tier: "Executive Charter", driversRequired: 1, vehiclesRequired: 1 },
  { id: "#INV-9289", date: "2023-06-22", dueDate: "2023-02-07", description: "Vanguard Logistics", amount: "SAR 4,250.00", status: "pending", companyName: "Vanguard Logistics", tier: "Logistics Hub", driversRequired: 3, vehiclesRequired: 2 },
  { id: "#INV-9290", date: "2023-06-22", dueDate: "2023-02-07", description: "Julianne Moore", amount: "SAR 4,250.00", status: "active", companyName: "Moore Executive", tier: "Chauffeur Fleet", driversRequired: 2, vehiclesRequired: 1 },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.amount.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = !dateFilter || isDateInRange(
        item.date,
        dateFilter.preset,
        dateFilter.startDate,
        dateFilter.endDate
      );

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateFilter]);

  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredInvoices.slice(start, start + limit);
  }, [filteredInvoices, page, limit]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / limit));

  const tableColumns = useMemo<ColumnDef<InvoiceItem>[]>(() => [
    {
      header: "INVOICE #",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.id}</span>,
    },
    {
      header: "DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.date}</span>,
    },
    {
      header: "DUE DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.dueDate}</span>,
    },
    {
      header: "INVOICE DESCRIPTION",
      cell: (row) => <span className="font-medium text-text-primary text-fs-12">{row.description}</span>,
    },
    {
      header: "AMOUNT",
      cell: (row) => <span className="font-bold text-text-primary text-fs-12">{row.amount}</span>,
    },
    {
      header: "STATUS",
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center">
          <StatusBadge status={row.status} />
        </div>
      ),
    },
  ], []);

  const toolbarFilters: FilterDef[] = useMemo(() => [
    {
      defaultValue: statusFilter === "All" ? "Status: All" : `Status: ${statusFilter}`,
      options: ["All", "Active", "Pending"],
      onSelect: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
    },
    {
      type: "date",
      defaultValue: dateFilter?.label || "Date: All",
      onSelectDate: (range) => {
        setDateFilter(range);
        setPage(1);
      },
    },
  ], [statusFilter, dateFilter]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <h1 className="h1 font-bold text-text-primary">Billing &amp; Invoices</h1>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-3">
          {/* Stat 1: Paid Invoices */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Paid<br />Invoices
              </span>
              <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Due Soon */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Due<br />Soon
              </span>
              <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Unpaid Invoices */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Unpaid<br />Invoices
              </span>
              <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>
        </div>

        {/* Right Column: Toolbar + DataTable Container */}
        <div className="lg:col-span-3 flex flex-col gap-2 flex-1">
          <PageToolbar
            searchPlaceholder="Search by invoice #, description, or amount"
            searchValue={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filters={toolbarFilters}
          />

          <DataTable
            data={paginatedInvoices}
            columns={tableColumns}
            onRowClick={(row) => setSelectedInvoice(row)}
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: filteredInvoices.length,
              itemsPerPage: limit,
              onPageChange: setPage,
              onRowsChange: (newLimit) => {
                setLimit(newLimit);
                setPage(1);
              },
            }}
          />
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
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary">Invoice Details</h3>
              <span className="text-fs-11 font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {selectedInvoice.id}
              </span>
              <span className="text-fs-9 font-bold uppercase tracking-wider bg-[#FFF3E6] text-[#FF8A00] px-2.5 py-0.5 rounded-full ml-auto">
                DUE
              </span>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs overflow-hidden">
                <Image
                  src="/company.png"
                  alt="Company Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <h4 className="text-fs-12 font-bold text-text-primary">{selectedInvoice.companyName}</h4>
                <p className="text-fs-10 text-gray-400">{selectedInvoice.tier}</p>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">
                    CONTRACT PERIOD
                  </span>
                </div>
                <span className="text-fs-12 font-bold text-text-primary block pl-5">Jan 01, 2024 — Dec 31, 2024</span>
              </div>
              <div className="p-3 bg-gray-50/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">
                    DUE DATE
                  </span>
                </div>
                <span className="text-fs-12 font-bold text-text-primary block pl-5">{selectedInvoice.dueDate}</span>
              </div>
            </div>

            {/* Service Details Box */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-2.5">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">
                SERVICE DETAILS
              </span>
              <div className="flex items-center justify-between text-fs-12 border-b border-gray-200/60 pb-2">
                <span className="text-text-secondary">Number of Drivers Required</span>
                <span className="font-bold text-text-primary">{selectedInvoice.driversRequired}</span>
              </div>
              <div className="flex items-center justify-between text-fs-12">
                <span className="text-text-secondary">Number of Vehicles Required</span>
                <span className="font-bold text-text-primary">{selectedInvoice.vehiclesRequired}</span>
              </div>
            </div>

            {/* Cyan Gradient Amount Box */}
            <div className="bg-gradient-to-r from-[#00B4D8] to-[#00C4DF] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-fs-9 uppercase font-bold tracking-widest text-white/80 block">
                  INVOICE AMOUNT
                </span>
                <span className="text-fs-20 font-bold font-poppins text-white">
                  {selectedInvoice.amount}
                </span>
              </div>
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
              className="w-full py-3 text-fs-12 font-semibold rounded-full bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2"
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
