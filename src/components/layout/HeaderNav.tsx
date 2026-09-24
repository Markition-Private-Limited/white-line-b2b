"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Info,
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  FileCheck,
  Users,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import authService from "@/services/auth.service";
import notificationsService, { type Notification } from "@/services/notifications.service";
import { onForegroundMessage } from "@/lib/firebase";

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  service_request_approved: CheckCircle2,
  service_request_rejected: AlertCircle,
  complaint_status_changed: AlertCircle,
  invoice_created: Clock,
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();

  const spocUser = authService.getStoredUser();
  const b2bClient = authService.getStoredClient();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [mobileComplaintsOpen, setMobileComplaintsOpen] = useState(false);

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [serviceClicked, setServiceClicked] = useState(false);
  const [complaintsMenuOpen, setComplaintsMenuOpen] = useState(false);
  const [complaintsClicked, setComplaintsClicked] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [readPage, setReadPage] = useState(1);
  const [hasMoreRead, setHasMoreRead] = useState(false);
  const [loadingMoreRead, setLoadingMoreRead] = useState(false);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  const serviceRef = useRef<HTMLDivElement>(null);
  const complaintsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifListRef = useRef<HTMLDivElement>(null);

  const serviceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const complaintsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServiceOpen(false);
    setMobileComplaintsOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const loadNotifications = (page = 1) => {
    notificationsService.list(page)
      .then((res) => {
        setUnreadNotifications(res.unread);
        if (page === 1) {
          setReadNotifications(res.read);
        } else {
          setReadNotifications((prev) => [...prev, ...res.read]);
        }
        setReadPage(res.read_page);
        setHasMoreRead(res.has_more_read);
        setNotificationsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
      });
  };

  const handleNotifListScroll = () => {
    const el = notifListRef.current;
    if (!el || loadingMoreRead || !hasMoreRead) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (!nearBottom) return;

    setLoadingMoreRead(true);
    notificationsService.list(readPage + 1)
      .then((res) => {
        setReadNotifications((prev) => [...prev, ...res.read]);
        setReadPage(res.read_page);
        setHasMoreRead(res.has_more_read);
      })
      .catch((err) => {
        console.error("Failed to load more notifications:", err);
      })
      .finally(() => setLoadingMoreRead(false));
  };

  const handleNotificationClick = (n: Notification) => {
    if (n.is_read) return;
    notificationsService.markRead(n.id).catch((err) => {
      console.error("Failed to mark notification read:", err);
    });
    setUnreadNotifications((prev) => prev.filter((item) => item.id !== n.id));
    setReadNotifications((prev) => [{ ...n, is_read: true }, ...prev]);
  };

  const handleMarkAllRead = () => {
    if (unreadNotifications.length === 0) return;
    notificationsService.markAllRead().catch((err) => {
      console.error("Failed to mark all notifications read:", err);
    });
    setReadNotifications((prev) => [...unreadNotifications.map((n) => ({ ...n, is_read: true })), ...prev]);
    setUnreadNotifications([]);
  };

  const handleServiceMouseEnter = () => {
    if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
    if (!serviceClicked) setServiceMenuOpen(true);
  };

  const handleServiceMouseLeave = () => {
    if (!serviceClicked) {
      serviceTimeoutRef.current = setTimeout(() => {
        setServiceMenuOpen(false);
      }, 150);
    }
  };

  const handleComplaintsMouseEnter = () => {
    if (complaintsTimeoutRef.current) clearTimeout(complaintsTimeoutRef.current);
    if (!complaintsClicked) setComplaintsMenuOpen(true);
  };

  const handleComplaintsMouseLeave = () => {
    if (!complaintsClicked) {
      complaintsTimeoutRef.current = setTimeout(() => {
        setComplaintsMenuOpen(false);
      }, 150);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setServiceMenuOpen(false);
        setServiceClicked(false);
      }
      if (complaintsRef.current && !complaintsRef.current.contains(event.target as Node)) {
        setComplaintsMenuOpen(false);
        setComplaintsClicked(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
      if (complaintsTimeoutRef.current) clearTimeout(complaintsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (notifMenuOpen && !notificationsLoaded) {
      loadNotifications(1);
    }
  }, [notifMenuOpen, notificationsLoaded]);

  useEffect(() => {
    const unsubscribe = onForegroundMessage(() => {
      loadNotifications(1);
    });
    return unsubscribe;
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkStyles = (path: string) =>
    cn(
      "px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer select-none flex items-center gap-1 xl:gap-1.5",
      isActive(path)
        ? "bg-[#005C66] text-white shadow-sm font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
    );

  const handleLogout = () => {
    authService.logout();
    setLogoutModalOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-5 lg:px-6 h-18 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/dashboard_logo.png"
              alt="WhiteLine B2B Portal Logo"
              width={170}
              height={45}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center: Navigation Links (Desktop only, lg+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-gray-50/90 p-1.5 rounded-full border border-gray-100">
            <Link href="/" className={navLinkStyles("/")}>
              Dashboard
            </Link>

            {/* Service Requests with Dropdown */}
            <div 
              className="relative group" 
              ref={serviceRef}
              onMouseEnter={handleServiceMouseEnter}
              onMouseLeave={handleServiceMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setServiceClicked(!serviceClicked);
                  setServiceMenuOpen(!serviceClicked);
                }}
                className={navLinkStyles("/service-requests")}
              >
                Service Requests
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform group-hover:rotate-180", serviceMenuOpen && "rotate-180")} />
              </button>

              {serviceMenuOpen && (
                <div className="absolute top-full pt-2 left-0 w-52 z-[60]">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95">
                    <Link
                      href="/service-requests"
                      onClick={() => {
                        setServiceMenuOpen(false);
                        setServiceClicked(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      All Requests
                    </Link>
                    <Link
                      href="/service-requests/create"
                      onClick={() => {
                        setServiceMenuOpen(false);
                        setServiceClicked(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                    >
                      <PlusCircle className="w-4 h-4 text-gray-400" />
                      Create New Request
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/invoices" className={navLinkStyles("/invoices")}>
              Invoices
            </Link>

            {/* Complaints with Dropdown */}
            <div 
              className="relative group" 
              ref={complaintsRef}
              onMouseEnter={handleComplaintsMouseEnter}
              onMouseLeave={handleComplaintsMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setComplaintsClicked(!complaintsClicked);
                  setComplaintsMenuOpen(!complaintsClicked);
                }}
                className={navLinkStyles("/complaints")}
              >
                Complaints
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform group-hover:rotate-180", complaintsMenuOpen && "rotate-180")} />
              </button>

              {complaintsMenuOpen && (
                <div className="absolute top-full pt-2 left-0 w-52 z-[60]">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95">
                    <Link
                      href="/complaints"
                      onClick={() => {
                        setComplaintsMenuOpen(false);
                        setComplaintsClicked(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                    >
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      All Complaints
                    </Link>
                    <Link
                      href="/complaints/create"
                      onClick={() => {
                        setComplaintsMenuOpen(false);
                        setComplaintsClicked(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#005C66]"
                    >
                      <PlusCircle className="w-4 h-4 text-gray-400" />
                      Create New Complaint
                    </Link>
                  </div>
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

          {/* Right: Notification, Profile, & Mobile/Tablet Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#00B4D8]" />
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[60] animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Notifications</span>
                    {unreadNotifications.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-semibold text-[#005C66] bg-[#E6F6F8] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#d5eef1]"
                      >
                        Mark all read
                      </button>
                    ) : null}
                  </div>
                  <div
                    ref={notifListRef}
                    onScroll={handleNotifListScroll}
                    className="space-y-2.5 max-h-80 overflow-y-auto"
                  >
                    {unreadNotifications.length === 0 && readNotifications.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">No notifications yet</p>
                    )}
                    {unreadNotifications.map((n) => {
                      const Icon = NOTIFICATION_ICONS[n.notification_type] ?? Info;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className="flex gap-2.5 p-2 rounded-xl bg-[#E6F6F8] hover:bg-[#d5eef1] text-xs text-gray-700 cursor-pointer"
                        >
                          <Icon className="w-4 h-4 text-[#005C66] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{n.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{formatRelativeTime(n.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                    {readNotifications.map((n) => {
                      const Icon = NOTIFICATION_ICONS[n.notification_type] ?? Info;
                      return (
                        <div
                          key={n.id}
                          className="flex gap-2.5 p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 text-xs text-gray-700"
                        >
                          <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{n.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{formatRelativeTime(n.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                    {loadingMoreRead && (
                      <p className="text-[10px] text-gray-400 text-center py-2">Loading more...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1.5 p-1 pl-1 pr-1.5 sm:pl-1.5 sm:pr-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                aria-label="User profile"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-[#005C66] text-white flex items-center justify-center shrink-0">
                  {(spocUser as any)?.profile_image ? (
                    <Image
                      src={(spocUser as any).profile_image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-semibold">{getInitials(spocUser?.full_name)}</span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{spocUser?.full_name ?? "User"}</p>
                    <p className="text-[10px] text-gray-500">{b2bClient?.company_name ?? "WhiteLine B2B"} • {spocUser?.role ?? "Member"}</p>
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

            {/* Mobile / Tablet Hamburger Toggle Button (lg:hidden) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Navigation Drawer with Framer Motion Smooth Sliding */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop overlay with smooth fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel with smooth spring slide */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed inset-y-0 right-0 w-[85%] sm:w-80 max-w-sm bg-white shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/dashboard_logo.png"
                    alt="WhiteLine B2B Portal Logo"
                    width={130}
                    height={34}
                    className="h-7 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Banner inside Drawer */}
              <div className="p-4 bg-gradient-to-r from-[#ECF3F4] to-[#E6F6F8] border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#005C66] text-white shadow-xs border border-gray-200 flex items-center justify-center shrink-0">
                  {(spocUser as any)?.profile_image ? (
                    <Image
                      src={(spocUser as any).profile_image}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-sm font-bold">{getInitials(spocUser?.full_name)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{spocUser?.full_name ?? "User"}</p>
                  <p className="text-[11px] text-gray-600 truncate">{b2bClient?.company_name ?? "WhiteLine B2B"}</p>
                  <span className="inline-block px-2 py-0.5 mt-0.5 bg-white/80 rounded-full text-[10px] font-medium text-[#005C66] border border-[#005C66]/20">
                    {spocUser?.role ?? "SPOC"}
                  </span>
                </div>
              </div>

              {/* Nav Links Scroll Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">Navigation Menu</p>

                {/* Dashboard */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive("/")
                      ? "bg-[#005C66] text-white shadow-sm font-semibold"
                      : "text-gray-700 hover:bg-gray-100/80"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </Link>

                {/* Service Requests Submenu */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left cursor-pointer",
                      isActive("/service-requests")
                        ? "bg-[#005C66]/10 text-[#005C66] font-semibold"
                        : "text-gray-700 hover:bg-gray-100/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>Service Requests</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        mobileServiceOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileServiceOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden pl-6 pr-2 py-1 space-y-1 mt-1 border-l-2 border-[#005C66]/20 ml-4"
                      >
                        <Link
                          href="/service-requests"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            pathname === "/service-requests"
                              ? "bg-[#005C66] text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          All Requests
                        </Link>
                        <Link
                          href="/service-requests/create"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            pathname === "/service-requests/create"
                              ? "bg-[#005C66] text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Create New Request
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Invoices */}
                <Link
                  href="/invoices"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive("/invoices")
                      ? "bg-[#005C66] text-white shadow-sm font-semibold"
                      : "text-gray-700 hover:bg-gray-100/80"
                  )}
                >
                  <Receipt className="w-4 h-4 shrink-0" />
                  <span>Invoices</span>
                </Link>

                {/* Complaints Submenu */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileComplaintsOpen(!mobileComplaintsOpen)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left cursor-pointer",
                      isActive("/complaints")
                        ? "bg-[#005C66]/10 text-[#005C66] font-semibold"
                        : "text-gray-700 hover:bg-gray-100/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Complaints</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        mobileComplaintsOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileComplaintsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden pl-6 pr-2 py-1 space-y-1 mt-1 border-l-2 border-[#005C66]/20 ml-4"
                      >
                        <Link
                          href="/complaints"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            pathname === "/complaints"
                              ? "bg-[#005C66] text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          All Complaints
                        </Link>
                        <Link
                          href="/complaints/create"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            pathname === "/complaints/create"
                              ? "bg-[#005C66] text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Create New Complaint
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contracts */}
                <Link
                  href="/contracts"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive("/contracts")
                      ? "bg-[#005C66] text-white shadow-sm font-semibold"
                      : "text-gray-700 hover:bg-gray-100/80"
                  )}
                >
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>Contracts</span>
                </Link>

                {/* Users */}
                <Link
                  href="/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive("/users")
                      ? "bg-[#005C66] text-white shadow-sm font-semibold"
                      : "text-gray-700 hover:bg-gray-100/80"
                  )}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Users</span>
                </Link>

                {/* Settings */}
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive("/settings")
                      ? "bg-[#005C66] text-white shadow-sm font-semibold"
                      : "text-gray-700 hover:bg-gray-100/80"
                  )}
                >
                  <SettingsIcon className="w-4 h-4 shrink-0" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/70">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="flex-1 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-600"
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


