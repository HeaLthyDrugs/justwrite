import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { CodeIcon, GridIcon, TextFontIcon, ChevronDown } from "@hugeicons/core-free-icons";
import { useFont } from "./font-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function FontSwitcher({
  menuSide = "bottom",
  compact = false,
  showTooltip = true,
}: {
  menuSide?: "top" | "bottom";
  compact?: boolean;
  showTooltip?: boolean;
}) {
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

  const triggerButton = (
    <button
      className={`rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-black/5 dark:border-white/10 dark:bg-zinc-800/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 ${
        compact
          ? "inline-flex h-8 w-8 items-center justify-center"
          : "flex h-9 max-w-[100px] sm:max-w-none items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2"
      }`}
      type="button"
      aria-label={compact ? "Switch font" : undefined}
    >
      <HugeiconsIcon icon={activeFont.icon} size={14} strokeWidth={1.6} className="shrink-0 sm:size-4" />
      {!compact ? <span className="truncate text-[10px] sm:text-xs font-medium">{activeFont.label}</span> : null}
      {!compact ? (
        <HugeiconsIcon
          icon={ChevronDown}
          size={12}
          strokeWidth={1.6}
          className={`shrink-0 text-zinc-400 sm:size-3.5 ${menuSide === "top" ? "rotate-180" : ""}`}
        />
      ) : null}
    </button>
  );

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {showTooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              Font: {activeFont.label}
            </TooltipContent>
          </Tooltip>
        ) : (
          triggerButton
        )}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          side={menuSide}
          sideOffset={8}
          align="start"
          className="z-50 min-w-[140px] overflow-hidden rounded-2xl border border-black/5 bg-white/90 shadow-lg backdrop-blur-xl animate-in fade-in-0 zoom-in-95 dark:border-white/15 dark:bg-zinc-900/90"
        >
          {fonts.map((f) => (
            <DropdownMenuPrimitive.Item
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`m-1 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-xs font-medium outline-none transition-colors ${
                font === f.id
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
