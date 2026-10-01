"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput, { getCountryCallingCode, type Country, type Value } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { ChevronDown, Globe2, Search } from "lucide-react";
import { cn } from "@/utils/cn";

type CountryOption = { value?: Country; label: string };

function CountryCodeSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const SelectedFlag = value ? flags[value] : undefined;
  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search) ||
      (option.value && `+${getCountryCallingCode(option.value)}`.includes(search))
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="country-phone-input__selector">
      <button
        type="button"
        disabled={disabled}
        aria-label={`Country calling code: ${selected?.label ?? "International"}${value ? ` +${getCountryCallingCode(value)}` : ""}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          setQuery("");
          setOpen((wasOpen) => !wasOpen);
        }}
        className="country-phone-input__trigger"
      >
        <span className="country-phone-input__flag">
          {SelectedFlag ? <SelectedFlag title={selected?.label ?? value ?? "Country"} /> : <Globe2 size={18} />}
        </span>
        <span>+{value ? getCountryCallingCode(value) : ""}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="country-phone-input__menu">
          <div className="country-phone-input__search">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              autoFocus
              aria-label="Search countries"
              placeholder="Search country or code"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div role="listbox" aria-label="Choose a country" className="country-phone-input__options">
            {filteredOptions.map(({ value: country, label }) => {
              const Flag = country ? flags[country] : undefined;
              return (
                <button
                  key={country ?? "international"}
                  type="button"
                  role="option"
                  aria-selected={country === value}
                  className={`country-phone-input__option ${country === value ? "country-phone-input__option--selected" : ""}`}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="country-phone-input__flag">
                    {Flag ? <Flag title={label} /> : <Globe2 size={18} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                  <span className="text-slate-500">{country ? `+${getCountryCallingCode(country)}` : ""}</span>
                </button>
              );
            })}
            {filteredOptions.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">No countries found</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function CountryPhoneInput({
  value,
  onChange,
  invalid = false,
  compact = false,
  placeholder = "Phone number",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  compact?: boolean;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <PhoneInput
      {...props}
      defaultCountry="SA"
      addInternationalOption={false}
      countrySelectComponent={CountryCodeSelect}
      value={value as Value}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      placeholder={placeholder}
      aria-invalid={invalid}
      className={cn("country-phone-input", compact && "country-phone-input--compact", invalid && "country-phone-input--invalid")}
    />
  );
}
