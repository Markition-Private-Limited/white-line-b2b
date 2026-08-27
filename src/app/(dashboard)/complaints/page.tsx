"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

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
  { id: "#CP-1024", bookingRef: "#BK-7721", date: "Feb 07, 2023", subject: "Delayed pickup in London", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 24, 2023 - 14:30", message: "The driver was extremely unprofessional during the trip. He took a much longer route than suggested by the GPS, which caused me to be late for my meeting. When I pointed this out, he was dismissive and continued to drive slowly. This is not the level of service I expect from an executive transport provider." },
  { id: "#CP-1025", bookingRef: "+966 50 123 4567", date: "Feb 07, 2023", subject: "Unprofessional behavior", submittedBy: "James Wilson", status: "in_review", reportedTime: "Oct 24, 2023 - 11:15", message: "Driver was talking loudly on the phone throughout the journey without asking permission." },
  { id: "#CP-1026", bookingRef: "#BK-7721", date: "Feb 07, 2023", subject: "Vehicle cleanliness issue", submittedBy: "James Wilson", status: "pending", reportedTime: "Oct 23, 2023 - 09:45", message: "The interior of the vehicle had not been cleaned from the previous ride." },
  { id: "#CP-1027", bookingRef: "#BK-7721", date: "Feb 07, 2023", subject: "Incorrect billing amount", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 22, 2023 - 16:20", message: "Extra waiting time was charged even though the flight landed on time." },
  { id: "#CP-1028", bookingRef: "+966 50 123 4567", date: "Feb 07, 2023", subject: "Delayed pickup in London", submittedBy: "James Wilson", status: "pending", reportedTime: "Oct 21, 2023 - 18:00", message: "Chauffeur arrived 25 minutes after the requested pickup time." },
  { id: "#CP-1029", bookingRef: "#BK-7721", date: "Feb 07, 2023", subject: "Vehicle cleanliness issue", submittedBy: "James Wilson", status: "resolved", reportedTime: "Oct 20, 2023 - 12:10", message: "Issue was inspected and credited back to corporate balance." },
];

export default function ComplaintsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  const filteredComplaints = mockComplaints.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-900">Complaints Management</h1>
        </div>
        <Link href="/complaints/create">
          <Button className="bg-[#005C66] text-white hover:bg-[#004b54] text-xs font-semibold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            Create New Complaint
          </Button>
        </Link>
      </div>

      {/* Main Layout: Left Stats + Right Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 3 Vertical Stats Cards */}
        <div className="flex flex-col gap-4">
          {/* Stat 1: Total Complaints */}
          <div className="bg-[#E6F8FA] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-cyan-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Total<br />Complaints
              </span>
              <div className="w-7 h-7 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-sm">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">154</span>
            </div>
          </div>

          {/* Stat 2: Resolved Complaints */}
          <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Resolved<br />Complaints
              </span>
              <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <span className="text-2xl font-bold font-poppins text-gray-900 leading-none">98</span>
            </div>
          </div>

          {/* Stat 3: Pending Complaints */}
          <div className="bg-[#EAF8E6] rounded-[24px] p-5 flex flex-col justify-between min-h-[140px] border border-green-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                Pending<br />Complaints
              </span>
              <div className="w-7 h-7 rounded-full bg-[#12A150] text-white flex items-center justify-center shadow-sm">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
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
                  placeholder="Search complaints..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-50/80 border border-gray-200 rounded-full pl-4 pr-8 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#005C66] cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="resolved">Status: Resolved</option>
                    <option value="in_review">Status: In Review</option>
                    <option value="pending">Status: Pending</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

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
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#005C66] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4 rounded-tl-xl">COMPLAINT ID</th>
                    <th className="py-3 px-4">BOOKING REF / CONTRACT</th>
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">SUBJECT</th>
                    <th className="py-3 px-4">SUBMITTED BY</th>
                    <th className="py-3 px-4 rounded-tr-xl text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredComplaints.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedComplaint(row)}
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.id}</td>
                      <td className="py-3 px-4 text-gray-500">{row.bookingRef}</td>
                      <td className="py-3 px-4 text-gray-500">{row.date}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{row.subject}</td>
                      <td className="py-3 px-4 text-gray-600">{row.submittedBy}</td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400 mt-4">
            <span>Showing 5 of 1,284 results</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
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
              <h3 className="text-lg font-bold font-poppins text-gray-900">{selectedComplaint.id}</h3>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <p className="text-xs text-gray-400 -mt-4">
              Reported on {selectedComplaint.reportedTime}
            </p>

            {/* Subject */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                SUBJECT
              </span>
              <h4 className="text-sm font-bold text-gray-900 font-poppins">{selectedComplaint.subject}</h4>
            </div>

            {/* Message Card */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                COMPLAINT MESSAGE
              </span>
              <div className="p-4 bg-gray-50/80 rounded-2xl border-l-4 border-[#00B4D8] text-xs text-gray-700 leading-relaxed italic">
                &ldquo;{selectedComplaint.message}&rdquo;
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setSelectedComplaint(null)}
                className="py-2 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50"
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
