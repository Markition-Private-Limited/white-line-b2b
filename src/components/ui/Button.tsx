import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-sm":
              variant === "primary",
            "bg-primary-50 text-primary hover:bg-primary-100 active:bg-primary-200":
              variant === "secondary",
            "text-primary hover:underline active:text-primary-dark":
              variant === "tertiary",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 font-medium shadow-2xs":
              variant === "outline",
            "text-gray-700 hover:bg-gray-100 hover:text-gray-900":
              variant === "ghost",
            "border border-[#EA5B5B] bg-white text-[#EA5B5B] hover:bg-red-50 hover:border-red-400 font-medium shadow-2xs":
              variant === "danger",
          },
          {
            "text-fs-10 px-3 py-1.5 gap-1.5": size === "sm",
            "text-fs-12 px-4 py-2.5 gap-2": size === "md",
            "text-fs-14 px-6 py-3 gap-2.5": size === "lg",
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
