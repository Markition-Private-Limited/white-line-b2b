"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Globe, Lock, LogOut, Eye, EyeOff, Save, Mail, Phone, MapPin, CheckCircle2,
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
        <div className="lg:col-span-2 card-base p-6 lg:p-7 space-y-5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Company Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormInput label="COMPANY NAME" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" icon={<Building2 className="w-4 h-4" />} />
            </div>
            <FormInput label="EMAIL ADDRESS" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Enter company email" icon={<Mail className="w-4 h-4" />} readOnly />
            <FormInput label="PHONE NUMBER" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" icon={<Phone className="w-4 h-4" />} />
            <div className="sm:col-span-2">
              <FormInput label="REGISTERED ADDRESS" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" icon={<MapPin className="w-4 h-4" />} />
            </div>
          </div>
        </div>

        {/* Right: Language + Logout */}
        <div className="flex flex-col gap-4">
          <div className="card-base p-6 lg:p-7 space-y-5 flex-1 flex flex-col">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-primary" />
                <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Language</h2>
              </div>
              <p className="text-fs-12 text-text-secondary">Choose your preferred interface language.</p>
            </div>
            
            <div className="space-y-2 flex-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer",
                  language === "en" ? "bg-gray-50 border border-gray-200" : "bg-transparent border border-transparent hover:bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-fs-13 font-medium text-text-primary">English</span>
                </div>
                {language === "en" && <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>}
              </button>
              
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer",
                  language === "ar" ? "bg-gray-50 border border-gray-200" : "bg-transparent border border-transparent hover:bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇸🇦</span>
                  <span className="text-fs-13 font-medium text-text-primary">Arabic</span>
                </div>
                {language === "ar" && <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-auto">
              <p className="text-fs-10 font-bold text-gray-text uppercase tracking-wider mb-2.5">LOGOUT</p>
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="w-fit px-6 py-2 rounded-full border border-error text-error text-fs-12 font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Security Settings */}
      <div className="card-base p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="text-fs-14 font-bold font-poppins text-text-primary">Security Settings</h2>
          </div>
          <p className="text-fs-12 text-text-secondary">Update your password</p>
        </div>
        
        <div className="flex items-end gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <label className="text-fs-10 font-bold text-gray-text uppercase tracking-wider block mb-1">CURRENT PASSWORD</label>
            <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
              <span className="text-lg tracking-widest text-text-primary leading-none mt-1">••••••••••••••••</span>
              <EyeOff className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button
            onClick={() => { setChangePasswordModalOpen(true); setPasswordError(""); }}
            variant="outline"
            className="shrink-0 rounded-full h-[38px] px-5 text-xs font-medium border-gray-300 text-text-primary hover:bg-gray-50"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-2 gap-3">
        {saveError && <p className="text-fs-11 text-red-600 mr-2">{saveError}</p>}
        <Button
          onClick={handleSaveSettings}
          isLoading={saving || loading}
          className={cn(
            "h-10 px-8 rounded-full text-fs-12 font-medium transition-colors shadow-md",
            saveSuccess ? "bg-success text-white shadow-success/20" : "bg-primary text-white hover:bg-primary-dark shadow-primary/20"
          )}
        >
          {saveSuccess ? "Saved Successfully!" : "Save Changes"}
        </Button>
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
            <Button type="button" variant="outline" onClick={() => setChangePasswordModalOpen(false)} className="flex-1 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-600">Cancel</Button>
            <Button type="submit" isLoading={passwordLoading} className="flex-1 py-2.5 text-xs font-semibold bg-primary text-white hover:bg-primary-dark">Update Password →</Button>
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
            <Button type="button" variant="outline" onClick={() => setLogoutModalOpen(false)} className="flex-1 py-2.5 text-fs-12 text-red-600 hover:bg-red-50 hover:text-red-600">Cancel</Button>
            <button type="button" onClick={handleLogout} className="flex-1 py-2.5 rounded-full bg-error text-white text-fs-12 font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Yes, Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
