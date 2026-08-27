"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings as SettingsIcon,
  FileText,
  AlertCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [complaintsMenuOpen, setComplaintsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const serviceRef = useRef<HTMLDivElement>(null);
  const complaintsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setServiceMenuOpen(false);
      }
      if (complaintsRef.current && !complaintsRef.current.contains(event.target as Node)) {
        setComplaintsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkStyles = (path: string) =>
    cn(
      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5",
      isActive(path)
        ? "bg-[#005C66] text-white shadow-sm font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
    );

  const handleLogout = () => {
    setLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="WhiteLine Logo"
                width={36}
                height={36}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-base text-gray-900 leading-tight">
                White line
              </span>
              <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mt-0.5">
                B2B PORTAL
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-gray-50/90 p-1.5 rounded-full border border-gray-100">
            <Link href="/" className={navLinkStyles("/")}>
              Dashboard
            </Link>

            {/* Service Requests with Dropdown */}
            <div className="relative" ref={serviceRef}>
              <button
                type="button"
                onClick={() => setServiceMenuOpen(!serviceMenuOpen)}
                className={navLinkStyles("/service-requests")}
              >
                Service Requests
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", serviceMenuOpen && "rotate-180")} />
              </button>

              {serviceMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    href="/service-requests"
                    onClick={() => setServiceMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    All Requests
                  </Link>
                  <Link
                    href="/service-requests/create"
                    onClick={() => setServiceMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                  >
                    <PlusCircle className="w-4 h-4 text-gray-400" />
                    Create New Request
                  </Link>
                </div>
              )}
            </div>

            <Link href="/invoices" className={navLinkStyles("/invoices")}>
              Invoices
            </Link>

            {/* Complaints with Dropdown */}
            <div className="relative" ref={complaintsRef}>
              <button
                type="button"
                onClick={() => setComplaintsMenuOpen(!complaintsMenuOpen)}
                className={navLinkStyles("/complaints")}
              >
                Complaints
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", complaintsMenuOpen && "rotate-180")} />
              </button>

              {complaintsMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    href="/complaints"
                    onClick={() => setComplaintsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                  >
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    All Complaints
                  </Link>
                  <Link
                    href="/complaints/create"
                    onClick={() => setComplaintsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                  >
                    <PlusCircle className="w-4 h-4 text-gray-400" />
                    Create New Complaint
                  </Link>
                </div>
              )}
            </div>

            <Link href="/contracts" className={navLinkStyles("/contracts")}>
              Contracts
            </Link>

            <Link href="/users" className={navLinkStyles("/users")}>
              Users
            </Link>

            <Link href="/settings" className={navLinkStyles("/settings")}>
              Settings
            </Link>
          </nav>

          {/* Right: Notification & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#00B4D8]" />
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] font-semibold text-[#005C66] bg-[#E6F6F8] px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex gap-2.5 p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
                      <CheckCircle2 className="w-4 h-4 text-[#12A150] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Service Request #SR-84920 Approved</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">10 mins ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
                      <Clock className="w-4 h-4 text-[#FF8A00] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Invoice #INV-9283 Due in 3 days</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <Image
                    src="/Avatar.png"
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">Alexander Miller</p>
                    <p className="text-[10px] text-gray-500">WhiteLine Global • Admin</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <SettingsIcon className="w-4 h-4 text-gray-400" />
                    Account Settings
                  </Link>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
          <h3 className="text-lg font-bold text-gray-900 mb-1 font-poppins">Confirm Logout</h3>
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
              className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white hover:bg-[#004b54]"
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
