"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Car, Calendar, Users, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import serviceRequestsService, { type ServiceRequest } from "@/services/serviceRequests.service";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    serviceRequestsService.get(id)
      .then(setRequest)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmCancel = async () => {
    if (!request) return;
    setCancelling(true);
    try {
      const updated = await serviceRequestsService.cancel(request.id);
      setRequest(updated);
      setCancelModalOpen(false);
    } catch {
      // Keep modal open on error
    } finally {
      setCancelling(false);
    }
  };

  const requestId = request?.request_number ? `#${request.request_number}` : `#SR-${id}`;
  const status = request?.status ?? "pending";

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/service-requests" className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-text-secondary hover:text-text-primary shadow-xs transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="h1 font-bold text-text-primary">Service Detail: {requestId}</h1>
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
            <Image src="/vehicle.png" alt="Vehicle" width={180} height={90} className="object-contain" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
          </div>
          <p className="text-fs-13 font-bold text-center text-text-primary mt-1 font-poppins">
            {request?.vehicle_class?.name ?? "Corporate Service"}
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
              <span className="text-fs-13 font-semibold text-text-primary">{formatDate(request?.request_date)}</span>
            </div>
            <div>
              <span className="text-fs-10 text-gray-400 block uppercase font-semibold">Request By:</span>
              <span className="text-fs-13 font-semibold text-text-primary">{request?.requested_by ?? "Admin"}</span>
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
              <span className="text-fs-12 font-bold text-text-primary">{formatDate(request?.start_date)}</span>
            </div>
            <div className="text-center text-gray-400 text-fs-10">↓</div>
            <div className="bg-input-bg p-2.5 rounded-xl">
              <span className="text-fs-9 text-gray-400 block uppercase font-semibold">End Date</span>
              <span className="text-fs-12 font-bold text-text-primary">{formatDate(request?.end_date)}</span>
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
              <span className="text-fs-17 font-bold text-text-primary font-poppins">{request?.num_drivers_required ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fs-12 text-text-secondary">Vehicles Required</span>
              <span className="text-fs-17 font-bold text-text-primary font-poppins">{request?.num_vehicles_required ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      {request?.special_instructions && (
        <div className="card-base p-6">
          <div className="flex items-center gap-2 text-fs-10 font-semibold text-gray-text uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Notes</span>
          </div>
          <p className="body-2 text-text-secondary leading-relaxed max-w-4xl">{request.special_instructions}</p>
        </div>
      )}

      {/* Cancel Action */}
      {status !== "cancelled" && (
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={() => setCancelModalOpen(true)}
            className="px-6 py-2 rounded-full text-xs font-semibold border border-[#EA5B5B] text-[#EA5B5B] bg-white hover:bg-red-50 shadow-xs transition-colors cursor-pointer"
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} maxWidth="max-w-md" className="text-center p-8">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#12A150] text-white flex items-center justify-center mb-4 shadow-md shadow-[#12A150]/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-2">
            Are you sure you want to cancel this request?
          </h3>
          <p className="text-fs-12 text-text-secondary mb-6 max-w-xs leading-relaxed">
            This action cannot be undone. Once cancelled, you will need to create a new service request.
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button onClick={() => setCancelModalOpen(false)} className="flex-1 py-2.5 text-xs font-semibold rounded-full bg-[#005C66] text-white hover:bg-[#004b54] cursor-pointer">
              Keep Request
            </Button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="flex-1 py-2.5 text-xs font-semibold rounded-full border border-[#EA5B5B] text-[#EA5B5B] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
