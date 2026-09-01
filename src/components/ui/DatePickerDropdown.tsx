"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatDateToYMD, getRangeFromPreset } from "@/utils/dateFilterUtils";

export interface DatePickerValue {
  preset: string; // "All" | "Today" | "Yesterday" | "This Week" | "This Month" | "Last 30 Days" | "Custom"
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  label: string;
}

interface DatePickerDropdownProps {
  defaultValue?: string;
  onSelectRange?: (value: DatePickerValue) => void;
  className?: string;
  buttonClassName?: string;
  labelPrefix?: string; // e.g. "Date" or "Date Range"
}

const PRESET_OPTIONS = ["All", "Today", "Yesterday", "This Week", "This Month", "Last 30 Days", "Custom Range"];

export function DatePickerDropdown({
  defaultValue = "All",
  onSelectRange,
  className,
  buttonClassName,
  labelPrefix = "Date"
}: DatePickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(defaultValue.replace("Date: ", "").replace("Date Range: ", "").trim());
  const [isCustomMode, setIsCustomMode] = useState(false);

  const todayStr = formatDateToYMD(new Date());
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPreset = (preset: string) => {
    if (preset === "Custom Range") {
      setIsCustomMode(true);
      return;
    }

    setIsCustomMode(false);
    setSelectedPreset(preset);
    setIsOpen(false);

    const range = getRangeFromPreset(preset);
    const displayLabel = preset === "All" ? `${labelPrefix}: All` : `${labelPrefix}: ${preset}`;

    if (onSelectRange) {
      onSelectRange({
        preset,
        startDate: range.startDate,
        endDate: range.endDate,
        label: displayLabel
      });
    }
  };

  const handleApplyCustom = () => {
    if (!startDate || !endDate) return;
    if (new Date(startDate) > new Date(endDate)) return;
    setSelectedPreset("Custom");
    setIsCustomMode(false);
    setIsOpen(false);

    const displayLabel = `${startDate} - ${endDate}`;
    if (onSelectRange) {
      onSelectRange({
        preset: "Custom",
        startDate,
        endDate,
        label: displayLabel
      });
    }
  };

  const getDisplayButtonText = () => {
    if (selectedPreset === "Custom") {
      return `${startDate} - ${endDate}`;
    }
    if (selectedPreset === "All" || !selectedPreset) {
      return `${labelPrefix}: All`;
    }
    return `${labelPrefix}: ${selectedPreset}`;
  };

  return (
    <div className={cn("relative min-w-[135px]", isOpen ? "z-[999]" : "z-20", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-[38px] px-3.5 transition-colors flex items-center justify-between gap-1.5 text-[11px] font-medium text-gray-700 border-none normal-case tracking-normal shrink-0 cursor-pointer select-none",
          isOpen ? "rounded-t-xl bg-[#E6E6E6]" : "rounded-full bg-background-panel hover:bg-gray-100",
          buttonClassName
        )}
      >
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span className="truncate">{getDisplayButtonText()}</span>
        </div>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-gray-500 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 lg:left-0 min-w-[230px] bg-white rounded-b-xl rounded-tl-xl shadow-[0px_8px_30px_rgba(0,0,0,0.14)] z-[999] overflow-hidden flex flex-col border border-gray-100 border-t-0 p-1.5">
          {!isCustomMode ? (
            <div className="flex flex-col py-1">
              {PRESET_OPTIONS.map((option) => {
                const isSelected = option === selectedPreset;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectPreset(option)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-[11px] rounded-lg transition-colors flex items-center justify-between cursor-pointer",
                      isSelected ? "text-primary font-semibold bg-primary/5" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <span>{option === "All" ? "All Dates" : option}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-fs-12 font-bold text-text-primary">Select Custom Dates</span>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="text-fs-11 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                >
                  Back to presets
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-fs-10 font-semibold uppercase text-gray-500">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setStartDate(newStart);
                      if (endDate && newStart && new Date(endDate) < new Date(newStart)) {
                        setEndDate("");
                      }
                    }}
                    className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-fs-12 text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-fs-10 font-semibold uppercase text-gray-500">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-fs-12 text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="px-3 py-1.5 rounded-full text-fs-11 font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-4 py-1.5 rounded-full text-fs-11 font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
