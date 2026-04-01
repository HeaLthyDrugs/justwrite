import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { CodeIcon, GridIcon, TextFontIcon, ChevronDown } from "@hugeicons/core-free-icons";
import { useFont } from "./font-context";

export function FontSwitcher() {
  const { font, setFont } = useFont();

  const fonts: {
    id: "sans" | "mono" | "pixel";
    label: string;
    icon: IconSvgElement;
  }[] = [
      { id: "sans", label: "Sans Serif", icon: TextFontIcon },
      { id: "mono", label: "Monospace", icon: CodeIcon },
      { id: "pixel", label: "Pixel Font", icon: GridIcon },
    ];

  const activeFont = fonts.find((f) => f.id === font) || fonts[0];

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className="flex h-9 items-center gap-2 rounded-full border border-black/5 bg-transparent px-3 py-2 text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:scale-105 hover:bg-black/5 dark:border-white/10 dark:bg-zinc-800/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10"
        >
          <HugeiconsIcon icon={activeFont.icon} size={16} strokeWidth={1.6} />
          <span className="text-xs font-medium">{activeFont.label}</span>
          <HugeiconsIcon icon={ChevronDown} size={14} strokeWidth={1.6} className="text-zinc-400" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-[140px] overflow-hidden rounded-2xl border border-black/5 bg-white/90 p-1 shadow-lg backdrop-blur-xl animate-in fade-in-0 zoom-in-95 dark:border-white/15 dark:bg-zinc-900/90"
        >
          {fonts.map((f) => (
            <DropdownMenuPrimitive.Item
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`flex cursor-pointer m-1 items-center gap-3 rounded-xl px-2 py-2 text-xs font-medium outline-none transition-colors ${font === f.id
                ? "bg-black/5 text-zinc-900 dark:bg-white/10 dark:text-white"
                : "text-zinc-500 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
            >
              <HugeiconsIcon icon={f.icon} size={14} strokeWidth={1.6} />
              {f.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
