"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Car, Calendar, Users, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";

export default function ServiceDetailPage() {
  const params = useParams();
  const requestId = params.id ? `#SR-${params.id}` : "#SR-1234";

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "cancelled">("pending");

  const handleConfirmCancel = () => {
    setStatus("cancelled");
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/service-requests"
            className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-text-secondary hover:text-text-primary shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="h1 font-bold text-text-primary">
              Service Detail: {requestId}
            </h1>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vehicle Category */}
        <div className="card-base p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
            <Car className="w-4 h-4 text-primary" />
            <span>Vehicle Category</span>
          </div>

          <div className="relative w-full h-28 my-auto flex items-center justify-center">
            <Image
              src="/vehicle.png"
              alt="Premium Executive SUV"
              width={180}
              height={90}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <p className="text-fs-13 font-bold text-center text-text-primary mt-1 font-poppins">
            Premium Executive SUV
          </p>
        </div>

        {/* Card 2: Details */}
        <div className="card-base p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Details</span>
          </div>

          <div className="space-y-4 my-auto">
            <div>
              <span className="text-fs-10 text-gray-400 block uppercase font-semibold">Request Date:</span>
              <span className="text-fs-13 font-semibold text-text-primary">June 22, 2026</span>
            </div>
            <div>
              <span className="text-fs-10 text-gray-400 block uppercase font-semibold">Request By:</span>
              <span className="text-fs-13 font-semibold text-text-primary">Admin</span>
            </div>
          </div>
        </div>

        {/* Card 3: Service Duration */}
        <div className="card-base p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Service Duration</span>
          </div>

          <div className="space-y-2.5 my-auto">
            <div className="bg-input-bg p-2.5 rounded-xl">
              <span className="text-fs-9 text-gray-400 block uppercase font-semibold">Start Date</span>
              <span className="text-fs-12 font-bold text-text-primary">Nov 01, 2023</span>
            </div>
            <div className="text-center text-gray-400 text-fs-10">↓</div>
            <div className="bg-input-bg p-2.5 rounded-xl">
              <span className="text-fs-9 text-gray-400 block uppercase font-semibold">End Date</span>
              <span className="text-fs-12 font-bold text-text-primary">Jan 31, 2024</span>
            </div>
          </div>
        </div>

        {/* Card 4: Required Details */}
        <div className="card-base p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Required Details</span>
          </div>

          <div className="space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-fs-12 text-text-secondary">Drivers Required</span>
              <span className="text-fs-17 font-bold text-text-primary font-poppins">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fs-12 text-text-secondary">Vehicles Required</span>
              <span className="text-fs-17 font-bold text-text-primary font-poppins">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      <div className="card-base p-6">
        <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <span>Notes</span>
        </div>
        <p className="body-2 text-text-secondary leading-relaxed max-w-4xl">
          To maintain our commitment to delivering premium, high-quality service, we have implemented rigorous operational standards: all assigned drivers must be fluent in both English and Mandarin to ensure effective communication and a premium passenger experience; every vehicle in the fleet is strictly required to be less than two years old to uphold safety and reliability; and our team must conduct comprehensive daily maintenance checks directly at the client&apos;s site to ensure optimal vehicle performance at all times.
        </p>
      </div>

      {/* Action Button */}
      {status !== "cancelled" && (
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="danger"
            onClick={() => setCancelModalOpen(true)}
            className="py-2.5 px-6 text-fs-12 font-medium rounded-full"
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
          <div className="w-14 h-14 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-2">
            Are you sure you want to cancel this request?
          </h3>

          <p className="text-fs-12 text-text-secondary mb-6 max-w-xs leading-relaxed">
            This action cannot be undone. Once cancelled, you will need to create a new service request.
          </p>

          <div className="flex items-center gap-3 w-full">
            <Button
              onClick={() => setCancelModalOpen(false)}
              className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark"
            >
              Keep Request
            </Button>
            <Button
              variant="outline"
              onClick={handleConfirmCancel}
              className="flex-1 py-2.5 text-fs-12 font-medium text-error border-error/20 hover:bg-error/5"
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
