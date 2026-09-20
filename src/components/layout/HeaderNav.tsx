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
  Info,
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
      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5",
      isActive(path)
        ? "bg-[#005C66] text-white shadow-sm font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
    );

  const handleLogout = () => {
    authService.logout();
    setLogoutModalOpen(false);
    router.push("/login");
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
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-gray-50/90 p-1.5 rounded-full border border-gray-100">
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

          {/* Right: Notification & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#00B4D8]" />
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[60] animate-in fade-in zoom-in-95">
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
