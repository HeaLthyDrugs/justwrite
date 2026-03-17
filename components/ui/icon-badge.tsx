"use client";

import { ReactNode } from "react";
import { Tooltip } from "@heroui/tooltip";

export function IconBadge({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip content={label} placement="bottom" showArrow={true} closeDelay={0}>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-black/5 text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)]">
        {children}
      </div>
    </Tooltip>
  );
}
