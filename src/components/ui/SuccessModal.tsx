"use client";

import React from "react";
import { Check } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText = "Done",
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" className="text-center p-8">
      <div className="flex flex-col items-center">
        {/* Green Check Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-[#12A150] text-white flex items-center justify-center mb-6 shadow-md shadow-[#12A150]/20">
          <Check className="w-9 h-9 stroke-[3]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">{title}</h3>

        {/* Message */}
        {message && <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">{message}</p>}

        {/* Action Button */}
        <Button onClick={handleAction} className="w-full py-3 text-sm font-semibold rounded-full">
          {actionText}
        </Button>
      </div>
    </Modal>
  );
}
