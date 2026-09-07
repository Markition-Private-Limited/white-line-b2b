"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Clock, User, Mail, Briefcase, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormInput } from "@/components/ui/FormInput";
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
    <div className="flex flex-1 h-full w-full font-sans">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-8 lg:p-10 h-full overflow-hidden">
        <Image
          src="/Auth_left_signup_bg.png"
          alt="WhiteLine Fleet Background"
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center">
          <Image
            src="/logo.png"
            alt="WhiteLine B2B Client Portal"
            width={220}
            height={55}
            className="w-[210px] h-auto object-contain"
            priority
          />
        </div>

        {/* Center/Bottom Content */}
        <div className="relative z-10 my-auto text-center max-w-md mx-auto py-6">
          <h1 className="h1 font-medium mb-3 tracking-tight text-white">
            Precision in Motion
          </h1>
          <p className="body-1 text-white/80 font-light leading-relaxed">
            The command center for the world&apos;s most elite chauffeur logistics operations.
          </p>
        </div>

        {/* Bottom Footer Links */}
        <div className="relative z-10 flex items-center justify-between text-fs-10 text-gray-400 border-t border-white/10 pt-4">
          <span>© 2026 ELITE CHAUFFEUR LOGISTICS</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Right Sign Up Card Container */}
      <div className="flex-1 flex flex-col bg-auth-bg relative h-full overflow-y-auto items-center justify-center p-5 sm:p-8">
        {/* Top left background logo watermark in right panel */}
        <div className="absolute top-8 left-8 hidden sm:block">
          <Image
            src="/logo_back.png"
            alt="Whiteline Watermark"
            width={90}
            height={90}
            className="w-[85px] h-auto object-contain"
          />
        </div>

        <div className="w-full max-w-[440px] bg-white rounded-[27px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative z-10">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-fs-18 font-bold font-poppins text-text-primary mb-0.5">
              Create Your Corporate Account
            </h3>
            <p className="body-3 text-gray-text">
              Join WhiteLine for exclusive corporate mobility solutions.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-between mb-4 relative px-4">
            <div className="absolute top-3 left-8 right-8 h-[1.5px] bg-gray-100 -z-0" />
            <div
              className="absolute top-3 left-8 h-[1.5px] bg-primary -z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "88%" }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors",
                  step >= 1 ? "bg-primary text-white ring-2 ring-primary/15" : "bg-gray-100 text-gray-400"
                )}
              >
                01
              </div>
              <span className={cn("text-[9px] font-medium tracking-tight", step >= 1 ? "text-primary font-semibold" : "text-gray-400")}>
                Personal
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors",
                  step >= 2 ? "bg-primary text-white ring-2 ring-primary/15" : "bg-gray-100 text-gray-400"
                )}
              >
                02
              </div>
              <span className={cn("text-[9px] font-medium tracking-tight", step >= 2 ? "text-primary font-semibold" : "text-gray-400")}>
                Company
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors",
                  step >= 3 ? "bg-primary text-white ring-2 ring-primary/15" : "bg-gray-100 text-gray-400"
                )}
              >
                03
              </div>
              <span className={cn("text-[9px] font-medium tracking-tight", step >= 3 ? "text-primary font-semibold" : "text-gray-400")}>
                Preferences
              </span>
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-3.5">
            {/* Step 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Step#1 · Personal Profile
                </h4>

                <FormInput
                  label="FULL NAME"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  icon={<User className="w-4 h-4" />}
                />

                <div>
                  <label className="text-[10px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
                    PHONE NUMBER
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-input-bg rounded-full px-3.5 h-10 text-[12px] font-semibold text-text-primary shrink-0">
                      <span>🇸🇦</span>
                      <span>+966</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="000000000"
                      className="w-full bg-input-bg border-none rounded-full h-10 px-4 text-[12px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <FormInput
                  label="PASSWORD"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a password"
                  icon={<Lock className="w-4 h-4" />}
                  rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <Button
                  type="submit"
                  className="w-full h-10 text-[12px] font-medium rounded-full mt-2 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Move to 2nd Step
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Step 2: Company Details */}
            {step === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Step#2 · Company Details
                </h4>

                <FormInput
                  label="COMPANY NAME"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  icon={<Briefcase className="w-4 h-4" />}
                />

                <FormInput
                  label="COMPANY EMAIL ADDRESS"
                  type="email"
                  required
                  value={formData.companyEmail}
                  onChange={(e) => handleChange("companyEmail", e.target.value)}
                  placeholder="Enter company email"
                  icon={<Mail className="w-4 h-4" />}
                />

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
                    COMPANY ADDRESS
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.companyAddress}
                    onChange={(e) => handleChange("companyAddress", e.target.value)}
                    placeholder="Enter registered address"
                    className="w-full bg-input-bg border-none rounded-2xl px-4 py-2.5 text-[12px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-10 text-[12px] font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 text-[12px] font-medium rounded-full bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Move to Last Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Company Contact & Preferences */}
            {step === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Step#3 · Company Contact
                </h4>

                <FormInput
                  label="DESIGNATION"
                  required
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  placeholder="e.g. Operations Director"
                  icon={<Briefcase className="w-4 h-4" />}
                />

                <FormInput
                  label="ANNUAL TRAVEL BUDGET"
                  required
                  value={formData.travelBudget}
                  onChange={(e) => handleChange("travelBudget", e.target.value)}
                  placeholder="e.g. SAR 500,000"
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <FormInput
                  label="COMPANY SIZE"
                  required
                  value={formData.companySize}
                  onChange={(e) => handleChange("companySize", e.target.value)}
                  placeholder="e.g. 50-200 employees"
                  icon={<Users className="w-4 h-4" />}
                />

                <div className="flex items-start gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => handleChange("termsAccepted", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary border-gray-300 accent-primary cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-fs-10 text-gray-500 leading-tight select-none cursor-pointer">
                    I acknowledge the Terms &amp; Conditions and Privacy Policy of WhiteLine Global.
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-10 text-[12px] font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 text-[12px] font-medium rounded-full bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 cursor-pointer"
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Bottom Login Link */}
          <div className="text-center mt-4 pt-2.5 border-t border-gray-100">
            <p className="text-fs-11 text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
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
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-2">
            Account Activation Pending
          </h3>
          <p className="text-fs-12 text-text-secondary mb-6 max-w-xs leading-relaxed">
            Your activation is pending. One of our team members will contact you shortly.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full py-3 text-fs-14 font-medium rounded-full bg-primary text-white hover:bg-primary-dark"
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
}
