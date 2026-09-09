"use client";

import React from "react";
import { Modal } from "./Modal";
import { cn } from "@/utils/cn";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

import Image from "next/image";

export function SuccessFlowerBadge({ className, size = 84 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      <Image
        src="/tick_flower.png"
        alt="Success"
        width={size}
        height={size}
        priority
        className="object-contain"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText = "View Requests",
  onAction,
}: SuccessModalProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[460px]" className="text-center p-8 lg:p-10">
      <div className="flex flex-col items-center">
        {/* Flower / Badge Icon */}
        <div className="mb-6 flex justify-center">
          <SuccessFlowerBadge />
        </div>

        {/* Title */}
        <h3 className="text-fs-20 lg:text-fs-22 font-bold text-text-primary mb-3 font-poppins leading-tight">
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-fs-13 lg:text-fs-14 text-[#64748B] mb-8 max-w-sm leading-relaxed mx-auto font-normal">
            {message}
          </p>
        )}

        {/* Action Button */}
        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={handleAction}
            className="py-2.5 px-8 text-fs-13 lg:text-fs-14 font-medium bg-[#005C66] text-white hover:bg-[#004b54] rounded-full shadow-sm transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

