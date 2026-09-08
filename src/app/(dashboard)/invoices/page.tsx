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
    invoicesService.list(page)
      .then((res) => {
        setInvoices(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        inv.invoice_number?.toLowerCase().includes(q) ||
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

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const formatAmount = (v: number) => `SAR ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const tableColumns = useMemo<ColumnDef<Invoice>[]>(() => [
    {
      header: "INVOICE #",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">#{row.invoice_number}</span>,
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
      cell: (row) => <span className="font-medium text-text-primary text-fs-12">{row.description ?? row.b2b_client?.company_name ?? "—"}</span>,
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
      <div>
        <h1 className="h1 font-bold text-text-primary">Billing &amp; Invoices</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Stats Cards */}
        <div className="bg-white p-3 lg:p-4 rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full lg:w-[280px] shrink-0 h-fit">
          <div className="flex flex-col gap-3">
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">Paid<br />Invoices</span>
                <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">{loading ? "—" : paidCount}</span>
              </div>
            </div>

            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">Due<br />Soon</span>
                <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">{loading ? "—" : dueSoonCount}</span>
              </div>
            </div>

            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">Unpaid<br />Invoices</span>
                <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">{loading ? "—" : unpaidCount}</span>
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
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} showCloseButton={false} maxWidth="max-w-md" className="p-6 md:p-8">
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary">Invoice Details</h3>
              <span className="text-fs-11 font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                #{selectedInvoice.invoice_number}
              </span>
              <span className="text-fs-9 font-bold uppercase tracking-wider bg-[#FFF3E6] text-[#FF8A00] px-2.5 py-0.5 rounded-full ml-auto">
                {selectedInvoice.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs overflow-hidden">
                <Image src="/company.png" alt="Company Logo" width={36} height={36} className="object-contain" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              </div>
              <div>
                <h4 className="text-fs-12 font-bold text-text-primary">{selectedInvoice.b2b_client?.company_name ?? "—"}</h4>
                <p className="text-fs-10 text-gray-400">{selectedInvoice.description ?? "Corporate Invoice"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">INVOICE DATE</span>
                </div>
                <span className="text-fs-12 font-bold text-text-primary block pl-5">{formatDate(selectedInvoice.invoice_date)}</span>
              </div>
              <div className="p-3 bg-gray-50/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">DUE DATE</span>
                </div>
                <span className="text-fs-12 font-bold text-text-primary block pl-5">{formatDate(selectedInvoice.due_date)}</span>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-2.5">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">BILLING BREAKDOWN</span>
              <div className="flex items-center justify-between text-fs-12 border-b border-gray-200/60 pb-2">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-bold text-text-primary">{formatAmount(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-fs-12">
                <span className="text-text-secondary">VAT (15%)</span>
                <span className="font-bold text-text-primary">{formatAmount(selectedInvoice.vat_amount)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00B4D8] to-[#00C4DF] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-fs-9 uppercase font-bold tracking-widest text-white/80 block">INVOICE AMOUNT</span>
                <span className="text-fs-20 font-bold font-poppins text-white">{formatAmount(selectedInvoice.total_amount)}</span>
              </div>
              <div className="flex items-end gap-1 opacity-40">
                <span className="w-1.5 h-4 bg-white rounded-full" />
                <span className="w-1.5 h-6 bg-white rounded-full" />
                <span className="w-1.5 h-8 bg-white rounded-full" />
                <span className="w-1.5 h-5 bg-white rounded-full" />
              </div>
            </div>

            <Button onClick={() => setSelectedInvoice(null)} className="w-full py-3 text-fs-12 font-semibold rounded-full bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
