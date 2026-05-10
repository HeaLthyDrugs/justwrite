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
  onClose: (id: string) => void;
}

const typeStyles: Record<
  ToastType,
  { icon: IconSvgElement; ring: string; iconColor: string; accent: string }
> = {
  success: {
    icon: FileExportIcon,
    ring: "ring-emerald-500/25 dark:ring-emerald-300/20",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    accent: "from-emerald-500/15 to-emerald-500/0 dark:from-emerald-300/15 dark:to-emerald-300/0",
  },
  info: {
    icon: FileExportIcon,
    ring: "ring-sky-500/25 dark:ring-sky-300/20",
    iconColor: "text-sky-600 dark:text-sky-300",
    accent: "from-sky-500/15 to-sky-500/0 dark:from-sky-300/15 dark:to-sky-300/0",
  },
  error: {
    icon: Alert01Icon,
    ring: "ring-rose-500/25 dark:ring-rose-300/20",
    iconColor: "text-rose-600 dark:text-rose-300",
    accent: "from-rose-500/15 to-rose-500/0 dark:from-rose-300/15 dark:to-rose-300/0",
  },
};

function ToastItem({ id, title, description, type = "info", onClose }: CustomToastProps) {
  const [visible, setVisible] = useState(false);
  const styles = typeStyles[type];

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`pointer-events-auto w-full overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.16)] ring-1 ${styles.ring} backdrop-blur-xl transition-all duration-300 ease-out dark:border-white/10 dark:bg-zinc-900/75 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${styles.accent}`} />
      <div className="flex items-start gap-3 p-3.5">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
          <HugeiconsIcon icon={styles.icon} size={16} strokeWidth={1.7} className={styles.iconColor} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </p>
          {description ? (
            <p className="mt-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {description}
            </p>
          ) : null}
        </div>
        <button
          aria-label="Dismiss notification"
          type="button"
          onClick={() => onClose(id)}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.8} />
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
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function CustomToastViewport({ toasts, onClose }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[70] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-2.5 sm:right-4 sm:top-4 sm:w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
