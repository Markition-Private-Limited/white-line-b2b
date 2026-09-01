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
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
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
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <h1 className="h1 font-bold text-text-primary">Settings</h1>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Company Information (2 Cols) */}
        <div className="lg:col-span-2 card-base p-6 lg:p-7 space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Company Information</h2>
          </div>

          <div className="space-y-4">
            <FormInput
              label="COMPANY NAME"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              icon={<Building2 className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="EMAIL ADDRESS"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              <FormInput
                label="PHONE NUMBER"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>

            <FormInput
              label="REGISTERED ADDRESS"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Right Column: Language & Logout */}
        <div className="card-base p-6 lg:p-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Language</h2>
            </div>
            <p className="text-fs-11 text-gray-400 mb-4">Choose your preferred interface language.</p>

            <div className="space-y-2.5">
              {/* English */}
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-full border text-fs-12 font-medium transition-all cursor-pointer",
                  language === "en"
                    ? "bg-primary-50 border-primary/30 text-primary"
                    : "bg-input-bg border-transparent text-text-secondary hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2.5 pl-2">
                  <span>🇺🇸</span>
                  <span>English</span>
                </div>
                {language === "en" && <CheckCircle2 className="w-4 h-4 text-primary pr-2" />}
              </button>

              {/* Arabic */}
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-full border text-fs-12 font-medium transition-all cursor-pointer",
                  language === "ar"
                    ? "bg-primary-50 border-primary/30 text-primary"
                    : "bg-input-bg border-transparent text-text-secondary hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2.5 pl-2">
                  <span>🇸🇦</span>
                  <span>Arabic</span>
                </div>
                {language === "ar" && <CheckCircle2 className="w-4 h-4 text-primary pr-2" />}
              </button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider block mb-2">
              LOGOUT
            </span>
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(true)}
              className="py-2 px-5 text-fs-11 text-error border-error/20 hover:bg-error/5"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Card: Security Settings */}
      <div className="card-base p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-primary" />
            <h3 className="text-fs-14 font-bold font-poppins text-text-primary">Security Settings</h3>
          </div>
          <p className="text-fs-11 text-gray-400">Update your account login password</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-input-bg rounded-full px-5 py-2.5 text-fs-11 text-text-secondary tracking-widest">
            CURRENT PASSWORD •••••••••••••••
          </div>
          <Button
            variant="outline"
            onClick={() => setChangePasswordModalOpen(true)}
            className="py-2.5 px-5 text-fs-12 font-medium"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Save Changes Floating / Bottom Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="text-fs-12 font-semibold text-success animate-in fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully!
          </span>
        )}
        <Button
          onClick={handleSaveSettings}
          className="py-2.5 px-7 text-fs-12 font-medium rounded-full bg-primary text-white hover:bg-primary-dark shadow-sm flex items-center gap-2"
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
            <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Change Password</h3>
            <p className="text-fs-11 text-gray-400">Update security credentials for your account</p>
          </div>

          <FormInput
            label="CURRENT PASSWORD"
            type={showPassword ? "text" : "password"}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            icon={<Lock className="w-4 h-4" />}
          />

          <FormInput
            label="NEW PASSWORD"
            type={showPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            icon={<Lock className="w-4 h-4" />}
            rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />

          <FormInput
            label="CONFIRM PASSWORD"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangePasswordModalOpen(false)}
              className="flex-1 py-2.5 text-fs-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark"
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
          <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
            <LogOut className="w-6 h-6" />
          </div>
          <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Confirm Logout</h3>
          <p className="text-fs-12 text-text-secondary mb-6">Are you sure you want to log out of your account?</p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 py-2.5 text-fs-12 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark"
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
