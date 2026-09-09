import React from "react";
import { cn } from "@/utils/cn";

export interface PasswordCriteria {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const getPasswordCriteria = (password: string): PasswordCriteria => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
};

export const getPasswordScore = (criteria: PasswordCriteria): number => {
  let score = 0;
  if (criteria.hasMinLength) score++;
  if (criteria.hasUppercase) score++;
  if (criteria.hasNumber) score++;
  if (criteria.hasSpecialChar) score++;
  return score;
};

export const isPasswordValid = (password: string): boolean => {
  const c = getPasswordCriteria(password);
  return c.hasMinLength && c.hasUppercase && c.hasNumber && c.hasSpecialChar;
};

interface PasswordStrengthBarProps {
  password: string;
  className?: string;
}

export function PasswordStrengthBar({
  password,
  className,
}: PasswordStrengthBarProps) {
  if (!password) return null;

  const criteria = getPasswordCriteria(password);
  const score = getPasswordScore(criteria); // 0 to 4

  return (
    <div className={cn("pt-0.5 animate-in fade-in duration-200", className)}>
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {[1, 2, 3, 4].map((step) => {
          let bg = "bg-gray-200";
          if (step <= score) {
            if (score === 1) bg = "bg-red-500";
            else if (score <= 3) bg = "bg-amber-500";
            else bg = "bg-[#22C55E]";
          }
          return (
            <div
              key={step}
              className={cn("h-1 rounded-full transition-all duration-300", bg)}
            />
          );
        })}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 block">Password strength</span>
    </div>
  );
}
