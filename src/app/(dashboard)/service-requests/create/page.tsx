"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CounterInput } from "@/components/ui/CounterInput";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { FormDropdown } from "@/components/ui/FormDropdown";
import serviceRequestsService from "@/services/serviceRequests.service";
import vehicleClassesService, { type VehicleClass } from "@/services/vehicleClasses.service";

export default function CreateServiceRequestPage() {
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [notes, setNotes] = useState("");
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    vehicleClassesService.list()
      .then(setVehicleClasses)
      .catch(() => {});
  }, []);

  const classOptions = vehicleClasses.map((c) => c.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedClassId && vehicleClasses.length > 0) {
      setError("Please select a vehicle category.");
      return;
    }

    setIsSubmitting(true);
    try {
      await serviceRequestsService.create({
        start_date: startDate,
        end_date: endDate,
        num_drivers_required: driversCount,
        num_vehicles_required: vehiclesCount,
        vehicle_class_id: selectedClassId,
        special_instructions: notes || undefined,
      });
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassSelect = (name: string) => {
    const found = vehicleClasses.find((c) => c.name === name);
    if (found) setSelectedClassId(found.id);
  };

  const selectedClassName = vehicleClasses.find((c) => c.id === selectedClassId)?.name ?? "";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link href="/service-requests" className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-text-secondary hover:text-text-primary shadow-xs transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="h1 font-bold text-text-primary">Create Service Request</h1>
          <p className="body-2 text-gray-text">Request dedicated vehicles and chauffeurs for corporate mobility</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="card-base p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="START DATE" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <FormInput label="END DATE" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          {/* Row 2: Counter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CounterInput label="NUMBER OF VEHICLES" value={vehiclesCount} onChange={setVehiclesCount} min={0} max={100} />
            <CounterInput label="NUMBER OF DRIVERS" value={driversCount} onChange={setDriversCount} min={0} max={100} />
          </div>

          {/* Row 3: Vehicle Category */}
          <FormDropdown
            label="VEHICLE CATEGORY"
            placeholder="Select vehicle category"
            options={classOptions.length > 0 ? classOptions : ["Premium Executive SUV", "Business Class Sedan", "First Class Luxury", "Executive Chauffeur Van"]}
            value={selectedClassName}
            onSelect={classOptions.length > 0 ? handleClassSelect : setSelectedClassId}
          />

          {/* Row 4: Notes */}
          <div className="space-y-1">
            <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
              NOTES (OPTIONAL)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements or instructions..."
              className="w-full bg-input-bg border-none rounded-2xl px-4 py-3 text-fs-12 text-text-primary placeholder:text-input-placeholder focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-fs-12">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => router.push("/service-requests")} className="py-2.5 px-6 text-fs-12 font-medium text-red-600 hover:bg-red-50 hover:text-red-600">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="py-2.5 px-6 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark shadow-sm">
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
