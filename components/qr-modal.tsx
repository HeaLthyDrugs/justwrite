"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, QrCodeIcon } from "@hugeicons/core-free-icons";
import { QRCode } from "./qr-code";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  value: string;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  value,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 flex flex-col items-center space-y-4">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
            <HugeiconsIcon icon={QrCodeIcon} size={18} className="text-amber-500" />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-2 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          <QRCode value={value} size={180} />
        </div>

        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
