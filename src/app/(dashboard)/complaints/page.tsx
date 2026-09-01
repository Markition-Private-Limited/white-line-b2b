"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, FilterDef } from "@/components/layout/PageToolbar";
import { DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";

interface ComplaintItem {
  id: string;
  bookingRef: string;
  date: string;
  subject: string;
  submittedBy: string;
  status: "resolved" | "in_review" | "pending";
  reportedTime: string;
  message: string;
}

const mockComplaints: ComplaintItem[] = [
  { id: "#CP-1024", bookingRef: "#BK-7721", date: "2023-02-07", subject: "Delayed pickup in London", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 24, 2023 - 14:30", message: "The driver was extremely unprofessional during the trip. He took a much longer route than suggested by the GPS, which caused me to be late for my meeting. When I pointed this out, he was dismissive and continued to drive slowly. This is not the level of service I expect from an executive transport provider." },
  { id: "#CP-1025", bookingRef: "+966 50 123 4567", date: "2023-02-07", subject: "Unprofessional behavior", submittedBy: "James Wilson", status: "in_review", reportedTime: "Oct 24, 2023 - 11:15", message: "Driver was talking loudly on the phone throughout the journey without asking permission." },
  { id: "#CP-1026", bookingRef: "#BK-7721", date: "2023-02-07", subject: "Vehicle cleanliness issue", submittedBy: "James Wilson", status: "pending", reportedTime: "Oct 23, 2023 - 09:45", message: "The interior of the vehicle had not been cleaned from the previous ride." },
  { id: "#CP-1027", bookingRef: "#BK-7721", date: "2023-02-07", subject: "Incorrect billing amount", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 22, 2023 - 16:20", message: "Extra waiting time was charged even though the flight landed on time." },
  { id: "#CP-1028", bookingRef: "+966 50 123 4567", date: "2023-02-07", subject: "Delayed pickup in London", submittedBy: "James Wilson", status: "pending", reportedTime: "Oct 21, 2023 - 18:00", message: "Chauffeur arrived 25 minutes after the requested pickup time." },
  { id: "#CP-1029", bookingRef: "#BK-7721", date: "2023-02-07", subject: "Vehicle cleanliness issue", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 20, 2023 - 12:10", message: "Issue was inspected and credited back to corporate balance." },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(mockComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.bookingRef.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.submittedBy.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase().replace(" ", "_");

      const matchesDate = !dateFilter || isDateInRange(
        item.date,
        dateFilter.preset,
        dateFilter.startDate,
        dateFilter.endDate
      );

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateFilter]);

  const paginatedComplaints = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredComplaints.slice(start, start + limit);
  }, [filteredComplaints, page, limit]);

  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / limit));

  const tableColumns = useMemo<ColumnDef<ComplaintItem>[]>(() => [
    {
      header: "COMPLAINT ID",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.id}</span>,
    },
    {
      header: "BOOKING REF / CONTRACT",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.bookingRef}</span>,
    },
    {
      header: "DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.date}</span>,
    },
    {
      header: "SUBJECT",
      cell: (row) => <span className="font-medium text-text-primary text-fs-12">{row.subject}</span>,
    },
    {
      header: "SUBMITTED BY",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.submittedBy}</span>,
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
      options: ["All", "Resolved", "In Review", "Pending"],
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
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-bold text-text-primary">Complaints Management</h1>
        </div>
        <Link href="/complaints/create">
          <Button className="bg-primary hover:bg-primary-dark text-white text-fs-12 font-medium py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Create New Complaint
          </Button>
        </Link>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-3">
          {/* Stat 1: Total Complaints */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Total<br />Complaints
              </span>
              <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Resolved Complaints */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Resolved<br />Complaints
              </span>
              <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-[28px] font-bold font-poppins text-gray-900 leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Pending Complaints */}
          <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[145px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-gray-900 leading-tight font-poppins">
                Pending<br />Complaints
              </span>
              <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
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
            searchPlaceholder="Search complaints by ID, ref, or subject..."
            searchValue={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filters={toolbarFilters}
          />

          <DataTable
            data={paginatedComplaints}
            columns={tableColumns}
            onRowClick={(row) => setSelectedComplaint(row)}
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: filteredComplaints.length,
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

      {/* Complaint Details Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        maxWidth="max-w-lg"
        className="p-6 md:p-8"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary">{selectedComplaint.id}</h3>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <p className="text-fs-11 text-gray-400 -mt-4">
              Reported on {selectedComplaint.reportedTime}
            </p>

            {/* Subject */}
            <div className="space-y-1">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">
                SUBJECT
              </span>
              <h4 className="text-fs-13 font-bold text-text-primary font-poppins">{selectedComplaint.subject}</h4>
            </div>

            {/* Message Card */}
            <div className="space-y-1.5">
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider block">
                COMPLAINT MESSAGE
              </span>
              <div className="p-4 bg-gray-50/80 rounded-2xl border-l-4 border-[#00B4D8] text-fs-12 text-text-secondary leading-relaxed italic">
                &ldquo;{selectedComplaint.message}&rdquo;
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  setComplaints(complaints.filter((c) => c.id !== selectedComplaint.id));
                  setSelectedComplaint(null);
                }}
                className="py-2.5 px-6 text-fs-12 font-medium text-error border-error/30 hover:bg-error/5 rounded-full"
              >
                Delete Complaint
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
