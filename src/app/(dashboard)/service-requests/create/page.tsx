"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CounterInput } from "@/components/ui/CounterInput";
import { SuccessModal } from "@/components/ui/SuccessModal";

export default function CreateServiceRequestPage() {
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [vehicleCategory, setVehicleCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/service-requests"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-900">Create Service Request</h1>
          <p className="text-xs text-gray-400">Request dedicated vehicles and chauffeurs for corporate mobility</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">START DATE</label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">END DATE</label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Counter Inputs for Vehicles and Drivers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <CounterInput
              label="NUMBER OF VEHICLES"
              value={vehiclesCount}
              onChange={setVehiclesCount}
              min={0}
              max={100}
            />

            <CounterInput
              label="NUMBER OF DRIVERS"
              value={driversCount}
              onChange={setDriversCount}
              min={0}
              max={100}
            />
          </div>

          {/* Row 3: Vehicle Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">VEHICLE CATEGORY</label>
            <div className="relative flex items-center">
              <select
                required
                value={vehicleCategory}
                onChange={(e) => setVehicleCategory(e.target.value)}
                className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white cursor-pointer"
              >
                <option value="">Select vehicle category</option>
                <option value="Premium Executive SUV">Premium Executive SUV</option>
                <option value="Business Class Sedan">Business Class Sedan</option>
                <option value="First Class Luxury">First Class Luxury</option>
                <option value="Executive Chauffeur Van">Executive Chauffeur Van</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Row 4: Notes (Optional) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NOTES (OPTIONAL)</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements or instructions..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/service-requests")}
              className="py-2.5 px-6 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="py-2.5 px-6 text-xs font-semibold bg-[#005C66] text-white hover:bg-[#004b54]"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => router.push("/service-requests")}
        title="Request Submitted Successfully!"
        message="Your service request has been received. Our team will review it and get back to you shortly."
        actionText="View Requests"
        onAction={() => router.push("/service-requests")}
      />
    </div>
  );
}
