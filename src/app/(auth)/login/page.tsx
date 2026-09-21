"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import authService from "@/services/auth.service";
import apiClient from "@/lib/axios";
import { getFcmToken } from "@/lib/firebase";

type ValidationState = "idle" | "error" | "success";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // General status banner
  const [status, setStatus] = useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (val: string) => {
    if (!val) {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return "Please enter a valid email format";
    }
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return "Password is required";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setStatus("idle");
    if (emailTouched) {
      setEmailError(validateEmail(val));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setStatus("idle");
    if (passwordTouched && validateEmail(email) === "") {
      setPasswordError(validatePassword(val));
    }
  };

  const handlePasswordBlur = () => {
    if (validateEmail(email) !== "") return;
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const getFieldState = (value: string, error: string, touched: boolean): ValidationState => {
    if (!touched) return "idle";
    if (error) return "error";
    if (value) return "success";
    return "idle";
  };

  const emailState = getFieldState(email, emailError, emailTouched);
  // For password in login, if it's filled and no error, mark success
  const passwordState = getFieldState(password, passwordError, passwordTouched);

  const getIconColor = (state: ValidationState) => {
    return "text-input-text";
  };

  const getInputStyles = (state: ValidationState, hasEyeIcon: boolean) => {
    const base = "w-full bg-input-bg rounded-full h-11 sm:h-12 pl-12 text-[13px] sm:text-[14px] font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light placeholder:text-[13px] focus:outline-none transition-all";
    const paddingRight = hasEyeIcon ? "pr-11" : "pr-4";

    return `${base} ${paddingRight} border-none focus:ring-1 focus:ring-primary/20`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger validation sequentially
    const eError = validateEmail(email);
    setEmailTouched(true);
    setEmailError(eError);

    if (eError) {
      setPasswordTouched(false);
      setPasswordError("");
      return;
    }

    const pError = validatePassword(password);
    setPasswordTouched(true);
    setPasswordError(pError);

    if (pError) {
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const result = await authService.login(email, password, rememberMe);
      authService.saveSession(result, rememberMe);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      try {
        // Race against a timeout so a slow/hung permission prompt can never
        // meaningfully delay login — this is best-effort registration, not
        // a login requirement.
        const token = await Promise.race([
          getFcmToken(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        if (token) {
          await apiClient.patch('/b2b/profile', { fcm_token: token });
        }
      } catch (err) {
        console.error("Failed to register push token:", err);
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch (err: any) {
      setStatus("error");
      const msg = err?.response?.data?.message;
      setErrorMessage(typeof msg === "string" ? msg : "Invalid credentials. Please try again.");
      
      // Highlight fields as error if login fails
      setEmailError(" "); // Space so we get the error styling without extra text below
      setPasswordError(" ");
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

      {/* Right side - Login Form */}
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

        {/* Form Card */}
        <div className="w-full max-w-[430px] sm:max-w-[450px] bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100/90 relative z-10">
          {/* Top Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-6">
            <button
              type="button"
              className="flex-1 pb-3.5 text-[15px] sm:text-[16px] font-bold text-primary border-b-2 border-primary cursor-pointer"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="flex-1 pb-3.5 text-[15px] sm:text-[16px] font-medium text-gray-400 hover:text-gray-600 text-center cursor-pointer transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="text-[11px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-2 block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
                  <Mail className={`w-4.5 h-4.5 ${getIconColor(emailState)} transition-colors`} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onBlur={handleEmailBlur}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className={getInputStyles(emailState, false)}
                />
              </div>
              {emailState === "error" && emailError.trim() !== "" && (
                <p className="text-error text-[11px] mt-1.5 ml-1 font-medium animate-in fade-in">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between ml-1 mb-2">
                <label className="text-[11px] font-semibold text-gray-text uppercase tracking-wider block">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
                  <Lock className={`w-4.5 h-4.5 ${getIconColor(passwordState)} transition-colors`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onBlur={handlePasswordBlur}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={getInputStyles(passwordState, true)}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-input-text hover:text-text-secondary cursor-pointer transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
              {passwordState === "error" && passwordError.trim() !== "" && (
                <p className="text-error text-[11px] mt-1.5 ml-1 font-medium animate-in fade-in">{passwordError}</p>
              )}
            </div>

            {/* Status Feedback Banner */}
            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-error/10 text-error text-[12px] sm:text-[13px] animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-success/10 text-success text-[12px] sm:text-[13px] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Authentication successful. Redirecting...</span>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-4 h-4 rounded-full border border-gray-300 checked:border-primary checked:bg-primary transition-colors cursor-pointer"
                  >
                  </input>
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-[13px] text-gray-text group-hover:text-text-primary transition-colors select-none">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 sm:h-12 text-[14px] sm:text-[15px] font-semibold rounded-full mt-2 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
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

