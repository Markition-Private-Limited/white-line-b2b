"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { SuccessFlowerBadge } from "@/components/ui/SuccessModal";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, type FilterDef } from "@/components/layout/PageToolbar";
import { type DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";
import complaintsService, { type Complaint } from "@/services/complaints.service";

const LIMIT = 10;

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatDateWithTime = (d?: string) => {
  if (!d) return "—";
  const date = new Date(d);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const formattedTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `Reported on ${formattedDate} - ${formattedTime}`;
};

const formatComplaintId = (raw?: string) => {
  if (!raw) return "";
  const cleaned = raw.replace(/^#/, "").trim();

  // Extract first 4 consecutive digits from the ID
  const digitMatch = cleaned.match(/\d{4}/);
  if (digitMatch) {
    return `CP-${digitMatch[0]}`;
  }

  const anyDigits = cleaned.match(/\d+/);
  if (anyDigits) {
    return `CP-${anyDigits[0]}`;
  }

  if (cleaned.startsWith("CP-") || cleaned.startsWith("C-")) {
    return cleaned;
  }
  return `CP-${cleaned}`;
};

const formatComplaintIdNoHash = (raw?: string) => {
  if (!raw) return "";
  const cleaned = raw.replace(/^#/, "").trim();

  // Extract first 4 consecutive digits from the ID
  const digitMatch = cleaned.match(/\d{4}/);
  if (digitMatch) {
    return `CP-${digitMatch[0]}`;
  }

  const anyDigits = cleaned.match(/\d+/);
  if (anyDigits) {
    return `CP-${anyDigits[0]}`;
  }

  if (cleaned.startsWith("CP-") || cleaned.startsWith("C-")) {
    return cleaned;
  }
  return `CP-${cleaned}`;
};

const renderSmallStatusBadge = (status?: string) => {
  const s = status?.toLowerCase() || "open";
  let bg = "bg-[#FFF4E5] text-[#D97706] border-[#FED7AA]";
  let label = status || "OPEN";

  if (s === "resolved") {
    bg = "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]";
    label = "RESOLVED";
  } else if (s === "cancelled") {
    bg = "bg-gray-100 text-gray-500 border-gray-300";
    label = "CANCELLED";
  } else if (s === "in review") {
    bg = "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
    label = "IN REVIEW";
  } else if (s === "pending") {
    bg = "bg-[#FFF4E5] text-[#D97706] border-[#FED7AA]";
    label = "PENDING";
  } else {
    bg = "bg-[#FFF4E5] text-[#D97706] border-[#FED7AA]";
    label = "OPEN";
  }

  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${bg}`}>
      {label}
    </span>
  );
};

const formatBookingOrContract = (row: any) => {
  if (!row) return "—";

  const val =
    row.contact_number ??
    row.phone ??
    row.booking_id ??
    row.contract_number ??
    row.booking_ref ??
    row.service_request_id;

  if (val && String(val).trim() && String(val).trim() !== "null" && String(val).trim() !== "undefined") {
    let str = String(val).trim();
    if (str.startsWith("#")) {
      str = str.substring(1);
    }
    if (str.startsWith("+")) return str;
    if (/^\d{9,15}$/.test(str)) return `+${str}`;
    if (str.startsWith("BK-") || str.startsWith("CT-") || str.startsWith("SR-") || str.startsWith("CON-")) {
      return str;
    }
    if (str.length >= 20 && /^[0-9a-fA-F-]+$/.test(str)) {
      return `BK-${str.slice(0, 6).toUpperCase()}`;
    }
    return str;
  }

  return "—";
};

const formatSubmittedBy = (row: Complaint) => {
  return (
    row.submitted_by ??
    row.created_by?.full_name ??
    row.created_by?.name ??
    row.spoc_user?.full_name ??
    row.user?.full_name ??
    "—"
  );
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccessModalOpen, setCancelSuccessModalOpen] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    complaintsService.list({
      page,
      status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
      search: search.trim() || undefined,
      start_date: dateFilter?.startDate,
      end_date: dateFilter?.endDate,
    })
      .then((res) => {
        if (typeof window !== "undefined" && res.data && res.data.length > 0) {
          console.log("[DEBUG Complaints API Data]:", res.data);
        }
        setComplaints(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter, dateFilter, search]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = search.toLowerCase().trim();
      const formattedId = formatComplaintId(item.complaint_number).toLowerCase();
      const bookingContract = formatBookingOrContract(item).toLowerCase();
      const submittedBy = formatSubmittedBy(item).toLowerCase();
      const matchSearch =
        !q ||
        item.complaint_number?.toLowerCase().includes(q) ||
        formattedId.includes(q) ||
        bookingContract.includes(q) ||
        submittedBy.includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All" || item.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchDate = !dateFilter || isDateInRange(item.created_at, dateFilter.preset, dateFilter.startDate, dateFilter.endDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [complaints, search, statusFilter, dateFilter]);

  const resolvedCount = complaints.filter((c) => c.status?.toLowerCase() === "resolved").length;
  const pendingCount = complaints.filter((c) => ["open", "pending", "in review"].includes(c.status?.toLowerCase())).length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedComplaint) return;
    setIsDeleting(true);
    try {
      await complaintsService.delete(selectedComplaint.id);
      setSelectedComplaint(null);
      setDeleteModalOpen(false);
      setSuccessModalOpen(true);
      fetchComplaints();
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch {
      // Error handling
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedComplaint) return;
    setIsCancelling(true);
    try {
      await complaintsService.cancel(selectedComplaint.id);
      setSelectedComplaint(null);
      setCancelModalOpen(false);
      setCancelSuccessModalOpen(true);
      fetchComplaints();
      setTimeout(() => setCancelSuccessModalOpen(false), 2000);
    } catch {
      // Error handling
    } finally {
      setIsCancelling(false);
    }
  };

  const isComplaintCancellable = (c: Complaint | null) => {
    if (!c) return false;
    const s = c.status?.toLowerCase();
    return s !== "cancelled" && s !== "resolved";
  };

  const tableColumns = useMemo<ColumnDef<Complaint>[]>(() => [
    {
      header: "COMPLAINT ID",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{formatComplaintId(row.complaint_number)}</span>,
    },
    {
      header: "CONTACT / BOOKING REF",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatBookingOrContract(row)}</span>,
    },
    {
      header: "DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.created_at)}</span>,
    },
    {
      header: "SUBJECT",
      cell: (row) => <span className="font-semibold text-black text-fs-12">{row.subject}</span>,
    },
    {
      header: "SUBMITTED BY",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatSubmittedBy(row)}</span>,
    },
    {
      header: "STATUS",
      className: "text-left",
      cell: (row) => (
        <StatusBadge status={row.status} />
      ),
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
      {/* Top Header Card matching Service Requests Page */}
      <div className="bg-white rounded-full p-2 pl-6 pr-2.5 flex items-center justify-between border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h1 className="text-fs-20 lg:text-fs-22 font-bold font-poppins text-text-primary">Complaints Management</h1>
        <Link
          href="/complaints/create"
          className="flex items-center gap-1.5 px-7 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white text-fs-12 font-medium transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New Complaint
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: 3 Stats Cards */}
        <div className="bg-white p-3 lg:p-4 rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full lg:w-[280px] shrink-0 h-fit">
          <div className="flex flex-col gap-3">
            {/* Card 1: Total Complaints */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#E2F8FA] border border-[#CDEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Total<br />Complaints</span>
                <div className="w-8 h-8 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : total}</span>
              </div>
            </div>

            {/* Card 2: Resolved Complaints */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#FEF9E2] border border-[#F5ECC4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Resolved<br />Complaints</span>
                <div className="w-8 h-8 rounded-full bg-[#B2B042] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : resolvedCount}</span>
              </div>
            </div>

            {/* Card 3: Pending Complaints */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] bg-[#E7F9E4] border border-[#D5F0D0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">Pending<br />Complaints</span>
                <div className="w-8 h-8 rounded-full bg-[#62C25D] text-white flex items-center justify-center shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-end mt-3">
                <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : pendingCount}</span>
              </div>
            </div>
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

      {/* Complaint Details Modal matching Figma View 2 */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 animate-in fade-in duration-200"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white rounded-[32px] p-6 sm:p-8 max-w-[580px] w-full relative shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: ID + Compact Status Badge + Close Button */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[19px] sm:text-[21px] font-bold text-gray-900 font-poppins">
                    {formatComplaintId(selectedComplaint.complaint_number)}
                  </h2>
                  {renderSmallStatusBadge(selectedComplaint.status)}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  {formatDateWithTime(selectedComplaint.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subject Section */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                SUBJECT
              </span>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900">
                {selectedComplaint.subject}
              </h3>
            </div>

            {/* Complaint Message Card */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                COMPLAINT MESSAGE
              </span>
              <div className="bg-[#EAF8FA] rounded-2xl p-5 border-l-4 border-[#005C66] text-gray-700 text-[13px] leading-relaxed">
                “{selectedComplaint.description}”
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              {isComplaintCancellable(selectedComplaint) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="h-[42px] sm:h-[44px] px-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-[12px] sm:text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Complaint"}
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-[42px] sm:h-[44px] px-7 rounded-full border border-[#D9383A] text-[#D9383A] hover:bg-red-50 text-[12px] sm:text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center"
              >
                {isDeleting ? "Deleting..." : "Delete Complaint"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="max-w-[460px]" className="text-center p-8 lg:p-10">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <SuccessFlowerBadge />
          </div>
          <h3 className="text-fs-20 lg:text-fs-22 font-bold font-poppins text-text-primary mb-3 leading-tight">
            Are you sure you want to delete this complaint?
          </h3>
          <p className="text-fs-13 lg:text-fs-14 text-[#64748B] mb-8 max-w-sm leading-relaxed mx-auto font-normal">
            This action cannot be undone. Once deleted, it will be removed permanently.
          </p>
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium bg-[#005C66] text-white hover:bg-[#004b54] rounded-full shadow-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium rounded-full border border-[#D9383A] text-[#D9383A] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} maxWidth="max-w-[400px]" className="text-center p-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-lg font-bold font-poppins text-text-primary">
            Complaint Deleted Successfully
          </h3>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} maxWidth="max-w-[460px]" className="text-center p-8 lg:p-10">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <SuccessFlowerBadge />
          </div>
          <h3 className="text-fs-20 lg:text-fs-22 font-bold font-poppins text-text-primary mb-3 leading-tight">
            Are you sure you want to cancel this complaint?
          </h3>
          <p className="text-fs-13 lg:text-fs-14 text-[#64748B] mb-8 max-w-sm leading-relaxed mx-auto font-normal">
            This will mark the complaint as cancelled. You can still delete it afterwards if needed.
          </p>
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium bg-[#005C66] text-white hover:bg-[#004b54] rounded-full shadow-sm transition-colors cursor-pointer"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Success Modal */}
      <Modal isOpen={cancelSuccessModalOpen} onClose={() => setCancelSuccessModalOpen(false)} maxWidth="max-w-[400px]" className="text-center p-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-lg font-bold font-poppins text-text-primary">
            Complaint Cancelled Successfully
          </h3>
        </div>
      </Modal>
    </div>
  );
}
