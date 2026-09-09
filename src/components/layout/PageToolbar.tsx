import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePickerDropdown, DatePickerValue } from "@/components/ui/DatePickerDropdown";

export interface FilterDef {
  defaultValue: string;
  options?: string[];
  onSelect?: (value: string) => void;
  type?: "dropdown" | "date";
  onSelectDate?: (range: DatePickerValue) => void;
  customNode?: React.ReactNode;
}

export interface ActionDef {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  primary?: boolean;
}

export interface PageToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: FilterDef[];
  actions?: ActionDef[];
  className?: string;
  children?: React.ReactNode;
}

function MobileFilterMenu({ filters }: { filters: FilterDef[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilterIdx, setActiveFilterIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveFilterIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setActiveFilterIdx(null);
    } else {
      setIsOpen(true);
      if (filters.length === 1) {
        setActiveFilterIdx(0);
      } else {
        setActiveFilterIdx(null);
      }
    }
  };

  const currentFilter = activeFilterIdx !== null ? filters[activeFilterIdx] : null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] flex items-center justify-center transition-colors text-text-secondary border-none cursor-pointer",
          isOpen ? "rounded-t-xl bg-[#E6E6E6]" : "rounded-full bg-background-panel hover:bg-gray-100"
        )}
      >
        <Filter className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-[200px] bg-white rounded-b-xl rounded-tl-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] z-40 max-h-[220px] overflow-y-auto flex flex-col border border-gray-100 border-t-0 scrollbar-thin">
          {currentFilter === null ? (
            filters.map((filter, idx) => {
              const label = filter.defaultValue.includes(':')
                ? filter.defaultValue.split(':')[0]
                : filter.defaultValue || `Filter ${idx + 1}`;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFilterIdx(idx)}
                  className="w-full text-left px-4 py-2.5 text-fs-12 hover:bg-gray-50 transition-colors flex items-center justify-between text-text-secondary font-medium cursor-pointer"
                >
                  {label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              );
            })
          ) : (
            <>
              {filters.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveFilterIdx(null)}
                  className="w-full text-left px-3 py-2 text-fs-12 hover:bg-gray-50 transition-colors flex items-center gap-2 text-text-secondary border-b border-gray-100 font-medium bg-gray-50/50 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}
              {currentFilter.type === "date" ? (
                <div className="p-2">
                  <DatePickerDropdown
                    defaultValue={currentFilter.defaultValue}
                    onSelectRange={(range) => {
                      currentFilter.onSelectDate?.(range);
                      setIsOpen(false);
                      setActiveFilterIdx(null);
                    }}
                  />
                </div>
              ) : (
                currentFilter.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      currentFilter.onSelect?.(option);
                      setIsOpen(false);
                      setActiveFilterIdx(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-fs-12 hover:bg-gray-50 transition-colors text-text-secondary font-medium cursor-pointer"
                  >
                    <span className="normal-case text-fs-12 tracking-normal font-medium">{option}</span>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function PageToolbar({
  searchPlaceholder = "Search...",
  onSearch,
  searchValue,
  filters,
  actions,
  className,
  children
}: PageToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between bg-white rounded-full p-1.5 sm:p-2.0 mt-1 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.03)] border border-gray-100/80 relative z-30", className)}>
      <div className="flex-1 min-w-[200px] max-w-[383px] relative shrink-0 sm:shrink">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full h-[42px] sm:h-[44px] bg-background-panel border-none rounded-full pl-10 pr-4 text-[12px] sm:text-[13px] text-gray-800 placeholder:text-gray-400 placeholder:text-[12px] sm:placeholder:text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2.5 ml-4 shrink-0">
        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-2.5">
          {filters?.map((filter, idx) => {
            if (filter.customNode) {
              return <React.Fragment key={idx}>{filter.customNode}</React.Fragment>;
            }
            if (filter.type === "date") {
              return (
                <DatePickerDropdown
                  key={idx}
                  defaultValue={filter.defaultValue}
                  onSelectRange={filter.onSelectDate}
                />
              );
            }
            return (
              <Dropdown
                key={idx}
                options={filter.options || []}
                defaultValue={filter.defaultValue}
                onSelect={filter.onSelect}
              />
            );
          })}
        </div>

        {/* Mobile Filter Menu */}
        {filters && filters.length > 0 && (
          <div className="lg:hidden">
            <MobileFilterMenu filters={filters} />
          </div>
        )}

        {actions?.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={action.onClick}
            className={cn(
              "h-[42px] sm:h-[44px] w-[42px] sm:w-[44px] lg:w-auto lg:px-5 flex items-center justify-center gap-2 transition-colors rounded-full text-[12px] sm:text-[13px] font-medium shrink-0 whitespace-nowrap cursor-pointer",
              action.primary
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white border border-gray-200 text-primary hover:bg-gray-50",
              action.className
            )}
          >
            {action.icon}
            <span className={cn("hidden lg:inline", action.primary && "inline")}>{action.label}</span>
          </button>
        ))}
        {children}
      </div>
    </div>
  );
}
