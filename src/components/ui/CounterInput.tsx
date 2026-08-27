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
}

export function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  className,
}: CounterInputProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">{label}</label>
      <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 h-[50px] transition-colors focus-within:border-[#005C66] focus-within:bg-white">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="text-base font-bold text-gray-800 tabular-nums">{value}</span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
