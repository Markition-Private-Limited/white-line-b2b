"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
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
    setIsLoading(true); setError("");
    try {
      const otpCode = otp.join("");
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
    <div className="flex flex-1 h-full w-full font-sans">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-8 lg:p-10 h-full overflow-hidden">
        <Image
          src="/Auth_left_login_bg.png"
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

        <div className="relative z-10 my-auto text-center max-w-md mx-auto py-6">
          <h1 className="h1 font-medium mb-3 tracking-tight text-white">
            Precision in Motion
          </h1>
          <p className="body-1 text-white/80 font-light leading-relaxed">
            The command center for the world&apos;s most elite chauffeur logistics operations.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-fs-10 text-gray-400 border-t border-white/10 pt-4">
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

        <div className="w-full max-w-[390px] bg-white rounded-[27px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative z-10">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-5">
            <Link
              href="/login"
              className="flex-1 pb-3 text-fs-13 font-bold text-primary border-b-2 border-primary text-center"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 pb-3 text-fs-13 font-medium text-gray-400 hover:text-gray-600 text-center"
            >
              Sign UP
            </Link>
          </div>

          {/* Step 1: Forgot Password Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="h2 font-medium text-text-primary mb-1">Forgot Password</h3>
                <p className="body-2 text-gray-text">
                  Enter your registered email address to receive a verification code
                </p>
              </div>

              <FormInput
                label="EMAIL ADDRESS"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. spoc@company.com"
                icon={<Mail className="w-4 h-4" />}
              />

              {error && <p className="text-fs-11 text-red-500">{error}</p>}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-10 text-[12px] font-medium rounded-full mt-2 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Send OTP
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <div className="text-center pt-1">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-fs-11 text-text-secondary hover:text-text-primary font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in text-center">
              <div>
                <h3 className="text-fs-16 font-bold font-poppins text-text-primary mb-1">OTP Verification</h3>
                <p className="text-[11px] text-gray-text">
                  Enter the verification code sent to <span className="font-semibold">{email}</span>
                </p>
              </div>

              {/* 6 Digit OTP Input Boxes */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
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
                    className="w-9 h-10 text-center text-[13px] font-semibold bg-input-bg border-none rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-text-primary"
                  />
                ))}
              </div>

              {error && <p className="text-fs-11 text-red-500">{error}</p>}

              {/* Resend Timer */}
              <div className="pt-1">
                {timer > 0 ? (
                  <p className="text-fs-10 text-gray-400">
                    Resend code in <span className="font-semibold text-text-primary">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-fs-11 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-10 text-[12px] font-medium rounded-full mt-1 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Verify OTP
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); setOtp(["", "", "", "", "", ""]); }}
                  className="inline-flex items-center gap-1.5 text-fs-11 text-text-secondary hover:text-text-primary font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Create New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-fs-16 font-bold font-poppins text-text-primary mb-1">Create New Password</h3>
                <p className="text-[11px] text-gray-text">
                  Your new password must be different from your previous password to ensure maximum security.
                </p>
              </div>

              <FormInput
                label="NEW PASSWORD"
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowNewPassword(!showNewPassword)}
              />

              {/* Password Strength Bar */}
              {newPassword && (
                <div className="pt-0.5">
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        getPasswordStrength() <= 33
                          ? "w-1/3 bg-error"
                          : getPasswordStrength() <= 66
                          ? "w-2/3 bg-accent"
                          : "w-full bg-success"
                      )}
                    />
                  </div>
                  <span className="text-fs-9 text-gray-400 mt-0.5 block">Password strength</span>
                </div>
              )}

              <FormInput
                label="CONFIRM PASSWORD"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {error && <p className="text-fs-11 text-red-500">{error}</p>}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-10 text-[12px] font-medium rounded-full mt-2 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Reset Password
                <ArrowRight className="w-3.5 h-3.5" />
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
