"use client";

import { ReactNode } from "react";
import { IconButton } from "./icon-button";

export function PillButton({
  label,
  children,
  onClick,
  pressed,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <IconButton
      label={label}
      onClick={onClick}
      pressed={pressed}
      className="w-auto px-3"
    >
      {children}
    </IconButton>
  );
}
