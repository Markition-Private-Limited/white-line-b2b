"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    vehicleClassesService.list()
      .then(setVehicleClasses)
      .catch(() => { });
  }, []);

  const classOptions = vehicleClasses.map((c) => c.name);

  const validate = (): boolean => {
    // 1. Start Date
    if (!startDate) {
      setFieldErrors({ startDate: "Start date is required." });
      return false;
    }

    // 2. End Date
    if (!endDate) {
      setFieldErrors({ endDate: "End date is required." });
      return false;
    }

    if (startDate && endDate && endDate < startDate) {
      setFieldErrors({ endDate: "End date cannot be earlier than start date." });
      return false;
    }

    // 3. Number of Vehicles
    if (vehiclesCount <= 0) {
      setFieldErrors({ vehiclesCount: "At least 1 vehicle is required." });
      return false;
    }

    // 4. Vehicle Category
    if (!selectedClassId && vehicleClasses.length > 0) {
      setFieldErrors({ vehicleClass: "Please select a vehicle category." });
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
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
    if (found) {
      setSelectedClassId(found.id);
      setFieldErrors((prev) => ({ ...prev, vehicleClass: "" }));
    }
  };

  const selectedClassName = vehicleClasses.find((c) => c.id === selectedClassId)?.name ?? "";

  return (
    <div className="space-y-4">
      {/* Form Container with Heading Inside */}
      <div className="card-base p-6 lg:p-8 bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h1 className="text-fs-22 lg:text-fs-27 font-bold font-poppins text-text-primary mb-6">
          Create Service Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Row 1: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="START DATE"
              type="date"
              required
              value={startDate}
              error={fieldErrors.startDate}
              onChange={(e) => {
                const val = e.target.value;
                setStartDate(val);
                setFieldErrors((prev) => ({ ...prev, startDate: "" }));
                if (endDate && val && endDate < val) {
                  setEndDate("");
                }
              }}
            />
            <FormInput
              label="END DATE"
              type="date"
              required
              min={startDate || undefined}
              value={endDate}
              error={fieldErrors.endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFieldErrors((prev) => ({ ...prev, endDate: "" }));
              }}
            />
          </div>

          {/* Row 2: Counter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CounterInput
              label="NUMBER OF VEHICLES"
              value={vehiclesCount}
              error={fieldErrors.vehiclesCount}
              onChange={(val) => {
                setVehiclesCount(val);
                if (val > 0) setFieldErrors((prev) => ({ ...prev, vehiclesCount: "" }));
              }}
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
          <FormDropdown
            label="VEHICLE CATEGORY"
            placeholder="Select vehicle category"
            options={classOptions.length > 0 ? classOptions : ["Premium Executive SUV", "Business Class Sedan", "First Class Luxury", "Executive Chauffeur Van"]}
            value={selectedClassName}
            error={fieldErrors.vehicleClass}
            onSelect={classOptions.length > 0 ? handleClassSelect : (id) => {
              setSelectedClassId(id);
              setFieldErrors((prev) => ({ ...prev, vehicleClass: "" }));
            }}
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
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/service-requests")}
              className="py-2.5 px-8 text-fs-12 font-medium border border-gray-300 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-8 text-fs-12 font-medium bg-[#005C66] text-white hover:bg-[#004b54] rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
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
