import React from "react";
import { cn } from "@/utils/cn";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim().replace(/[\s_-]+/g, "_");

  let colorClasses = "bg-gray-100 text-gray-700";

  switch (normalized) {
    case "active":
    case "resolved":
    case "paid":
    case "completed":
    case "approved":
      colorClasses = "bg-[#E6F8E8] text-[#12A150]";
      break;

    case "pending":
    case "due":
    case "due_soon":
    case "unpaid":
      colorClasses = "bg-[#FFF3E6] text-[#FF8A00]";
      break;

    case "in_review":
    case "review":
    case "open":
    case "in_progress":
      colorClasses = "bg-[#E6F4FB] text-[#0099FF]";
      break;

    case "cancelled":
    case "rejected":
    case "overdue":
    case "inactive":
      colorClasses = "bg-[#FDEBEA] text-[#EA5B5B]";
      break;

    default:
      colorClasses = "bg-gray-100 text-gray-700";
      break;
  }

  const label = status?.replace(/_/g, " ").toUpperCase() || "UNKNOWN";

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase leading-none select-none",
        colorClasses,
        className
      )}
    >
      {label}
    </span>
  );
}
