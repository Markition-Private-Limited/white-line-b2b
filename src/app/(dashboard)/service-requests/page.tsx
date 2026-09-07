"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import { PageToolbar } from "@/components/layout/PageToolbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

  useEffect(() => {
    setLoading(true);
    serviceRequestsService.list(page)
      .then((res) => {
        setRequests(res.data ?? []);
        setTotal(res.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = requests.filter((r) => {
    const matchSearch =
      !search ||
      r.request_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle_class?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || r.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const activeCount = requests.filter((r) => r.status === "active" || r.status === "assigned").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const totalPages = Math.ceil(total / LIMIT);

  const columns: ColumnDef<ServiceRequest>[] = [
    { header: "REQUEST ID", accessorKey: "request_number" },
    {
      header: "REQUEST DATE",
      cell: (r) => r.request_date ? new Date(r.request_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    },
    {
      header: "SERVICE NAME",
      cell: (r) => r.vehicle_class?.name ?? "Corporate Service",
    },
    {
      header: "REQUESTED BY",
      cell: (r) => r.requested_by ?? "Admin",
    },
    {
      header: "STATUS",
      cell: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Service Requests", value: total },
          { label: "Active Service Requests", value: activeCount },
          { label: "Pending Service Requests", value: pendingCount },
        ].map((card) => (
          <div key={card.label} className="card-base p-5 flex items-center justify-between">
            <span className="text-fs-12 font-semibold text-text-secondary">{card.label}</span>
            <span className="text-[28px] font-bold font-poppins text-text-primary">{loading ? "—" : card.value}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-bold text-text-primary">Service Requests</h1>
          <p className="body-2 text-gray-text">Manage corporate mobility service requests</p>
        </div>
        <Link
          href="/service-requests/create"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-fs-12 font-medium hover:bg-primary-dark shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Request
        </Link>
      </div>

      {/* Toolbar */}
      <PageToolbar
        searchPlaceholder="Search by ID or service..."
        searchValue={search}
        onSearch={setSearch}
        filters={[
          {
            defaultValue: statusFilter,
            options: ["All", "Pending", "Active", "Cancelled"],
            onSelect: setStatusFilter,
          },
        ]}
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
          <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
            <p className="text-fs-13 font-medium">No service requests found</p>
            <Link href="/service-requests/create" className="px-4 py-2 rounded-full bg-primary text-white text-fs-12 font-medium hover:bg-primary-dark">
              Create New Request
            </Link>
          </div>
        }
      />
    </div>
  );
}
