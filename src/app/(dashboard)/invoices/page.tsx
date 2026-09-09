"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  AlertCircle,
  Download,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, type FilterDef } from "@/components/layout/PageToolbar";
import { type DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";
import invoicesService, { type Invoice } from "@/services/invoices.service";

const LIMIT = 10;

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatAmount = (v: number) => `SAR ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const formatInvoiceBadge = (raw?: string) => {
  if (!raw) return "";
  const cleaned = raw.replace(/^#/, "").trim();

  // Extract first 4 consecutive digits from the ID
  const digitMatch = cleaned.match(/\d{4}/);
  if (digitMatch) {
    return `INV-${digitMatch[0]}`;
  }

  const anyDigits = cleaned.match(/\d+/);
  if (anyDigits) {
    return `INV-${anyDigits[0]}`;
  }

  return cleaned;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    setLoading(true);
    invoicesService.list({
      page,
      status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
      search: search.trim() || undefined,
      start_date: dateFilter?.startDate,
      end_date: dateFilter?.endDate,
    })
      .then((res) => {
        setInvoices(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page, statusFilter, dateFilter, search]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase().trim();
      const formattedBadge = formatInvoiceBadge(inv.invoice_number).toLowerCase();
      const matchSearch =
        !q ||
        inv.invoice_number?.toLowerCase().includes(q) ||
        formattedBadge.includes(q) ||
        inv.description?.toLowerCase().includes(q) ||
        String(inv.total_amount).includes(q);
      const matchStatus =
        statusFilter === "All" || inv.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchDate = !dateFilter || isDateInRange(inv.invoice_date, dateFilter.preset, dateFilter.startDate, dateFilter.endDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [invoices, search, statusFilter, dateFilter]);

  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const unpaidCount = invoices.filter((i) => i.status !== "paid").length;
  const dueSoonCount = invoices.filter((i) => {
    if (i.status === "paid" || !i.due_date) return false;
    const due = new Date(i.due_date);
    const now = new Date();
    return (due.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const tableColumns = useMemo<ColumnDef<Invoice>[]>(() => [
    {
      header: "INVOICE",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{formatInvoiceBadge(row.invoice_number)}</span>,
    },
    {
      header: "DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.invoice_date)}</span>,
    },
    {
      header: "DUE DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.due_date)}</span>,
    },
    {
      header: "INVOICE DESCRIPTION",
      cell: (row) => <span className="font-semibold text-black text-fs-12">{row.description ?? row.b2b_client?.company_name ?? "—"}</span>,
    },
    {
      header: "AMOUNT",
      cell: (row) => <span className="font-bold text-text-primary text-fs-12">{formatAmount(row.total_amount)}</span>,
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
      options: ["All", "Paid", "Unpaid", "Overdue"],
      onSelect: (val) => { setStatusFilter(val); setPage(1); },
    },
    {
      type: "date",
      defaultValue: dateFilter?.label || "Date: All",
      onSelectDate: (range) => { setDateFilter(range); setPage(1); },
    },
  ], [statusFilter, dateFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Stats Cards */}
        <div className="bg-white p-3 lg:p-4 rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full lg:w-[280px] shrink-0 h-fit">
          <div className="flex flex-col gap-3">
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Paid<br />Invoices</span>
                <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : paidCount}</span>
              </div>
            </div>

            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Due<br />Soon</span>
                <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : dueSoonCount}</span>
              </div>
            </div>

            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Unpaid<br />Invoices</span>
                <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : unpaidCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Table */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <PageToolbar
            searchPlaceholder="Search by invoice #, description, or amount"
            searchValue={search}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            filters={toolbarFilters}
          />
          <DataTable
            data={filtered}
            columns={tableColumns}
            loading={loading}
            onRowClick={(row) => setSelectedInvoice(row)}
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: total,
              itemsPerPage: LIMIT,
              onPageChange: setPage,
            }}
          />
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} showCloseButton={false} maxWidth="max-w-[480px] sm:max-w-[500px]" className="p-7 sm:p-8">
        {selectedInvoice && (
          <div className="space-y-5">
            {/* Modal Header */}
            <div className="flex items-center gap-2.5">
              <h3 className="text-[18px] sm:text-[19px] font-bold font-poppins text-gray-900">Invoice Details</h3>
              <span className="text-[11px] font-bold text-white bg-[#8E95A5] px-3 py-0.5 rounded-full">
                {formatInvoiceBadge(selectedInvoice.invoice_number)}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FDF3E7] text-[#D97706] px-3.5 py-1 rounded-full ml-auto">
                {selectedInvoice.status || "DUE"}
              </span>
            </div>

            {/* Client / Company Info Row (Dynamic Logo or First Letter Avatar) */}
            {(() => {
              const clientName = selectedInvoice.b2b_client?.company_name ?? "Global Corp";
              const logoUrl = selectedInvoice.b2b_client?.logo_url || selectedInvoice.b2b_client?.logo;
              const firstLetter = clientName.trim().charAt(0).toUpperCase() || "G";

              return (
                <div className="flex items-center gap-3.5 pt-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center overflow-hidden shrink-0 text-primary font-bold text-[18px]">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={clientName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{firstLetter}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-gray-900 leading-tight">{clientName}</h4>
                    <p className="text-[12px] text-gray-400 mt-0.5 font-normal">{selectedInvoice.description ?? "Tier 1 Enterprise Account"}</p>
                  </div>
                </div>
              );
            })()}

            {/* Contract Period & Due Date Combined Card */}
            <div className="bg-[#F8F9FA] rounded-[22px] p-4 flex items-center justify-between gap-3 border border-gray-100/60">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    CONTRACT PERIOD
                  </span>
                  <span className="text-[13px] font-bold text-gray-900 block mt-0.5">
                    {selectedInvoice.invoice_date ? formatDate(selectedInvoice.invoice_date) : "Jan 01, 2024"} — {selectedInvoice.due_date ? formatDate(selectedInvoice.due_date) : "Dec 31, 2024"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    DUE DATE
                  </span>
                  <span className="text-[13px] font-bold text-gray-900 block mt-0.5">
                    {formatDate(selectedInvoice.due_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details Card */}
            <div className="bg-[#EAF6F8] rounded-[24px] p-5 space-y-3 border border-[#D5EEF2]/50">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">SERVICE DETAILS</span>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-600 font-normal">Number of Drivers Required</span>
                <span className="font-bold text-gray-900">2</span>
              </div>
              <div className="border-b border-dashed border-gray-300/80 my-1" />
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-600 font-normal">Number of Vehicles Required</span>
                <span className="font-bold text-gray-900">1</span>
              </div>
            </div>

            {/* Total Amount Banner */}
            <div className="bg-[#00BCD4] rounded-[24px] p-5 text-white flex items-center justify-between shadow-xs overflow-hidden relative">
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 block mb-1">INVOICE AMOUNT</span>
                <span className="text-[24px] font-bold font-poppins text-white leading-none">{formatAmount(selectedInvoice.total_amount)}</span>
              </div>
              <div className="flex items-end gap-1.5 shrink-0">
                <div className="w-4 h-5 bg-white/40 rounded-xs" />
                <div className="w-4 h-8 bg-white/60 rounded-xs" />
                <div className="w-4 h-7 bg-white/75 rounded-xs" />
                <div className="w-4 h-11 bg-white rounded-xs" />
                <div className="w-4 h-9 bg-white rounded-xs" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="h-11 sm:h-12 px-6 rounded-full bg-[#00525C] hover:bg-[#00414A] text-white text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.2]" />
                Download Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
