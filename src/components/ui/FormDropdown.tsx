"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FormDropdownOption {
  label: string;
  value: string;
}

export interface FormDropdownProps {
  label: string;
  options: (string | FormDropdownOption)[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onSelect?: (value: string) => void;
  className?: string;
  containerClassName?: string;
  name?: string;
  searchable?: boolean;
  direction?: "down" | "up";
  error?: string;
}

export function FormDropdown({
  label,
  options,
  placeholder = "Select",
  defaultValue,
  value,
  onSelect,
  className,
  containerClassName,
  name,
  searchable = false,
  direction = "down",
  error,
}: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || "");
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (option: string | FormDropdownOption) => {
    const val = typeof option === "string" ? option : option.value;
    setSelected(val);
    setIsOpen(false);
    setSearchQuery("");
    if (onSelect) onSelect(val);
  };

  const selectedLabel = (() => {
    if (!selected) return placeholder;
    const foundOption = options.find(opt => {
      if (typeof opt === "string") return opt === selected;
      return opt.value === selected;
    });
    if (foundOption) {
      return typeof foundOption === "string" ? foundOption : foundOption.label;
    }
    return selected;
  })();

  const isUp = direction === "up";

  return (
    <div className={cn("w-full", containerClassName)} ref={dropdownRef}>
      <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
        {label}
      </label>
      
      <div className="relative w-full">
        {name && (
          <input type="hidden" name={name} value={selected} />
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full border-none h-10 px-4 flex items-center justify-between text-[12px] font-normal transition-all cursor-pointer",
            isOpen
              ? isUp
                ? "bg-white rounded-b-[20px] rounded-t-none shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 z-30 relative"
                : "bg-white rounded-t-[20px] rounded-b-none shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 z-30 relative"
              : "bg-input-bg rounded-full",
            !selected ? "text-input-placeholder font-light" : "text-text-primary",
            error && "ring-1 ring-error",
            className
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className={cn("w-4 h-4 text-text-secondary transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute left-0 w-full bg-white z-30 overflow-hidden flex flex-col border border-gray-100 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]",
              isUp
                ? "bottom-full rounded-t-[21px] border-b-0"
                : "top-full rounded-b-[21px] border-t-0"
            )}
          >
            {searchable && (
              <div className="p-2 border-b border-gray-100 shrink-0">
                <input 
                  type="text"
                  autoFocus
                  className="w-full h-[32px] px-3 text-fs-12 bg-gray-50 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-primary/20 text-text-primary"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="overflow-y-auto max-h-[155px] scrollbar-thin">
              {(() => {
                const filteredOptions = options.filter(option => {
                  if (!searchable || !searchQuery) return true;
                  const labelStr = typeof option === "string" ? option : option.label;
                  return labelStr.toLowerCase().includes(searchQuery.toLowerCase());
                });

                if (filteredOptions.length === 0) {
                  return (
                    <div className="w-full text-center px-4 py-3 text-fs-12 text-gray-400">
                      No options available
                    </div>
                  );
                }

                return filteredOptions.map((option, idx) => {
                  const optVal = typeof option === "string" ? option : option.value;
                  const optLabel = typeof option === "string" ? option : option.label;
                  return (
                    <button
                      type="button"
                      key={optVal || idx}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-fs-12 hover:bg-gray-50 transition-colors cursor-pointer",
                        selected === optVal ? "text-primary font-medium bg-primary/5" : "text-text-secondary"
                      )}
                    >
                      <span className="normal-case text-fs-12 tracking-normal font-medium">{optLabel}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-fs-10 text-error font-medium mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
