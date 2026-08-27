"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer",
          checked ? "bg-[#12A150]" : "bg-gray-300"
        )}
      >
        <div
          className={cn(
            "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className={cn("text-xs font-semibold", checked ? "text-[#12A150]" : "text-gray-500")}>{label}</span>}
    </label>
  );
}
