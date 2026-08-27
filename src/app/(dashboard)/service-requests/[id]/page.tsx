"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Car, Calendar, Users, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id ? `#SR-${params.id}` : "#SR-1234";

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "cancelled">("pending");

  const handleConfirmCancel = () => {
    setStatus("cancelled");
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/service-requests"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-poppins text-gray-900">
              Service Detail: {requestId}
            </h1>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Vehicle Category */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
            <Car className="w-4 h-4 text-[#005C66]" />
            <span>Vehicle Category</span>
          </div>

          <div className="relative w-full h-32 my-auto flex items-center justify-center">
            <Image
              src="/vehicle.png"
              alt="Premium Executive SUV"
              width={200}
              height={100}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <p className="text-sm font-bold text-center text-gray-900 mt-2 font-poppins">
            Premium Executive SUV
          </p>
        </div>

        {/* Card 2: Details */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4 text-[#005C66]" />
            <span>Details</span>
          </div>

          <div className="space-y-4 my-auto">
            <div>
              <span className="text-[11px] text-gray-400 block">Request Date:</span>
              <span className="text-xs font-bold text-gray-800">June 22, 2026</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block">Request By:</span>
              <span className="text-xs font-bold text-gray-800">Admin</span>
            </div>
          </div>
        </div>

        {/* Card 3: Service Duration */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
            <Calendar className="w-4 h-4 text-[#005C66]" />
            <span>Service Duration</span>
          </div>

          <div className="space-y-3 my-auto">
            <div className="bg-gray-50/80 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Start Date</span>
              <span className="text-xs font-bold text-gray-800">Nov 01, 2023</span>
            </div>
            <div className="text-center text-gray-400 text-xs">↓</div>
            <div className="bg-gray-50/80 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">End Date</span>
              <span className="text-xs font-bold text-gray-800">Jan 31, 2024</span>
            </div>
          </div>
        </div>

        {/* Card 4: Required Details */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
            <Users className="w-4 h-4 text-[#005C66]" />
            <span>Required Details</span>
          </div>

          <div className="space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <span className="text-xs text-gray-600">Drivers Required</span>
              <span className="text-base font-bold text-gray-900 font-poppins">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Vehicles Required</span>
              <span className="text-base font-bold text-gray-900 font-poppins">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
          <FileText className="w-4 h-4 text-[#005C66]" />
          <span>Notes</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
          To maintain our commitment to delivering premium, high-quality service, we have implemented rigorous operational standards: all assigned drivers must be fluent in both English and Mandarin to ensure effective communication and a premium passenger experience; every vehicle in the fleet is strictly required to be less than two years old to uphold safety and reliability; and our team must conduct comprehensive daily maintenance checks directly at the client&apos;s site to ensure optimal vehicle performance at all times.
        </p>
      </div>

      {/* Action Button */}
      {status !== "cancelled" && (
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="danger"
            onClick={() => setCancelModalOpen(true)}
            className="py-2.5 px-6 text-xs font-semibold rounded-full"
          >
            Cancel Request
          </Button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="max-w-md"
        className="text-center p-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#12A150] text-white flex items-center justify-center mb-5 shadow-md shadow-[#12A150]/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-lg font-bold font-poppins text-gray-900 mb-2">
            Are you sure you want to cancel this request?
          </h3>

          <p className="text-xs text-gray-500 mb-6 max-w-xs leading-relaxed">
            This action cannot be undone. Once cancelled, you will need to create a new service request.
          </p>

          <div className="flex items-center gap-3 w-full">
            <Button
              onClick={() => setCancelModalOpen(false)}
              className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white hover:bg-[#004b54]"
            >
              Keep Request
            </Button>
            <Button
              variant="outline"
              onClick={handleConfirmCancel}
              className="flex-1 py-2.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50"
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
