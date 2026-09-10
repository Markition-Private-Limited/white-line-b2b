"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, X, ChevronDown } from "lucide-react";
import complaintsService from "@/services/complaints.service";
import authService from "@/services/auth.service";
import { SuccessFlowerBadge } from "@/components/ui/SuccessModal";

type BookingOption = { id: string; booking_number: string; scheduled_datetime: string; status: string };

export default function CreateComplaintPage() {
  const router = useRouter();

  const [submitterName, setSubmitterName] = useState("Admin User");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const MAX_CHARS = 300;

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user?.full_name) {
      setSubmitterName(user.full_name);
    }
  }, []);

  useEffect(() => {
    complaintsService.listBookings()
      .then((bookings) => setBookingOptions(bookings))
      .catch((err) => {
        console.error("Failed to load bookings for complaint form:", err);
        setBookingOptions([]);
      });
  }, []);

  const validate = (): boolean => {
    // 1. Contact number validation (optional)
    if (contactNumber.trim()) {
      const saudiPhoneRegex = /^(05|5|\+9665)[0-9]{8}$/;
      const cleaned = contactNumber.replace(/\s+/g, '');
      if (!saudiPhoneRegex.test(cleaned)) {
        setFieldErrors({ contactNumber: "Please enter a valid Saudi phone number (e.g. +9665... or 05...)." });
        return false;
      }
    }

    // 2. Subject validation (one at a time)
    if (!subject.trim()) {
      setFieldErrors({ subject: "Subject is required." });
      return false;
    }
    if (subject.trim().length < 3) {
      setFieldErrors({ subject: "Subject must be at least 3 characters." });
      return false;
    }

    // 3. Description validation (one at a time)
    if (!description.trim()) {
      setFieldErrors({ description: "Description is required." });
      return false;
    }
    if (description.trim().length < 10) {
      setFieldErrors({ description: "Please provide at least 10 characters describing your concern." });
      return false;
    }
    if (description.length > MAX_CHARS) {
      setFieldErrors({ description: `Description must be ${MAX_CHARS} characters or less.` });
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
      await complaintsService.create({
        subject: subject.trim(),
        description: description.trim(),
        ...(contactNumber.trim() ? { contact_number: contactNumber.trim() } : {}),
        ...(bookingId ? { booking_id: bookingId } : {}),
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
    <div className="space-y-6 pb-12 lg:pb-16 max-w-[1280px]">
      {/* Main Form Card with Heading inside matching Service Request */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h1 className="text-[24px] lg:text-[27px] font-bold font-poppins text-gray-900 mb-7 tracking-tight">
          Create Complaint
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Row 1: Submitter Name & Contact Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                SUBMITTER NAME
              </label>
              <input
                type="text"
                readOnly
                value={submitterName}
                className="w-full h-[48px] sm:h-[50px] bg-[#EAEAEA] rounded-full px-6 text-[13px] sm:text-[14px] text-gray-600 font-medium border-none focus:outline-none cursor-default select-none shadow-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                CONTACT NUMBER (OPTIONAL)
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (fieldErrors.contactNumber) {
                    setFieldErrors((prev) => ({ ...prev, contactNumber: "" }));
                  }
                }}
                placeholder="e.g. 05XXXXXXXX"
                className={`w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full px-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none transition-all shadow-xs ${
                  fieldErrors.contactNumber
                    ? "ring-1 ring-red-500 focus:ring-1 focus:ring-red-500"
                    : "focus:ring-1 focus:ring-primary/20"
                }`}
              />
              {fieldErrors.contactNumber && (
                <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-2">
                  {fieldErrors.contactNumber}
                </p>
              )}
            </div>
          </div>

          {/* Row 1.5: Related Booking (Optional) */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
              RELATED BOOKING (OPTIONAL)
            </label>
            <div className="relative">
              <select
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-6 pr-12 text-[13px] sm:text-[14px] text-gray-800 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs appearance-none cursor-pointer"
              >
                <option value="">None selected</option>
                {bookingOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.booking_number} — {new Date(b.scheduled_datetime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Subject */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
              SUBJECT
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (fieldErrors.subject) {
                  setFieldErrors((prev) => ({ ...prev, subject: "" }));
                }
              }}
              placeholder="Enter a brief summary"
              className={`w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full px-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none transition-all shadow-xs ${
                fieldErrors.subject
                  ? "ring-1 ring-red-500 focus:ring-1 focus:ring-red-500"
                  : "focus:ring-1 focus:ring-primary/20"
              }`}
            />
            {fieldErrors.subject && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-2">
                {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Row 3: Description with Counter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block font-inter">
                DESCRIPTION
              </label>
              <span
                className={`text-[12px] font-medium font-inter ${
                  description.length > MAX_CHARS || fieldErrors.description
                    ? "text-red-500 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {description.length} / {MAX_CHARS}
              </span>
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Provide detailed information about your concern..."
              className={`w-full bg-[#F4F5F7] rounded-[24px] p-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none transition-all resize-none min-h-[170px] leading-relaxed shadow-xs ${
                fieldErrors.description
                  ? "ring-1 ring-red-500 focus:ring-1 focus:ring-red-500"
                  : "focus:ring-1 focus:ring-primary/20"
              }`}
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-2">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Row 4: Action Buttons (Cancel with Red text + Submit Complaint in Deep Teal) */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.push("/complaints")}
              className="h-[42px] sm:h-[44px] px-8 rounded-full border border-gray-300 text-[#D9383A] hover:bg-red-50/50 text-[12px] sm:text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || description.length > MAX_CHARS}
              className="h-[42px] sm:h-[44px] px-8 rounded-full bg-[#005C66] text-white hover:bg-[#004d55] text-[12px] sm:text-[13px] font-medium cursor-pointer transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom 24-hour Notice Banner matching Figma View 3 */}
      <div className="bg-[#FEF9E2] border border-[#F5ECC4] rounded-[24px] p-5 flex items-center gap-3.5 shadow-xs mt-6">
        <div className="w-6 h-6 rounded-full bg-[#E5D7A0] text-[#78350F] flex items-center justify-center shrink-0">
          <Info className="w-3.5 h-3.5 text-[#78350F]" />
        </div>
        <p className="text-[12px] sm:text-[13px] text-[#5C4813] font-normal leading-relaxed">
          Our resolution team typically reviews all concierge complaints within 24 business hours. You will receive a notification once the status of this report changes.
        </p>
      </div>

      {/* Complaint Submitted Successfully Modal matching Figma View 4 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-[36px] p-8 sm:p-10 max-w-[450px] w-full relative text-center shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => router.push("/complaints")}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Green Seal Flower Badge from tick_flower.png */}
            <div className="mb-4 flex justify-center">
              <SuccessFlowerBadge size={84} />
            </div>

            <h3 className="text-[21px] sm:text-[23px] font-bold text-gray-900 mb-2 font-poppins leading-tight">
              Complaint Submitted<br />Successfully!
            </h3>

            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed max-w-[340px] mx-auto mb-7 font-inter">
              Our resolution team typically reviews all concierge complaints within 24 business hours. You will receive a notification once the status of this report changes.
            </p>

            <button
              type="button"
              onClick={() => router.push("/complaints")}
              className="rounded-full bg-[#005C66] text-white hover:bg-[#004d55] px-9 h-[44px] text-[13px] font-medium transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center"
            >
              View Complaints
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
