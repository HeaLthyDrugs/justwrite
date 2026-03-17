"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { CodeIcon, GridIcon, TextFontIcon } from "@hugeicons/core-free-icons";
import { useFont } from "./font-context";

export function FontSwitcher() {
  const { font, setFont } = useFont();

  const fonts: {
    id: "sans" | "mono" | "pixel";
    label: string;
    icon: IconSvgElement;
  }[] = [
    { id: "sans", label: "Sans", icon: TextFontIcon },
    { id: "mono", label: "Mono", icon: CodeIcon },
    { id: "pixel", label: "Pixel", icon: GridIcon },
  ];

  return (
    <div className="flex gap-1 rounded-full border border-black/5 bg-black/5 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)]">
      {fonts.map((f) => (
        <button
          key={f.id}
          onClick={() => setFont(f.id)}
          title={`${f.label} font`}
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.14)] ${
            font === f.id
              ? "bg-white/90 text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          <HugeiconsIcon icon={f.icon} size={16} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  );
}
