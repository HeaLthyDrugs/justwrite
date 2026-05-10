"use client";

import { useEffect, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Cancel01Icon, FileExportIcon } from "@hugeicons/core-free-icons";

export type ToastType = "success" | "info" | "error";

interface CustomToastProps {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  icon?: IconSvgElement;
  onClose: (id: string) => void;
}

const typeStyles: Record<
  ToastType,
  { icon: IconSvgElement; iconColor: string }
> = {
  success: {
    icon: FileExportIcon,
    iconColor: "text-black dark:text-white",
  },
  info: {
    icon: FileExportIcon,
    iconColor: "text-black dark:text-white",
  },
  error: {
    icon: Alert01Icon,
    iconColor: "text-black dark:text-white",
  },
};

function ToastItem({ id, title, description, type = "info", icon, onClose }: CustomToastProps) {
  const [visible, setVisible] = useState(false);
  const styles = typeStyles[type];
  const resolvedIcon = icon ?? styles.icon;

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`pointer-events-auto w-full overflow-hidden rounded-xl border border-black/10 bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out dark:border-white/20 dark:bg-black dark:text-white ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="flex items-start gap-2 p-2.5">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
          <HugeiconsIcon icon={resolvedIcon} size={18} strokeWidth={1.8} className={styles.iconColor} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold leading-tight tracking-tight">
            {title}
          </p>
          {description ? (
            <p className="mt-0.5 text-[11px] leading-tight text-zinc-600 dark:text-zinc-300">
              {description}
            </p>
          ) : null}
        </div>
        <button
          aria-label="Dismiss notification"
          type="button"
          onClick={() => onClose(id)}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  icon?: IconSvgElement;
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function CustomToastViewport({ toasts, onClose }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[70] flex w-[calc(100%-1.5rem)] max-w-[19rem] flex-col gap-2 sm:right-4 sm:top-4 sm:w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
