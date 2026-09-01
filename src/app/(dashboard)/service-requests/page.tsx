"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Car,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DataTable, ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar, FilterDef } from "@/components/layout/PageToolbar";
import { DatePickerValue, isDateInRange } from "@/utils/dateFilterUtils";

interface ServiceRequestItem {
  id: string;
  requestDate: string;
  serviceName: string;
  requestedBy: string;
  status: "active" | "pending";
}

const mockRequests: ServiceRequestItem[] = [
  { id: "#SR-84920", requestDate: "2023-06-22", serviceName: "Airport Transfer", requestedBy: "Julianne Moore", status: "active" },
  { id: "#SR-84921", requestDate: "2023-06-22", serviceName: "Hourly Charter", requestedBy: "David Sterling", status: "pending" },
  { id: "#SR-84922", requestDate: "2023-06-22", serviceName: "City Concierge", requestedBy: "Marcus Vane", status: "pending" },
  { id: "#SR-84923", requestDate: "2023-06-22", serviceName: "Corporate Gala", requestedBy: "Sophia Reynolds", status: "active" },
  { id: "#SR-84924", requestDate: "2023-06-22", serviceName: "Inter-State Transfer", requestedBy: "Enterprise HQ", status: "pending" },
  { id: "#SR-84925", requestDate: "2023-06-22", serviceName: "Airport Transfer", requestedBy: "Julianne Moore", status: "active" },
  { id: "#SR-84926", requestDate: "2023-06-22", serviceName: "Hourly Charter", requestedBy: "David Sterling", status: "pending" },
  { id: "#SR-84927", requestDate: "2023-06-22", serviceName: "City Concierge", requestedBy: "Marcus Vane", status: "pending" },
];

export default function ServiceRequestsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DatePickerValue | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.serviceName.toLowerCase().includes(q) ||
        item.requestedBy.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = !dateFilter || isDateInRange(
        item.requestDate,
        dateFilter.preset,
        dateFilter.startDate,
        dateFilter.endDate
      );

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateFilter]);

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRequests.slice(start, start + limit);
  }, [filteredRequests, page, limit]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / limit));

  const tableColumns = useMemo<ColumnDef<ServiceRequestItem>[]>(() => [
    {
      header: "REQUEST ID",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.id}</span>,
    },
    {
      header: "REQUEST DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.requestDate}</span>,
    },
    {
      header: "SERVICE NAME",
      cell: (row) => <span className="font-medium text-text-primary text-fs-12">{row.serviceName}</span>,
    },
    {
      header: "REQUESTED BY",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.requestedBy}</span>,
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
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-bold text-text-primary">Service Requests</h1>
        </div>
        <Link href="/service-requests/create">
          <Button className="bg-primary hover:bg-primary-dark text-white text-fs-12 font-medium py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Create New Request
          </Button>
        </Link>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-3">
          {/* Stat 1: Total Service Request */}
          <div className="card-base p-5 flex flex-col justify-between min-h-[135px] bg-[#E6F8FA] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
                Total<br />Service<br />Request
              </span>
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <Car className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                  <Image src="/driver.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                  <Image src="/Avatar.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
              <span className="text-fs-22 font-semibold font-poppins text-text-primary leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Active Service Request */}
          <div className="card-base p-5 flex flex-col justify-between min-h-[135px] bg-[#EAF8E6] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
                Active<br />Service<br />Request
              </span>
              <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                  <Image src="/driver.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                  <Image src="/Avatar.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
              <span className="text-fs-22 font-semibold font-poppins text-text-primary leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Pending Service Request */}
          <div className="card-base p-5 flex flex-col justify-between min-h-[135px] bg-[#EAF8E6] border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-fs-12 font-semibold text-gray-800 leading-tight">
                Pending<br />Service<br />Request
              </span>
              <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                  <Image src="/driver.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                  <Image src="/Avatar.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
              <span className="text-fs-22 font-semibold font-poppins text-text-primary leading-none">154</span>
            </div>
          </div>
        </div>

        {/* Right Column: Toolbar + DataTable Container */}
        <div className="lg:col-span-3 flex flex-col gap-2 flex-1">
          <PageToolbar
            searchPlaceholder="Search by service request ID, name, or requester"
            searchValue={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filters={toolbarFilters}
          />

          <DataTable
            data={paginatedRequests}
            columns={tableColumns}
            onRowClick={(row) => router.push(`/service-requests/${row.id.replace("#", "")}`)}
            emptyState={
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="text-fs-14 font-medium text-gray-500">No Request Found</span>
                <Link href="/service-requests/create">
                  <Button
                    variant="outline"
                    className="rounded-full py-2.5 px-6 text-fs-12 font-semibold text-primary border-primary/40 hover:bg-primary/5 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Request
                  </Button>
                </Link>
              </div>
            }
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: filteredRequests.length,
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
    </div>
  );
}
