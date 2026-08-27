"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe,
  Lock,
  LogOut,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { cn } from "@/utils/cn";

export default function SettingsPage() {
  const router = useRouter();

  // Company Info State
  const [companyName, setCompanyName] = useState("WhiteLine Global");
  const [companyEmail, setCompanyEmail] = useState("contact@whiteline.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [address, setAddress] = useState("123 Luxury Ave, Suite 400, Manhattan, New York, NY 10001");

  // Language State
  const [language, setLanguage] = useState<"en" | "ar">("en");

  // Modals
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessModalOpen, setPasswordSuccessModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordModalOpen(false);
    setPasswordSuccessModalOpen(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold font-poppins text-gray-900">Settings</h1>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company Information (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 space-y-6">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#005C66]" />
            <h2 className="text-base font-bold font-poppins text-gray-900">Company Information</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">COMPANY NAME</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">PHONE NUMBER</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">REGISTERED ADDRESS</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Language & Logout */}
        <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Globe className="w-5 h-5 text-[#005C66]" />
              <h2 className="text-base font-bold font-poppins text-gray-900">Language</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Choose your preferred interface language.</p>

            <div className="space-y-2.5">
              {/* English */}
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                  language === "en"
                    ? "bg-[#E6F6F8] border-[#005C66]/30 text-[#005C66]"
                    : "bg-gray-50/80 border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span>🇺🇸</span>
                  <span>English</span>
                </div>
                {language === "en" && <CheckCircle2 className="w-4 h-4 text-[#005C66]" />}
              </button>

              {/* Arabic */}
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                  language === "ar"
                    ? "bg-[#E6F6F8] border-[#005C66]/30 text-[#005C66]"
                    : "bg-gray-50/80 border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span>🇸🇦</span>
                  <span>Arabic</span>
                </div>
                {language === "ar" && <CheckCircle2 className="w-4 h-4 text-[#005C66]" />}
              </button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              LOGOUT
            </span>
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(true)}
              className="py-2 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Card: Security Settings */}
      <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Lock className="w-5 h-5 text-[#005C66]" />
            <h3 className="text-base font-bold font-poppins text-gray-900">Security Settings</h3>
          </div>
          <p className="text-xs text-gray-400">Update your password</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-400 tracking-widest">
            CURRENT PASSWORD •••••••••••••••
          </div>
          <Button
            variant="outline"
            onClick={() => setChangePasswordModalOpen(true)}
            className="py-2.5 px-5 text-xs font-semibold"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Save Changes Floating / Bottom Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="text-xs font-bold text-[#12A150] animate-in fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully!
          </span>
        )}
        <Button
          onClick={handleSaveSettings}
          className="py-3 px-8 text-xs font-semibold rounded-full bg-[#005C66] text-white hover:bg-[#004b54] shadow-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        maxWidth="max-w-md"
        className="p-6 md:p-8"
      >
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">Change Password</h3>
            <p className="text-xs text-gray-400">Update security credentials for your account</p>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CURRENT PASSWORD</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NEW PASSWORD</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
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

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CONFIRM PASSWORD</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangePasswordModalOpen(false)}
              className="flex-1 py-2.5 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white"
            >
              Update Password →
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Reset Success Modal */}
      <SuccessModal
        isOpen={passwordSuccessModalOpen}
        onClose={() => setPasswordSuccessModalOpen(false)}
        title="Password Reset Successfully"
        message="Now You can login with your new password."
        actionText="Done"
        onAction={() => setPasswordSuccessModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        maxWidth="max-w-sm"
        className="text-center p-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <LogOut className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">Confirm Logout</h3>
          <p className="text-xs text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 py-2.5 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white"
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
