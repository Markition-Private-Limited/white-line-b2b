"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@whiteline.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    setTimeout(() => {
      setIsLoading(false);
      if (password === "wrong") {
        setStatus("error");
        setErrorMessage("Wrong Password. Please try again");
      } else {
        setStatus("success");
        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    }, 600);
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

      {/* Right Login Card Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative">
        {/* Subtle Watermark in background */}
        <div className="absolute top-12 right-12 w-28 h-28 opacity-5 pointer-events-none">
          <Image src="/logo.png" alt="Watermark" width={112} height={112} className="object-contain" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[440px] bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100/80">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-8">
            <button
              type="button"
              className="flex-1 pb-3 text-sm font-bold text-[#005C66] border-b-2 border-[#005C66] cursor-pointer"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="flex-1 pb-3 text-sm font-medium text-gray-400 hover:text-gray-600 text-center cursor-pointer"
            >
              Sign UP
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#005C66] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white transition-colors"
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

            {/* Status Feedback Banner */}
            {status === "error" && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-600 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E6F8E8] text-[#12A150] text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Authentication successful.</span>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#005C66] focus:ring-[#005C66] border-gray-300 cursor-pointer accent-[#005C66]"
              />
              <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 text-sm font-semibold rounded-full mt-3 bg-[#005C66] text-white hover:bg-[#004b54] flex items-center justify-center gap-2"
            >
              Login to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
