"use client";

import { ReactNode } from "react";
import { IconButton } from "./icon-button";

export function PillButton({
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
    <IconButton
      label={label}
      onClick={onClick}
      pressed={pressed}
      className={`w-auto px-3 ${className ?? ""}`}
    >
      {children}
    </IconButton>
  );
}
