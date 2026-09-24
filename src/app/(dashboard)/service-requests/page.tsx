"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle2, Clock, Plus } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, type FilterDef } from "@/components/layout/PageToolbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { type DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";
import serviceRequestsService, { type ServiceRequest } from "@/services/serviceRequests.service";

const LIMIT = 10;

export default function ServiceRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);

  useEffect(() => {
    setLoading(true);
    serviceRequestsService.list({
      page,
      status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
      search: search.trim() || undefined,
      start_date: dateFilter?.startDate,
      end_date: dateFilter?.endDate,
    })
      .then((res) => {
        setRequests(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter, dateFilter, search]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.request_number?.toLowerCase().includes(q) ||
        r.vehicle_class?.name?.toLowerCase().includes(q) ||
        r.requested_by?.toLowerCase().includes(q);
      const s = r.status?.toLowerCase();
      const matchStatus =
        statusFilter === "All" ||
        s === statusFilter.toLowerCase() ||
        (statusFilter.toLowerCase() === "approved" && (s === "approved" || s === "active" || s === "assigned"));
      const matchDate =
        !dateFilter ||
        isDateInRange(r.request_date, dateFilter.preset, dateFilter.startDate, dateFilter.endDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [requests, search, statusFilter, dateFilter]);

  const activeCount = requests.filter((r) => {
    const s = r.status?.toLowerCase();
    return s === "active" || s === "approved" || s === "assigned";
  }).length;
  const pendingCount = requests.filter((r) => r.status?.toLowerCase() === "pending").length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const columns = useMemo<ColumnDef<ServiceRequest>[]>(() => [
    {
      header: "REQUEST ID",
      cell: (r) => (
        <span className="font-medium text-text-primary text-fs-12">
          {r.request_number ? (r.request_number.startsWith("#") ? r.request_number : `#${r.request_number}`) : "—"}
        </span>
      ),
    },
    {
      header: "REQUEST DATE",
      cell: (r) => (
        <span className="text-text-secondary text-fs-12">
          {r.request_date
            ? new Date(r.request_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "—"}
        </span>
      ),
    },
    {
      header: "VEHICLE CATEGORY",
      cell: (r) => (
        <span className="font-medium text-text-primary text-fs-12">
          {r.vehicle_class?.name ?? "Corporate Mobility"}
        </span>
      ),
    },
    {
      header: "REQUESTED BY",
      cell: (r) => (
        <span className="text-text-secondary text-fs-12">
          {r.requested_by ?? "David Sterling"}
        </span>
      ),
    },
    {
      header: "STATUS",
      className: "text-left",
      cell: (r) => (
        <StatusBadge status={r.status} />
      ),
    },
  ], []);

  const toolbarFilters: FilterDef[] = useMemo(() => [
    {
      defaultValue: statusFilter === "All" ? "Status: All" : `Status: ${statusFilter}`,
      options: ["All", "Pending", "Approved", "Cancelled"],
      onSelect: (val) => { setStatusFilter(val); setPage(1); },
    },
    {
      type: "date",
      defaultValue: dateFilter?.label || "Date",
      onSelectDate: (range) => { setDateFilter(range); setPage(1); },
    },
  ], [statusFilter, dateFilter]);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-full p-2 pl-4 sm:pl-6 pr-2.5 flex items-center justify-between border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h1 className="text-fs-16 sm:text-fs-20 lg:text-fs-22 font-bold font-poppins text-text-primary truncate mr-2">
          <span className="sm:hidden">Services</span>
          <span className="hidden sm:inline">Service Requests</span>
        </h1>
        <Link
          href="/service-requests/create"
          className="flex items-center gap-1.5 px-3.5 sm:px-7 py-2 sm:py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-fs-12 font-medium transition-all duration-200 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create<span className="hidden sm:inline"> New Request</span></span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Stats Cards */}
        <div className="bg-white p-3 lg:p-4 rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full lg:w-[280px] shrink-0 h-fit">
          <div className="flex flex-col gap-3">
            {[
              { 
                label: "Total", label2: "Service Request", value: total, icon: FileText,
                cardBg: "bg-[#E2F8FA] border-[#CDEEF2]", 
                iconBg: "bg-[#005C66] text-white",
                avatarCount: 2,
              },
              { 
                label: "Active", label2: "Service Request", value: activeCount, icon: CheckCircle2,
                cardBg: "bg-[#FEF9E2] border-[#F5ECC4]", 
                iconBg: "bg-[#B2B042] text-white",
                avatarCount: 2,
              },
              { 
                label: "Pending", label2: "Service Request", value: pendingCount, icon: Clock,
                cardBg: "bg-[#E7F9E4] border-[#D5F0D0]", 
                iconBg: "bg-[#62C25D] text-white",
                avatarCount: 1,
              },
            ].map((card) => (
              <div key={card.label} className={`rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] border shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${card.cardBg}`}>
                <div className="flex items-start justify-between">
                  <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug font-poppins">{card.label}<br />{card.label2}</span>
                  <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center shadow-xs`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-3">
                  {/* Image Avatars Stack matching Dashboard */}
                  <div className="flex -space-x-2 overflow-hidden items-center">
                    {card.avatarCount >= 1 && (
                      <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200 shrink-0">
                        <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
                      </div>
                    )}
                    {card.avatarCount >= 2 && (
                      <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-300 shrink-0">
                        <Image src="/Avatar.png" alt="Passenger" width={24} height={24} className="object-cover" />
                      </div>
                    )}
                    {card.avatarCount >= 3 && (
                      <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-400 shrink-0">
                        <Image src="/driver.png" alt="Driver" width={24} height={24} className="object-cover" />
                      </div>
                    )}
                  </div>
                  <span className="text-[34px] lg:text-[38px] font-semibold font-poppins text-gray-900 leading-none">{loading ? "—" : card.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Table area */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Toolbar */}
          <PageToolbar
            searchPlaceholder="Search by service request ID"
            searchValue={search}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            filters={toolbarFilters}
          />

          {/* Table */}
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            onRowClick={(row) => router.push(`/service-requests/${row.id}`)}
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: total,
              itemsPerPage: LIMIT,
              onPageChange: setPage,
            }}
            emptyState={
              <div className="flex flex-col items-center justify-center gap-3.5 py-16 text-gray-400">
                <p className="text-fs-13 font-medium text-gray-500 font-poppins">No Request Found</p>
                <Link
                  href="/service-requests/create"
                  className="flex items-center gap-1.5 px-8 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white text-fs-12 font-medium transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Request
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

