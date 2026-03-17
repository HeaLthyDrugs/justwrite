"use client";

import { ReactNode } from "react";
import { Tooltip } from "@heroui/tooltip";

export function IconButton({
  label,
  children,
  onClick,
  pressed,
  className,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <Tooltip content={label} placement="bottom" showArrow={true} closeDelay={0}>
      <button
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-black/5 text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] transition hover:bg-black/10 hover:text-zinc-900 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 dark:hover:text-white ${pressed ? "bg-black/10 dark:bg-white/10" : ""} ${className ?? ""}`}
        type="button"
      >
        {children}
      </button>
    </Tooltip>
  );
}
