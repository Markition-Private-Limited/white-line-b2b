"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { cn } from "@/utils/cn";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("admin@whiteline.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(28);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setTimer(28);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessModalOpen(true);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 33;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) score += 33;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 34;
    return score;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Left Chauffeur Banner */}
      <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden bg-gray-900">
        <Image
          src="/Auth_left_login_bg.png"
          alt="WhiteLine Fleet Background"
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain invert" />
          </div>
          <span className="font-poppins font-bold text-sm tracking-wide">B2B Client Portal</span>
        </div>

        <div className="relative z-10 my-auto text-center max-w-md mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold font-poppins mb-3 tracking-tight">
            Precision in Motion
          </h2>
          <p className="text-xs lg:text-sm text-gray-300 font-light leading-relaxed">
            The command center for the world&apos;s most elite chauffeur logistics operations.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 border-t border-white/10 pt-4">
          <span>© 2026 ELITE CHAUFFEUR LOGISTICS</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Right Reset Password Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative">
        <div className="w-full max-w-[440px] bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100/80">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-8">
            <Link
              href="/login"
              className="flex-1 pb-3 text-sm font-bold text-[#005C66] border-b-2 border-[#005C66] text-center"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 pb-3 text-sm font-medium text-gray-400 hover:text-gray-600 text-center"
            >
              Sign UP
            </Link>
          </div>

          {/* Step 1: Forgot Password Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">Forgot Password</h3>
                <p className="text-xs text-gray-400">
                  Enter your registered email address to receive a verification code
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">EMAIL ADDRESS</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@whiteline.com"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-xs font-semibold rounded-full mt-4 bg-[#005C66] text-white flex items-center justify-center gap-2"
              >
                Send OTP
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center pt-3">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in text-center">
              <div>
                <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">OTP Verification</h3>
                <p className="text-xs text-gray-400">
                  Enter the verification code sent to your email address
                </p>
              </div>

              {/* 6 Digit OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2.5 pt-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="pt-2">
                {timer > 0 ? (
                  <p className="text-xs text-gray-400">
                    Resend code in <span className="font-bold text-gray-600">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(28)}
                    className="text-xs font-bold text-[#005C66] hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-xs font-semibold rounded-full mt-2 bg-[#005C66] text-white flex items-center justify-center gap-2"
              >
                Verify OTP
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Create New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">Create New Password</h3>
                <p className="text-xs text-gray-400">
                  Your new password must be different from your previous password to ensure maximum security.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NEW PASSWORD</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {newPassword && (
                  <div className="pt-1.5">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          getPasswordStrength() <= 33
                            ? "w-1/3 bg-red-500"
                            : getPasswordStrength() <= 66
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-[#12A150]"
                        )}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5 block">Password strength</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CONFIRM PASSWORD</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-xs font-semibold rounded-full mt-4 bg-[#005C66] text-white flex items-center justify-center gap-2"
              >
                Reset Password
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Password Reset Successfully Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => router.push("/login")}
        title="Password Reset Successfully"
        message="Now You can login with your new password."
        actionText="Log In →"
        onAction={() => router.push("/login")}
      />
    </div>
  );
}
