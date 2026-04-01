"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:scale-110 hover:bg-black/5 hover:text-zinc-900 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] transform-gpu dark:border-white/10 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 dark:hover:text-white dark:active:shadow-[inset_0_1px_4px_rgba(255,255,255,0.22)] ${pressed ? "bg-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] dark:bg-white/10 dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.22)]" : ""} ${className ?? ""}`}
          type="button"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
