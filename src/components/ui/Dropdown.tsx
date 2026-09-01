"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DropdownProps {
  options: string[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export function Dropdown({ options, defaultValue, onSelect, className, buttonClassName }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0] || "");
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
    if (defaultValue !== undefined) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className={cn("relative min-w-[130px]", isOpen ? "z-50" : "z-20", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-[39px] px-4 transition-colors flex items-center justify-between gap-1.5 text-fs-12 font-medium text-text-secondary border-none normal-case tracking-normal cursor-pointer",
          isOpen ? "rounded-t-xl bg-[#E6E6E6]" : "rounded-full bg-background-panel hover:bg-gray-100",
          buttonClassName
        )}
      >
        <span>{selected}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full min-w-max bg-white rounded-b-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] z-50 max-h-[160px] overflow-y-auto flex flex-col border border-gray-100 border-t-0 scrollbar-thin">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full text-left px-4 py-2 text-fs-12 hover:bg-gray-50 transition-colors cursor-pointer",
                selected === option ? "text-primary font-medium bg-primary/5" : "text-text-secondary"
              )}
            >
              <span className="normal-case text-fs-12 tracking-normal font-medium">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
