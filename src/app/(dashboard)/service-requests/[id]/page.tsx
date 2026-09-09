"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Car, Calendar, Users, FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { SuccessFlowerBadge } from "@/components/ui/SuccessModal";
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
      {/* Top Header - Plain text title on left, status badge on right (no white box, no back button) */}
      <div className="flex items-center justify-between">
        <h1 className="text-fs-22 font-semibold font-poppins text-text-primary">Service Detail: {requestId}</h1>
        <StatusBadge status={status} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vehicle Category */}
        <div className="card-base p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-12 font-semibold text-text-primary">
            <Car className="w-4 h-4 text-primary" />
            <span>Vehicle Category</span>
          </div>
          <div className="relative w-full h-24 my-auto flex items-center justify-center">
            <Image src="/vehicle.png" alt="Vehicle" width={180} height={90} className="object-contain" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
          </div>
          <p className="text-fs-13 font-bold text-center text-text-primary font-poppins">
            {request?.vehicle_class?.name ?? "Premium Executive SUV"}
          </p>
        </div>

        {/* Card 2: Details */}
        <div className="card-base p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-12 font-semibold text-text-primary">
            <FileText className="w-4 h-4 text-primary" />
            <span>Details</span>
          </div>
          <div className="space-y-4 my-auto">
            <div>
              <span className="text-fs-11 text-gray-400 block font-medium">Request Date:</span>
              <span className="text-fs-13 font-bold text-text-primary font-poppins">{formatDate(request?.request_date)}</span>
            </div>
            <div>
              <span className="text-fs-11 text-gray-400 block font-medium">Request By:</span>
              <span className="text-fs-13 font-bold text-text-primary font-poppins">{request?.requested_by ?? "Admin"}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Service Duration */}
        <div className="card-base p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-12 font-semibold text-text-primary">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Service Duration</span>
          </div>
          <div className="bg-input-bg rounded-2xl p-4 flex flex-col items-center justify-center text-center my-auto w-full">
            <div>
              <span className="text-fs-10 text-gray-400 block font-medium">Start Date</span>
              <span className="text-fs-13 font-bold text-text-primary font-poppins block">{formatDate(request?.start_date)}</span>
            </div>
            <div className="text-primary my-1 font-bold text-base leading-none">↓</div>
            <div>
              <span className="text-fs-10 text-gray-400 block font-medium">End Date</span>
              <span className="text-fs-13 font-bold text-text-primary font-poppins block">{formatDate(request?.end_date)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Required Details */}
        <div className="card-base p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 text-fs-12 font-semibold text-text-primary">
            <Users className="w-4 h-4 text-primary" />
            <span>Required Details</span>
          </div>
          <div className="space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-fs-12 text-text-secondary font-medium">Drivers Required</span>
              <span className="text-fs-17 font-bold text-text-primary font-poppins">{request?.num_drivers_required ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fs-12 text-text-secondary font-medium">Vehicles Required</span>
              <span className="text-fs-17 font-bold text-text-primary font-poppins">{request?.num_vehicles_required ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      <div className="card-base p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 text-fs-12 font-semibold text-text-primary mb-3">
          <FileText className="w-4 h-4 text-primary" />
          <span>Notes</span>
        </div>
        <p className="body-2 text-text-secondary leading-relaxed italic">
          {request?.special_instructions || "To maintain our commitment to delivering premium, high-quality service, we have implemented rigorous operational standards: all assigned drivers must be fluent in both English and Mandarin to ensure effective communication and a premium passenger experience, every vehicle in the fleet is strictly required to be less than two years old to uphold safety and reliability, and our team must conduct comprehensive daily maintenance checks directly at the client's site to ensure optimal vehicle performance at all times."}
        </p>
      </div>

      {/* Cancel Action */}
      {status !== "cancelled" && (
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={() => setCancelModalOpen(true)}
            className="px-8 py-2.5 rounded-full text-fs-12 font-medium border border-[#EA5B5B] text-[#EA5B5B] bg-white hover:bg-red-50 shadow-xs transition-colors cursor-pointer"
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} maxWidth="max-w-[460px]" className="text-center p-8 lg:p-10">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <SuccessFlowerBadge />
          </div>
          <h3 className="text-fs-20 lg:text-fs-22 font-bold font-poppins text-text-primary mb-3 leading-tight">
            Are you sure you want to cancel this request?
          </h3>
          <p className="text-fs-13 lg:text-fs-14 text-[#64748B] mb-8 max-w-sm leading-relaxed mx-auto font-normal">
            This action cannot be undone. Once cancelled, you will need to create a new service request.
          </p>
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium bg-[#005C66] text-white hover:bg-[#004b54] rounded-full shadow-sm transition-colors cursor-pointer"
            >
              Keep Request
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="py-2.5 px-7 text-fs-13 lg:text-fs-14 font-medium rounded-full border border-[#EA5B5B] text-[#EA5B5B] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
