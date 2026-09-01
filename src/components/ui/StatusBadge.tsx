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
      return "bg-[#e8f7f0] text-[#12a150]";

    // Orange / Amber (In Progress / En Route / Arrived / Open / Expiring Soon / Pending Payment / Due Soon)
    case "in_progress":
    case "in_review":
    case "review":
    case "started":
    case "en_route":
    case "arrived":
    case "open":
    case "expire_soon":
    case "expiring_soon":
    case "pending_payment":
    case "due":
    case "due_soon":
    case "unpaid":
      return "bg-[#fff0e6] text-[#ff6b00]";

    // Olive / Muted Green (Assigned)
    case "assigned":
      return "bg-[#f4f7e9] text-[#5b8c36]";

    // Cyan / Teal (Pending / New Request)
    case "pending":
    case "new":
      return "bg-[#e6f8fa] text-[#00b4d8]";

    // Red / Danger (Cancelled / Rejected / Expired / Offline / Suspended / Inactive / Busy / Maintenance)
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
      return "bg-error/10 text-error";

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
        "inline-flex items-center justify-center px-2.5 py-1 rounded-full text-fs-9 font-bold tracking-wider leading-none uppercase whitespace-nowrap",
        styleClass,
        className
      )}
    >
      {displayStatus}
    </div>
  );
}
