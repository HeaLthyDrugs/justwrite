import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { CodeIcon, GridIcon, TextFontIcon, ChevronDown } from "@hugeicons/core-free-icons";
import { useFont } from "./font-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

  const arrowTrigger = (
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="Open font menu"
        className={`flex items-center justify-center rounded-none text-zinc-400 outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
          compact ? "h-8 w-8" : "h-9 w-8 sm:w-8.5"
        }`}
      >
        <HugeiconsIcon
          icon={ChevronDown}
          size={12}
          strokeWidth={1.6}
          className={`shrink-0 sm:size-3.5 ${menuSide === "top" ? "rotate-180" : ""}`}
        />
      </button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {showTooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonGroup
              className={`overflow-hidden rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out dark:border-white/10 dark:bg-zinc-800/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] ${
                compact ? "h-8" : "h-9"
              }`}
            >
              <span
                className={`flex items-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                  compact
                    ? "h-8 w-8 justify-center"
                    : "h-9 max-w-[100px] gap-1.5 px-2.5 py-2 sm:max-w-none sm:gap-2 sm:px-3"
                }`}
              >
                <HugeiconsIcon icon={activeFont.icon} size={14} strokeWidth={1.6} className="shrink-0 sm:size-4" />
                {!compact ? <span className="truncate text-[10px] sm:text-xs font-medium">{activeFont.label}</span> : null}
              </span>
              <ButtonGroupSeparator className="bg-black/10 dark:bg-white/10" />
              {arrowTrigger}
            </ButtonGroup>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            Font: {activeFont.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        <ButtonGroup
          className={`overflow-hidden rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out dark:border-white/10 dark:bg-zinc-800/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] ${
            compact ? "h-8" : "h-9"
          }`}
        >
          <span
            className={`flex items-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
              compact
                ? "h-8 w-8 justify-center"
                : "h-9 max-w-[100px] gap-1.5 px-2.5 py-2 sm:max-w-none sm:gap-2 sm:px-3"
            }`}
          >
            <HugeiconsIcon icon={activeFont.icon} size={14} strokeWidth={1.6} className="shrink-0 sm:size-4" />
            {!compact ? <span className="truncate text-[10px] sm:text-xs font-medium">{activeFont.label}</span> : null}
          </span>
          <ButtonGroupSeparator className="bg-black/10 dark:bg-white/10" />
          {arrowTrigger}
        </ButtonGroup>
      )}

      <DropdownMenuContent
        side={menuSide}
        sideOffset={8}
        align="end"
        className="min-w-[140px] rounded-2xl border border-black/5 bg-white/90 p-0.5 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/90"
      >
          {fonts.map((f) => (
            <DropdownMenuItem
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`m-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-xs font-medium outline-none transition-colors ${
                font === f.id
                  ? "bg-black/5 text-zinc-900 dark:bg-white/10 dark:text-white"
                  : "text-zinc-500 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <HugeiconsIcon icon={f.icon} size={14} strokeWidth={1.6} />
              {f.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
