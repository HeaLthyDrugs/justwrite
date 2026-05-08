"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Settings02Icon,
  SpeakerIcon,
  TextFontIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";

interface FamilyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typingEffectsEnabled: boolean;
  onTypingEffectsEnabledChange: (enabled: boolean) => void;
}

export function FamilyDrawer({
  isOpen,
  onClose,
  typingEffectsEnabled,
  onTypingEffectsEnabledChange,
}: FamilyDrawerProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed left-6 top-1/2 z-30 w-[300px] -translate-y-1/2 rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${
        isOpen
          ? "opacity-100 translate-x-0"
          : "pointer-events-none opacity-0 -translate-x-[340px]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
          <HugeiconsIcon icon={Settings02Icon} size={14} strokeWidth={1.8} />
          Settings
        </div>
        <IconButton
          label="Close settings"
          className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
          onClick={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.6} />
        </IconButton>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-black/5 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            <HugeiconsIcon icon={TextFontIcon} size={14} strokeWidth={1.7} />
            Font Family
          </div>
          <FontSwitcher />
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            <HugeiconsIcon icon={SpeakerIcon} size={14} strokeWidth={1.7} />
            Typing Effects
          </div>
          <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white/55 px-3 py-2 dark:border-white/10 dark:bg-black/20">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Sound + haptics
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={typingEffectsEnabled}
              onClick={() => onTypingEffectsEnabledChange(!typingEffectsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${typingEffectsEnabled
                ? "bg-zinc-900 dark:bg-zinc-100"
                : "bg-zinc-300 dark:bg-zinc-700"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${typingEffectsEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/40 p-3 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <div className="mb-1.5 flex items-center gap-2 font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            <HugeiconsIcon icon={ViewOffSlashIcon} size={14} strokeWidth={1.7} />
            Tip
          </div>
          Use Focus Mode for distraction-free writing.
        </div>
      </div>
    </aside>
  );
}
