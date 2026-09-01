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

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain invert" />
          </div>
          <span className="font-poppins font-bold text-fs-14 tracking-wide text-white">B2B Client Portal</span>
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

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col bg-auth-bg relative h-full overflow-y-auto items-center justify-center p-5 sm:p-8">
        {/* Subtle Watermark */}
        <div className="absolute top-8 left-8 w-20 h-20 opacity-5 pointer-events-none hidden sm:block">
          <Image src="/logo.png" alt="Watermark" width={80} height={80} className="object-contain" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[390px] bg-white rounded-[27px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative z-10">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-5">
            <button
              type="button"
              className="flex-1 pb-3 text-fs-13 font-bold text-primary border-b-2 border-primary cursor-pointer"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="flex-1 pb-3 text-fs-13 font-medium text-gray-400 hover:text-gray-600 text-center cursor-pointer"
            >
              Sign UP
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-input-text" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-input-bg border-none rounded-full h-10 pl-11 pr-4 text-fs-12 font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between ml-1 mb-1.5">
                <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider block">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-fs-10 font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-input-text" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-input-bg border-none rounded-full h-10 pl-11 pr-10 text-fs-12 font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-input-text hover:text-text-secondary cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status Feedback Banner */}
            {status === "error" && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-error/10 text-error text-fs-12 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-success/10 text-success text-fs-12 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Authentication successful.</span>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-3.5 h-3.5 rounded-full border border-gray-300 checked:border-primary checked:bg-primary transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-2 h-2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-fs-12 text-gray-text group-hover:text-text-primary transition-colors select-none">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-10 text-fs-13 font-medium rounded-full mt-1 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
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
