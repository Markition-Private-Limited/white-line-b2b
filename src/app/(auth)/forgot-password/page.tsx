"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordStrengthBar } from "@/components/ui/PasswordStrengthBar";
import { cn } from "@/utils/cn";
import apiClient from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [timer, setTimer] = useState(60);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true); setError("");
    try {
      await apiClient.post('/auth/b2b/forgot-password', { email });
      setStep(2);
      setTimer(60);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      await apiClient.post('/auth/b2b/forgot-password', { email });
      setTimer(60);
    } catch {}
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setIsLoading(true); setError("");
    try {
      const { data } = await apiClient.post('/auth/b2b/verify-reset-otp', { email, otp: otpCode });
      const result = data.data ?? data;
      setResetToken(result.reset_token);
      setStep(3);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(newPassword)) { setError("Password must contain an uppercase letter."); return; }
    if (!/[0-9]/.test(newPassword)) { setError("Password must contain a number."); return; }
    if (!/[^A-Za-z0-9]/.test(newPassword)) { setError("Password must contain a special character."); return; }
    
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setIsLoading(true); setError("");
    try {
      await apiClient.post('/auth/b2b/reset-password', { reset_token: resetToken, new_password: newPassword });
      setSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-1 h-full w-full font-sans">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-8 lg:p-10 h-full overflow-hidden">
        <Image
          src="/Auth_left_login_bg.png"
          alt="WhiteLine Fleet Background"
          fill
          priority
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/35" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center">
          <Image
            src="/logo.png"
            alt="WhiteLine B2B Client Portal"
            width={260}
            height={65}
            className="w-[260px] h-auto object-contain"
            priority
          />
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 text-center max-w-md mx-auto mt-auto mb-10 lg:mb-14 py-4">
          <h1 className="h1 font-medium mb-3 tracking-tight text-white">
            Precision in Motion
          </h1>
          <p className="body-1 text-white/90 font-light leading-relaxed">
            The command center for the world&apos;s most elite chauffeur logistics operations.
          </p>
        </div>

        {/* Bottom Footer Links */}
        <div className="relative z-10 flex items-center justify-between text-fs-10 text-gray-300 border-t border-white/15 pt-4">
          <span>© 2026 ELITE CHAUFFEUR LOGISTICS</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Right Reset Password Card */}
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

        <div className="w-full max-w-[430px] sm:max-w-[450px] bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100/90 relative z-10">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-6">
            <Link
              href="/login"
              className="flex-1 pb-3.5 text-[15px] sm:text-[16px] font-bold text-primary border-b-2 border-primary text-center"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 pb-3.5 text-[15px] sm:text-[16px] font-medium text-gray-400 hover:text-gray-600 text-center transition-colors"
            >
              Sign UP
            </Link>
          </div>

          {/* Step 1: Forgot Password Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in">
              <div className="mb-6 pt-1">
                <h3 className="text-fs-20 sm:text-fs-22 font-bold font-poppins text-text-primary mb-1.5">Forgot Password</h3>
                <p className="text-[13px] sm:text-[14px] text-gray-text leading-relaxed">
                  Enter your registered email address to receive a verification code
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-2 block">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
                    <Mail className="w-4.5 h-4.5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. spoc@company.com"
                    className="w-full bg-input-bg border-none rounded-full h-11 sm:h-12 pl-12 pr-4 text-[13px] sm:text-[14px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                {error && <p className="text-[11px] text-error font-medium mt-1.5 ml-1">{error}</p>}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-11 sm:h-12 text-[14px] sm:text-[15px] font-semibold rounded-full mt-3 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Send OTP
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in text-center">
              <div className="mb-6 pt-1">
                <h3 className="text-fs-20 sm:text-fs-22 font-bold font-poppins text-text-primary mb-1.5">OTP Verification</h3>
                <p className="text-[13px] sm:text-[14px] text-gray-text">
                  Enter the verification code sent to <span className="font-semibold text-text-primary">{email}</span>
                </p>
              </div>

              {/* 6 Digit OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2 pt-2">
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
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-[16px] sm:text-[18px] font-bold bg-input-bg border-none rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-text-primary"
                  />
                ))}
              </div>

              {error && <p className="text-[11px] text-error font-medium mt-1.5">{error}</p>}

              {/* Resend Timer */}
              <div className="pt-1">
                {timer > 0 ? (
                  <p className="text-[12px] text-gray-400">
                    Resend code in <span className="font-semibold text-text-primary">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-11 sm:h-12 text-[14px] sm:text-[15px] font-semibold rounded-full mt-3 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Verify OTP
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); setOtp(["", "", "", "", "", ""]); }}
                  className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Create New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in">
              <div className="mb-6 pt-1">
                <h3 className="text-fs-20 sm:text-fs-22 font-bold font-poppins text-text-primary mb-1.5">Create New Password</h3>
                <p className="text-[13px] sm:text-[14px] text-gray-text leading-relaxed">
                  Your new password must be different from your previous password to ensure maximum security.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-2 block">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
                    <Lock className="w-4.5 h-4.5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-input-bg border-none rounded-full h-11 sm:h-12 pl-12 pr-11 text-[13px] sm:text-[14px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </div>
                </div>
              </div>

              {/* Password Strength Bar */}
              <PasswordStrengthBar password={newPassword} />

              <div>
                <label className="text-[11px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-2 block">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
                    <Lock className="w-4.5 h-4.5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-input-bg border-none rounded-full h-11 sm:h-12 pl-12 pr-11 text-[13px] sm:text-[14px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </div>
                </div>
              </div>

              {error && <p className="text-[11px] text-error font-medium mt-1.5 ml-1">{error}</p>}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-11 sm:h-12 text-[14px] sm:text-[15px] font-semibold rounded-full mt-3 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
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
