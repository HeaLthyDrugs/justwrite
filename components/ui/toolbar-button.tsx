"use client";

import { ReactNode } from "react";
import { IconButton } from "./icon-button";

export function ToolbarButton({
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
      className="h-10 w-10"
    >
      {children}
    </IconButton>
  );
}
