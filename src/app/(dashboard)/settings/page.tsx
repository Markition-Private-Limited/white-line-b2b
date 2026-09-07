"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Globe, Lock, LogOut, Eye, EyeOff, Save, Mail, Phone, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { cn } from "@/utils/cn";
import profileService from "@/services/profile.service";
import authService from "@/services/auth.service";

export default function SettingsPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessModalOpen, setPasswordSuccessModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    profileService.get()
      .then((data) => {
        setCompanyName(data.client.company_name ?? "");
        setCompanyEmail(data.client.company_email ?? "");
        setPhone(data.client.company_phone ?? "");
        setAddress(data.client.company_address ?? "");
      })
      .catch(() => {
        // Fall back to stored cookie data
        const client = authService.getStoredClient();
        if (client) setCompanyName(client.company_name ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true); setSaveError("");
    try {
      await profileService.update({ company_name: companyName, company_phone: phone, company_address: address });
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
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }
    setPasswordLoading(true); setPasswordError("");
    try {
      await profileService.changePassword(currentPassword, newPassword);
      setChangePasswordModalOpen(false);
      setPasswordSuccessModalOpen(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setPasswordError(typeof msg === "string" ? msg : "Failed to update password.");
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
    <div className="space-y-4">
      <div>
        <h1 className="h1 font-bold text-text-primary">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Company Information */}
        <div className="lg:col-span-2 card-base p-6 lg:p-7 space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Company Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="COMPANY NAME" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" icon={<Building2 className="w-4 h-4" />} />
            <FormInput label="COMPANY EMAIL" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Enter company email" icon={<Mail className="w-4 h-4" />} readOnly />
            <FormInput label="PHONE NUMBER" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" icon={<Phone className="w-4 h-4" />} />
            <FormInput label="COMPANY ADDRESS" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" icon={<MapPin className="w-4 h-4" />} />
          </div>

          {/* Language */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-fs-13 font-bold font-poppins text-text-primary">Language Preference</h3>
            </div>
            <div className="flex items-center gap-2">
              {(["en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-5 py-2 rounded-full text-fs-12 font-semibold transition-colors cursor-pointer",
                    language === lang ? "bg-primary text-white shadow-sm" : "bg-input-bg text-text-secondary hover:bg-gray-200"
                  )}
                >
                  {lang === "en" ? "English" : "العربية"}
                </button>
              ))}
            </div>
          </div>

          {saveError && <p className="text-fs-11 text-red-600">{saveError}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSaveSettings}
              isLoading={saving || loading}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-fs-12 font-medium transition-colors",
                saveSuccess ? "bg-success text-white" : "bg-primary text-white hover:bg-primary-dark"
              )}
            >
              <Save className="w-4 h-4" />
              {saveSuccess ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Right: Security + Logout */}
        <div className="flex flex-col gap-4">
          {/* Security Card */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Security Settings</h2>
            </div>
            <p className="text-fs-12 text-text-secondary leading-relaxed">
              Keep your account secure by updating your password regularly.
            </p>
            <Button
              onClick={() => { setChangePasswordModalOpen(true); setPasswordError(""); }}
              variant="outline"
              className="w-full py-2.5 text-fs-12 font-medium flex items-center justify-center gap-2 rounded-full"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>

          {/* Logout Card */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-error" />
              <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Logout</h2>
            </div>
            <p className="text-fs-12 text-text-secondary">Sign out from the B2B portal.</p>
            <button
              type="button"
              onClick={() => setLogoutModalOpen(true)}
              className="w-full py-2.5 rounded-full border border-error text-error text-fs-12 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={changePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} maxWidth="max-w-md" className="p-6 md:p-8">
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Change Password</h3>
            <p className="text-fs-11 text-gray-400">Update your account password</p>
          </div>
          <FormInput label="CURRENT PASSWORD" type={showPassword ? "text" : "password"} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" icon={<Lock className="w-4 h-4" />} rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} onRightIconClick={() => setShowPassword(!showPassword)} />
          <FormInput label="NEW PASSWORD" type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" icon={<Lock className="w-4 h-4" />} />
          <FormInput label="CONFIRM PASSWORD" type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" icon={<Lock className="w-4 h-4" />} />
          {passwordError && <p className="text-fs-11 text-red-600">{passwordError}</p>}
          <div className="flex items-center gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setChangePasswordModalOpen(false)} className="flex-1 py-2.5 text-fs-12">Cancel</Button>
            <Button type="submit" isLoading={passwordLoading} className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark">Update Password →</Button>
          </div>
        </form>
      </Modal>

      <SuccessModal isOpen={passwordSuccessModalOpen} onClose={() => setPasswordSuccessModalOpen(false)} title="Password Updated" message="Your password has been changed successfully." actionText="Done" onAction={() => setPasswordSuccessModalOpen(false)} />

      {/* Logout Confirmation Modal */}
      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} maxWidth="max-w-sm" className="p-6 md:p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center">
            <LogOut className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Confirm Logout</h3>
            <p className="text-fs-12 text-text-secondary">Are you sure you want to sign out?</p>
          </div>
          <div className="flex items-center gap-3 w-full">
            <Button type="button" variant="outline" onClick={() => setLogoutModalOpen(false)} className="flex-1 py-2.5 text-fs-12">Cancel</Button>
            <button type="button" onClick={handleLogout} className="flex-1 py-2.5 rounded-full bg-error text-white text-fs-12 font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Yes, Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
