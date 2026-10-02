"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CounterInput } from "@/components/ui/CounterInput";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { FormDropdown } from "@/components/ui/FormDropdown";
import serviceRequestsService from "@/services/serviceRequests.service";
import vehicleClassesService, { type VehicleClass } from "@/services/vehicleClasses.service";
import contractsService from "@/services/contracts.service";
import { getRiyadhISODate } from "@/utils/datetime";

export default function CreateServiceRequestPage() {
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [notes, setNotes] = useState("");
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>([]);
  const [allowedVehicleTypes, setAllowedVehicleTypes] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadAllowedClasses = async () => {
      try {
        const [classes, firstPage] = await Promise.all([
          vehicleClassesService.list(),
          contractsService.list(1),
        ]);
        const contracts = [...(firstPage.data ?? [])];
        let nextPage = 2;
        while (contracts.length < firstPage.total) {
          const next = await contractsService.list(nextPage++);
          if (!next.data?.length) break;
          contracts.push(...next.data);
        }
        const activeContracts = contracts.filter((contract) => contract.status?.toLowerCase() === "active");
        const details = await Promise.all(activeContracts.map((contract) =>
          contractsService.get(contract.id).catch(() => contract)
        ));
        const allowedTypes = [...new Set(details.flatMap((contract) =>
          Array.isArray(contract.vehicle_types_allowed)
            ? contract.vehicle_types_allowed.filter((type): type is string => typeof type === "string")
                .map((type) => type.trim().toLowerCase())
            : []
        ))];

        if (cancelled) return;
        setVehicleClasses(classes);
        setAllowedVehicleTypes(allowedTypes);
        if (allowedTypes.length === 0) {
          setAvailabilityError("No active contract with allowed vehicle types was found.");
        }
      } catch {
        if (!cancelled) setAvailabilityError("Vehicle options could not be loaded. Please try again.");
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    };

    loadAllowedClasses();
    return () => { cancelled = true; };
  }, []);

  const eligibleVehicleClasses = vehicleClasses.filter((vehicleClass) => {
    const typeWords = (vehicleClass.vehicle_type || `${vehicleClass.name} ${vehicleClass.description || ""}`)
      .toLowerCase().split(/[^a-z0-9]+/);
    return allowedVehicleTypes.some((type) => typeWords.includes(type));
  });
  const classOptions = eligibleVehicleClasses.map((vehicleClass) => vehicleClass.name);

  const validate = (): boolean => {
    // 1. Start Date
    if (!startDate) {
      setFieldErrors({ startDate: "Start date is required." });
      return false;
    }

    if (startDate < getRiyadhISODate()) {
      setFieldErrors({ startDate: "Start date cannot be in the past." });
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

    if (driversCount <= 0) {
      setFieldErrors({ driversCount: "At least 1 driver is required." });
      return false;
    }

    // 4. Vehicle Category
    if (optionsLoading || availabilityError || eligibleVehicleClasses.length === 0) {
      setFieldErrors({ vehicleClass: availabilityError || "No vehicle categories are available under your active contract." });
      return false;
    }
    if (!eligibleVehicleClasses.some((vehicleClass) => vehicleClass.id === selectedClassId)) {
      setFieldErrors({ vehicleClass: "Please select a vehicle category allowed by your contract." });
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
    const found = eligibleVehicleClasses.find((c) => c.name === name);
    if (found) {
      setSelectedClassId(found.id);
      setFieldErrors((prev) => ({ ...prev, vehicleClass: "" }));
    }
  };

  const selectedClassName = eligibleVehicleClasses.find((c) => c.id === selectedClassId)?.name ?? "";

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
              min={getRiyadhISODate()}
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
              error={fieldErrors.driversCount}
              onChange={(val) => {
                setDriversCount(val);
                if (val > 0) setFieldErrors((prev) => ({ ...prev, driversCount: "" }));
              }}
              min={0}
              max={100}
            />
          </div>

          {/* Row 3: Vehicle Category */}
          <FormDropdown
            label="VEHICLE CATEGORY"
            placeholder="Select vehicle category"
            options={classOptions}
            value={selectedClassName}
            error={fieldErrors.vehicleClass}
            onSelect={handleClassSelect}
          />
          {optionsLoading && <p className="text-xs text-gray-500">Loading contract vehicle options...</p>}
          {!optionsLoading && availabilityError && <p className="text-xs text-red-600">{availabilityError}</p>}
          {!optionsLoading && !availabilityError && classOptions.length === 0 && (
            <p className="text-xs text-red-600">No vehicle categories match your active contract. Contact WhiteLine support.</p>
          )}

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
