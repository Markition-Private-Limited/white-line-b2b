import React from "react";
import { cn } from "@/utils/cn";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  containerClassName?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      label,
      icon,
      rightIcon,
      onRightIconClick,
      containerClassName,
      className,
      error,
      ...props
    },
    ref
  ) {
    return (
      <div className={containerClassName}>
        <label className="text-fs-10 font-semibold text-gray-text uppercase tracking-wider ml-1 mb-1.5 block">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-input-bg border-none rounded-full h-[42px] text-fs-12 font-normal text-text-primary placeholder:text-input-placeholder placeholder:font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-shadow",
              icon ? "pl-11" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              error && "ring-1 ring-error",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div 
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-input-text",
                onRightIconClick && "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-fs-10 text-error font-medium mt-1 ml-1">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
