"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+966",
    password: "",
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    designation: "",
    travelBudget: "",
    companySize: "",
    termsAccepted: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      setPendingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Left Chauffeur Banner */}
      <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden bg-gray-900">
        <Image
          src="/Auth_left_signup_bg.png"
          alt="WhiteLine Fleet Background"
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain invert" />
          </div>
          <span className="font-poppins font-bold text-sm tracking-wide">B2B Client Portal</span>
        </div>

        {/* Center/Bottom Content */}
        <div className="relative z-10 my-auto text-center max-w-md mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold font-poppins mb-3 tracking-tight">
            Precision in Motion
          </h2>
          <p className="text-xs lg:text-sm text-gray-300 font-light leading-relaxed">
            The command center for the world&apos;s most elite chauffeur logistics operations.
          </p>
        </div>

        {/* Bottom Footer Links */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 border-t border-white/10 pt-4">
          <span>© 2026 ELITE CHAUFFEUR LOGISTICS</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Right Sign Up Card Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative">
        <div className="w-full max-w-[480px] bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100/80">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold font-poppins text-gray-900 mb-1">
              Create Your Corporate Account
            </h3>
            <p className="text-xs text-gray-400">
              Join WhiteLine for exclusive corporate mobility solutions.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-[#005C66] -z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "90%" }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= 1 ? "bg-[#005C66] text-white" : "bg-gray-100 text-gray-400"
                )}
              >
                01
              </div>
              <span className={cn("text-[10px] font-semibold", step >= 1 ? "text-[#005C66]" : "text-gray-400")}>
                Personal
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= 2 ? "bg-[#005C66] text-white" : "bg-gray-100 text-gray-400"
                )}
              >
                02
              </div>
              <span className={cn("text-[10px] font-semibold", step >= 2 ? "text-[#005C66]" : "text-gray-400")}>
                Company
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= 3 ? "bg-[#005C66] text-white" : "bg-gray-100 text-gray-400"
                )}
              >
                03
              </div>
              <span className={cn("text-[10px] font-semibold", step >= 3 ? "text-[#005C66]" : "text-gray-400")}>
                Preferences
              </span>
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            {/* Step 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Step#1 Personal Profile
                </h4>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">PHONE NUMBER</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700">
                      <span>🇸🇦</span>
                      <span>+966</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="000000000"
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">PASSWORD</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Create a password"
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full py-3 text-xs font-semibold rounded-full mt-6 bg-[#005C66] text-white flex items-center justify-center gap-2">
                  Move to 2nd Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Company Details */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Step#2 Company Details
                </h4>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">COMPANY NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">COMPANY EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formData.companyEmail}
                    onChange={(e) => handleChange("companyEmail", e.target.value)}
                    placeholder="Enter your company email address"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">COMPANY ADDRESS</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.companyAddress}
                    onChange={(e) => handleChange("companyAddress", e.target.value)}
                    placeholder="Enter company address"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white flex items-center justify-center gap-2"
                  >
                    Move to Last Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Company Contact & Preferences */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Step#3 Company Contact
                </h4>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">DESIGNATION</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    placeholder="Enter your designation"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ANNUAL TRAVEL BUDGET</label>
                  <input
                    type="text"
                    required
                    value={formData.travelBudget}
                    onChange={(e) => handleChange("travelBudget", e.target.value)}
                    placeholder="Enter annual travel budget"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">COMPANY SIZE</label>
                  <input
                    type="text"
                    required
                    value={formData.companySize}
                    onChange={(e) => handleChange("companySize", e.target.value)}
                    placeholder="Enter Employee Count"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => handleChange("termsAccepted", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#005C66] focus:ring-[#005C66] border-gray-300 accent-[#005C66]"
                  />
                  <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                    I acknowledge the Terms &amp; Conditions and Privacy Policy of WhiteLine Global.
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 py-2.5 text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Bottom Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#005C66] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Account Activation Pending Modal */}
      <Modal
        isOpen={pendingModalOpen}
        onClose={() => router.push("/login")}
        maxWidth="max-w-md"
        className="text-center p-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#005C66]/10 text-[#005C66] flex items-center justify-center mb-5">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-poppins text-gray-900 mb-2">
            Account Activation Pending
          </h3>
          <p className="text-xs text-gray-500 mb-8 max-w-xs leading-relaxed">
            Your activation is pending. One of our team members will contact you shortly.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full py-3 text-sm font-semibold rounded-full bg-[#005C66] text-white"
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
}
