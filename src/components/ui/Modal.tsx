"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  className,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative bg-white rounded-[24px] shadow-2xl w-full z-10 p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto",
          maxWidth,
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {title && <div className="mb-5">{typeof title === "string" ? <h3 className="text-lg font-bold text-gray-900">{title}</h3> : title}</div>}

        {children}
      </div>
    </div>
  );
}
