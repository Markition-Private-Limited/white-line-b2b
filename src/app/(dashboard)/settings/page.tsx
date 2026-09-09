"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Globe, Lock, LogOut, Eye, EyeOff, Save, Mail, Phone, MapPin, CheckCircle2, X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordStrengthBar } from "@/components/ui/PasswordStrengthBar";
import { cn } from "@/utils/cn";
import profileService from "@/services/profile.service";
import authService from "@/services/auth.service";

export default function SettingsPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("WhiteLine Global");
  const [companyEmail, setCompanyEmail] = useState("contact@whiteline.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [address, setAddress] = useState("123 Luxury Ave, Suite 400, Manhattan, New York, NY 10001");
  const [userName, setUserName] = useState("Alexander Miller");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccessModalOpen, setPasswordSuccessModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user?.full_name) setUserName(user.full_name);

    profileService.get()
      .then((data) => {
        if (data.client?.company_name) setCompanyName(data.client.company_name);
        if (data.client?.company_email) setCompanyEmail(data.client.company_email);
        if (data.client?.company_phone) setPhone(data.client.company_phone);
        if (data.client?.company_address) setAddress(data.client.company_address);
      })
      .catch(() => {
        const client = authService.getStoredClient();
        if (client?.company_name) setCompanyName(client.company_name);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await profileService.update({
        company_name: companyName,
        company_phone: phone,
        company_address: address,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setSaveError(typeof msg === "string" ? msg : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    try {
      await profileService.changePassword(currentPassword, newPassword);
      setChangePasswordModalOpen(false);
      setPasswordSuccessModalOpen(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setPasswordError(typeof msg === "string" ? msg : "Failed to update password. Please check your current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="space-y-5 pb-10 max-w-[1280px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 sm:p-8 lg:p-9 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF8FA] text-[#005C66] flex items-center justify-center shrink-0">
              <Building2 className="w-4.5 h-4.5 text-[#005C66]" />
            </div>
            <h2 className="text-[18px] sm:text-[19px] font-bold font-poppins text-gray-900">
              Company Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                COMPANY NAME
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full px-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={companyEmail}
                    className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-12 pr-6 text-[13px] sm:text-[14px] text-gray-700 border-none focus:outline-none cursor-default select-none shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-12 pr-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                REGISTERED ADDRESS
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full px-6 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-9 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EAF8FA] text-[#005C66] flex items-center justify-center shrink-0">
                <Globe className="w-4.5 h-4.5 text-[#005C66]" />
              </div>
              <h2 className="text-[18px] sm:text-[19px] font-bold font-poppins text-gray-900">
                Language
              </h2>
            </div>

            <p className="text-[12px] sm:text-[13px] text-gray-500 font-inter">
              Choose your preferred interface language.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className="w-full h-[48px] px-5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors bg-[#F4F5F7] hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🇺🇸</span>
                  <span className="text-[13px] sm:text-[14px] font-medium text-gray-800">English</span>
                </div>
                {language === "en" && (
                  <div className="w-5 h-5 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className="w-full h-[48px] px-5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors bg-[#F4F5F7] hover:bg-gray-100 text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🇸🇦</span>
                  <span className="text-[13px] sm:text-[14px] font-medium text-gray-800">Arabic</span>
                </div>
                {language === "ar" && (
                  <div className="w-5 h-5 rounded-full bg-[#005C66] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 font-inter">
              LOGOUT
            </p>
            <button
              type="button"
              onClick={() => setLogoutModalOpen(true)}
              className="h-[42px] sm:h-[44px] px-8 rounded-full border border-gray-300 text-[#D9383A] hover:bg-red-50/50 text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#EAF8FA] text-[#005C66] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#005C66]" />
          </div>
          <div>
            <h2 className="text-[17px] sm:text-[18px] font-bold font-poppins text-gray-900">
              Security Settings
            </h2>
            <p className="text-[12px] sm:text-[13px] text-gray-400 font-inter mt-0.5">
              Update your password
            </p>
          </div>
        </div>

        <div className="bg-[#F4F5F7] rounded-xl py-5 pl-6 pr-2.5 flex items-center justify-between gap-4 sm:gap-6 flex-1 max-w-[560px] shadow-xs">
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1 font-inter">
              CURRENT PASSWORD
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[15px] sm:text-[17px] tracking-widest text-gray-700 font-mono leading-none">
                ••••••••••••••••
              </span>
              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="h-7 w-[1px] bg-gray-200 shrink-0" />

          <button
            type="button"
            onClick={() => {
              setChangePasswordModalOpen(true);
              setPasswordError("");
            }}
            className="h-[40px] sm:h-[42px] px-6 rounded-full border border-primary text-primary hover:bg-primary hover:text-white text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer bg-white shrink-0 shadow-2xs"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 gap-3">
        {saveError && <p className="text-xs text-red-600 font-medium mr-2">{saveError}</p>}
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving || loading}
          className={`h-[42px] sm:h-[44px] px-9 rounded-full text-[12px] sm:text-[13px] font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50 ${
            saveSuccess
              ? "bg-[#22C55E] text-white"
              : "bg-[#005C66] text-white hover:bg-[#004d55]"
          }`}
        >
          {saving ? "Saving..." : saveSuccess ? "Saved Successfully!" : "Save Changes"}
        </button>
      </div>

      {changePasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 animate-in fade-in duration-200"
          onClick={() => setChangePasswordModalOpen(false)}
        >
          <div
            className="bg-white rounded-[36px] p-7 sm:p-9 lg:p-10 max-w-[540px] w-full relative shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setChangePasswordModalOpen(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-[20px] sm:text-[22px] font-bold font-poppins text-gray-900 mb-1">
                Change Password
              </h3>
              <p className="text-[12px] sm:text-[13px] text-gray-500 font-inter">
                Update security credentials for {userName}
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} noValidate className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                  CURRENT PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-12 pr-12 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
                  />
                  <div
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-12 pr-12 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
                  />
                  <div
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <PasswordStrengthBar password={newPassword} />

              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 font-inter">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-[48px] sm:h-[50px] bg-[#F4F5F7] rounded-full pl-12 pr-12 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-xs"
                  />
                  <div
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {passwordError && (
                <p className="text-xs text-red-600 font-medium">{passwordError}</p>
              )}

              <div className="flex items-center justify-center gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={() => setChangePasswordModalOpen(false)}
                  className="h-[44px] px-8 rounded-full border border-gray-300 text-[#D9383A] hover:bg-red-50/50 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="h-[44px] px-8 rounded-full bg-[#005C66] text-white hover:bg-[#004d55] text-[13px] font-medium cursor-pointer transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {passwordLoading ? "Updating..." : "Update Password →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={passwordSuccessModalOpen}
        onClose={() => setPasswordSuccessModalOpen(false)}
        title="Password Reset Successfully"
        message="Now You can login with your new password."
        actionText="Done"
        onAction={() => setPasswordSuccessModalOpen(false)}
      />

      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 animate-in fade-in duration-200"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-white rounded-[36px] p-8 sm:p-10 max-w-[440px] w-full relative text-center shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLogoutModalOpen(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-red-50 text-[#D9383A] flex items-center justify-center mx-auto mb-2">
              <LogOut className="w-7 h-7 text-[#D9383A]" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold font-poppins text-gray-900">
              Confirm Logout
            </h3>

            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed max-w-[320px] mx-auto mb-6 font-inter">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="h-[44px] px-8 rounded-full border border-gray-300 text-[#D9383A] hover:bg-red-50/50 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="h-[44px] px-8 rounded-full bg-[#005C66] text-white hover:bg-[#004d55] text-[13px] font-medium cursor-pointer transition-colors shadow-xs flex items-center justify-center"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
