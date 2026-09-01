"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";

export default function CreateComplaintPage() {
  const router = useRouter();

  const [submitterName, setSubmitterName] = useState("Admin User");
  const [contractNumber, setContractNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/complaints"
          className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-text-secondary hover:text-text-primary shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="h1 font-bold text-text-primary">Create Complaint</h1>
          <p className="body-2 text-gray-text">Report an issue or service dissatisfaction to concierge support</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="card-base p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Submitter Name & Contract Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="SUBMITTER NAME"
              required
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            <FormInput
              label="CONTRACT NUMBER"
              required
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="e.g +966 50 123 4567"
              icon={<FileText className="w-4 h-4" />}
            />
          </div>

          {/* Row 2: Subject */}
          <FormInput
            label="SUBJECT"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a brief summary"
          />

          {/* Row 3: Description with char counter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1 mb-1.5">
              <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider block">
                DESCRIPTION
              </label>
              <span className="text-fs-10 text-gray-400 font-semibold">{description.length} / 300</span>
            </div>
            <textarea
              rows={4}
              maxLength={300}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your concern..."
              className="w-full bg-input-bg border-none rounded-2xl px-4 py-3 text-fs-12 text-text-primary placeholder:text-input-placeholder focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-fs-12 text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Our resolution team typically reviews all concierge complaints within 24 business hours. You will receive a notification once the status of this report changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/complaints")}
              className="py-2.5 px-6 text-fs-12 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="py-2.5 px-6 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark shadow-sm"
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => router.push("/complaints")}
        title="Complaint Submitted Successfully!"
        message="Our resolution team typically reviews all concierge complaints within 24 business hours. You will receive a notification once the status of this report changes."
        actionText="View Complaints"
        onAction={() => router.push("/complaints")}
      />
    </div>
  );
}
