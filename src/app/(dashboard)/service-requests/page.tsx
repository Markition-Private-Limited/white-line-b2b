"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Car,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface ServiceRequestItem {
  id: string;
  requestDate: string;
  serviceName: string;
  requestedBy: string;
  status: "active" | "pending";
}

const mockRequests: ServiceRequestItem[] = [
  { id: "#SR-84920", requestDate: "June 22, 2023", serviceName: "Airport Transfer", requestedBy: "Julianne Moore", status: "active" },
  { id: "#SR-84921", requestDate: "June 22, 2023", serviceName: "Hourly Charter", requestedBy: "David Sterling", status: "pending" },
  { id: "#SR-84922", requestDate: "June 22, 2023", serviceName: "City Concierge", requestedBy: "Marcus Vane", status: "pending" },
  { id: "#SR-84923", requestDate: "June 22, 2023", serviceName: "Corporate Gala", requestedBy: "Sophia Reynolds", status: "active" },
  { id: "#SR-84924", requestDate: "June 22, 2023", serviceName: "Inter-State Transfer", requestedBy: "Enterprise HQ", status: "pending" },
  { id: "#SR-84925", requestDate: "June 22, 2023", serviceName: "Airport Transfer", requestedBy: "Julianne Moore", status: "active" },
  { id: "#SR-84926", requestDate: "June 22, 2023", serviceName: "Hourly Charter", requestedBy: "David Sterling", status: "pending" },
  { id: "#SR-84927", requestDate: "June 22, 2023", serviceName: "City Concierge", requestedBy: "Marcus Vane", status: "pending" },
];

export default function ServiceRequestsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = mockRequests.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      item.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-900">Service Requests</h1>
        </div>
        <Link href="/service-requests/create">
          <Button className="bg-[#005C66] text-white hover:bg-[#004b54] text-xs font-semibold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            Create New Request
          </Button>
        </Link>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-4">
          {/* Stat 1: Total Service Request */}
          <div className="bg-[#E6F8FA] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-cyan-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Total<br />Service<br />Request
              </span>
              <div className="w-7 h-7 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-sm">
                <Car className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-200">
                  <Image src="/driver.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-gray-300">
                  <Image src="/person.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Active Service Request */}
          <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
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
                  <Image src="/person.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Pending Service Request */}
          <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
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
                  <Image src="/person.png" alt="Avatar" width={20} height={20} className="object-cover" />
                </div>
              </div>
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
                  placeholder="Search by service request ID"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
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

                {/* Date Filter Button */}
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
            {filteredRequests.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#005C66] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4 rounded-tl-xl">REQUEST ID</th>
                      <th className="py-3 px-4">REQUEST DATE</th>
                      <th className="py-3 px-4">SERVICE NAME</th>
                      <th className="py-3 px-4">REQUESTED BY</th>
                      <th className="py-3 px-4 rounded-tr-xl text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredRequests.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => router.push(`/service-requests/${row.id.replace("#", "")}`)}
                        className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-gray-900">{row.id}</td>
                        <td className="py-3 px-4 text-gray-500">{row.requestDate}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{row.serviceName}</td>
                        <td className="py-3 px-4 text-gray-600">{row.requestedBy}</td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">No Request Found</h4>
                <p className="text-xs text-gray-400 mb-4">You haven&apos;t created any service requests yet.</p>
                <Link href="/service-requests/create">
                  <Button className="text-xs font-semibold py-2 px-4 rounded-full bg-[#005C66] text-white">
                    + Create New Request
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400 mt-4">
            <span>Showing 5 of 1,284 results</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
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
    </div>
  );
}
