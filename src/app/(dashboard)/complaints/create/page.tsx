"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/complaints"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-900">Create Complaint</h1>
          <p className="text-xs text-gray-400">Report an issue or service dissatisfaction to concierge support</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Submitter Name & Contract Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SUBMITTER NAME</label>
              <input
                type="text"
                required
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CONTRACT NUMBER</label>
              <input
                type="text"
                required
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="e.g +966 50 123 4567"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 2: Subject */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SUBJECT</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a brief summary"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
            />
          </div>

          {/* Row 3: Description with char counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION</label>
              <span className="text-[10px] text-gray-400 font-semibold">{description.length} / 300</span>
            </div>
            <textarea
              rows={4}
              maxLength={300}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your concern..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Our resolution team typically reviews all concierge complaints within 24 business hours. You will receive a notification once the status of this report changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/complaints")}
              className="py-2.5 px-6 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="py-2.5 px-6 text-xs font-semibold bg-[#005C66] text-white hover:bg-[#004b54]"
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
