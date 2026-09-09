"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface CounterInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
  error?: string;
}

export function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  className,
  error,
}: CounterInputProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <label className="text-[10px] font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
        {label}
      </label>
      <div className={cn(
        "flex items-center justify-between bg-input-bg border-none rounded-full px-4 h-10 transition-all",
        error && "ring-1 ring-error"
      )}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-gray-200/50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="text-[12px] font-semibold text-text-primary tabular-nums">{value}</span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-gray-200/50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {error && (
        <p className="text-[10px] text-error font-medium mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
