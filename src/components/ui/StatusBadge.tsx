import React from "react";
import { cn } from "@/utils/cn";

export interface StatusBadgeProps {
  status?: string | null;
  className?: string;
  customLabel?: string;
}

export function getStatusStyle(status: string = ""): string {
  const s = status.toLowerCase().trim().replace(/[ -]/g, "_");

  switch (s) {
    // Green (Active / Success / Online / Approved / Completed / Resolved / Paid)
    case "completed":
    case "active":
    case "online":
    case "approved":
    case "paid":
    case "available":
    case "resolved":
      return "bg-[#D9F6E7] text-[#12A150]";

    // Orange / Amber (Pending / Open / Due / Expiring Soon)
    case "pending":
    case "open":
    case "pending_payment":
    case "due":
    case "due_soon":
    case "unpaid":
    case "expire_soon":
    case "expiring_soon":
      return "bg-[#FFEDE0] text-[#FF8A00]";

    // Cyan / Blue (In Review / In Progress)
    case "in_review":
    case "review":
    case "in_progress":
    case "started":
    case "en_route":
    case "arrived":
      return "bg-[#E0F2FE] text-[#0284C7]";

    // Olive / Muted Green (Assigned)
    case "assigned":
      return "bg-[#F4F7E9] text-[#5B8C36]";

    // Red / Danger (Cancelled / Rejected / Expired / Offline / Inactive)
    case "cancelled":
    case "canceled":
    case "rejected":
    case "expired":
    case "expire":
    case "offline":
    case "inactive":
    case "busy":
    case "maintenance":
    case "suspended":
    case "overdue":
      return "bg-[#FEE2E2] text-[#EF4444]";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function StatusBadge({ status, className, customLabel }: StatusBadgeProps) {
  if (!status && !customLabel) return null;

  const displayStatus = (customLabel || status || "").replace(/_/g, " ");
  const styleClass = getStatusStyle(status || customLabel || "");

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-fs-10 font-semibold tracking-wider leading-none uppercase whitespace-nowrap",
        styleClass,
        className
      )}
    >
      {displayStatus}
    </div>
  );
}
