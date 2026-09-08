"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { SuccessModal } from "@/components/ui/SuccessModal";
import complaintsService from "@/services/complaints.service";

export default function CreateComplaintPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHARS = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length > MAX_CHARS) {
      setError(`Description must be ${MAX_CHARS} characters or less.`);
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await complaintsService.create({
        subject,
        description,
        ...(bookingRef ? { booking_id: bookingRef } : {}),
      });
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/complaints" className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-text-secondary hover:text-text-primary shadow-xs transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="h1 font-bold text-text-primary">Submit a Complaint</h1>
          <p className="body-2 text-gray-text">Report an issue for review by our operations team</p>
        </div>
      </div>

      {/* Form */}
      <div className="card-base p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="SUBJECT"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Driver was late for pickup"
          />

          <FormInput
            label="BOOKING REFERENCE (OPTIONAL)"
            value={bookingRef}
            onChange={(e) => setBookingRef(e.target.value)}
            placeholder="e.g. BK-7721"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1 mb-1.5">
              <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider block">
                DESCRIPTION <span className="text-error">*</span>
              </label>
              <span className={`text-fs-10 font-medium ${description.length > MAX_CHARS ? "text-error" : "text-gray-400"}`}>
                {description.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full bg-input-bg border-none rounded-2xl px-4 py-3 text-fs-12 text-text-primary placeholder:text-input-placeholder focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-fs-11 text-blue-700 leading-relaxed">
              Your complaint will be reviewed by our operations team within 24 hours. You will be notified of any updates.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-fs-12">{error}</div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => router.push("/complaints")} className="py-2.5 px-6 text-fs-12 font-medium text-red-600 hover:bg-red-50 hover:text-red-600">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={description.length > MAX_CHARS}
              className="py-2.5 px-6 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark shadow-sm"
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => router.push("/complaints")}
        title="Complaint Submitted!"
        message="Your complaint has been received and will be reviewed by our operations team within 24 hours."
        actionText="View Complaints"
        onAction={() => router.push("/complaints")}
      />
    </div>
  );
}
