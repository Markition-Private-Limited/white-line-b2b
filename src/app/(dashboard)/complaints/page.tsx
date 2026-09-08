"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, UserCheck, CheckCircle2, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, type FilterDef } from "@/components/layout/PageToolbar";
import { type DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";
import complaintsService, { type Complaint } from "@/services/complaints.service";

const LIMIT = 10;

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    setLoading(true);
    complaintsService.list(page)
      .then((res) => {
        setComplaints(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.complaint_number?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All" || item.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchDate = !dateFilter || isDateInRange(item.created_at, dateFilter.preset, dateFilter.startDate, dateFilter.endDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [complaints, search, statusFilter, dateFilter]);

  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const pendingCount = complaints.filter((c) => c.status === "open" || c.status === "pending").length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const tableColumns = useMemo<ColumnDef<Complaint>[]>(() => [
    {
      header: "COMPLAINT ID",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">#{row.complaint_number}</span>,
    },
    {
      header: "BOOKING REF",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.booking_id ? `#BK-${row.booking_id.slice(0, 8)}` : "—"}</span>,
    },
    {
      header: "DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.created_at)}</span>,
    },
    {
      header: "SUBJECT",
      cell: (row) => <span className="font-medium text-text-primary text-fs-12">{row.subject}</span>,
    },
    {
      header: "SUBMITTED BY",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.submitted_by ?? "Admin"}</span>,
    },
    {
      header: "STATUS",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ], []);

  const toolbarFilters: FilterDef[] = useMemo(() => [
    {
      defaultValue: statusFilter === "All" ? "Status: All" : `Status: ${statusFilter}`,
      options: ["All", "Open", "Resolved", "In Review", "Pending"],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-bold text-text-primary">Complaints</h1>
          <p className="body-2 text-gray-text">Track and manage corporate complaints</p>
        </div>
        <Link
          href="/complaints/create"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-fs-12 font-medium hover:bg-primary-dark shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Complaint
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Stats Cards */}
        <div className="bg-white p-3 lg:p-4 rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full lg:w-[280px] shrink-0 h-fit">
          <div className="flex flex-col gap-3">
            {[
              { 
                label: "Total", label2: "Complaints", value: total, icon: UserCheck, 
                cardBg: "bg-[#E2F8FA] border-[#CDEEF2]", 
                iconBg: "bg-[#005C66] text-white" 
              },
              { 
                label: "Resolved", label2: "Complaints", value: resolvedCount, icon: CheckCircle2, 
                cardBg: "bg-[#FEF9E2] border-[#F5ECC4]", 
                iconBg: "bg-[#B2B042] text-white" 
              },
              { 
                label: "Pending", label2: "Complaints", value: pendingCount, icon: Clock, 
                cardBg: "bg-[#E7F9E4] border-[#D5F0D0]", 
                iconBg: "bg-[#62C25D] text-white" 
              },
            ].map((card) => (
              <div key={card.label} className={`rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] border shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${card.cardBg}`}>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">{card.label}<br />{card.label2}</span>
                  <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center shadow-xs`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-end mt-3">
                  <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">{loading ? "—" : card.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Table area */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <PageToolbar
            searchPlaceholder="Search by ID or subject..."
            searchValue={search}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            filters={toolbarFilters}
          />

          <DataTable
            data={filteredComplaints}
            columns={tableColumns}
            loading={loading}
            onRowClick={(row) => setSelectedComplaint(row)}
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

      {/* Complaint Details Modal */}
      <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} maxWidth="max-w-md" className="p-6 md:p-8">
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary">Complaint Details</h3>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <div className="space-y-1">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">ID</span>
              <p className="text-fs-12 font-semibold text-text-primary">#{selectedComplaint.complaint_number}</p>
            </div>

            <div className="space-y-1">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">SUBJECT</span>
              <p className="text-fs-13 font-semibold text-text-primary">{selectedComplaint.subject}</p>
            </div>

            <div className="space-y-1">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">DESCRIPTION</span>
              <p className="text-fs-12 text-text-secondary leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <div className="space-y-1">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">DATE SUBMITTED</span>
              <p className="text-fs-12 font-semibold text-text-primary">{formatDate(selectedComplaint.created_at)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
