"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Clock01Icon,
  NoteAddIcon,
  SpeakerIcon,
  TextFontIcon,
  TextCheckIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";

interface FamilyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typingEffectsEnabled: boolean;
  onTypingEffectsEnabledChange: (enabled: boolean) => void;
  showWordCount: boolean;
  onShowWordCountChange: (enabled: boolean) => void;
  showSavedTimestamp: boolean;
  onShowSavedTimestampChange: (enabled: boolean) => void;
  notebookLinesEnabled: boolean;
  onNotebookLinesEnabledChange: (enabled: boolean) => void;
  spellCheckEnabled: boolean;
  onSpellCheckEnabledChange: (enabled: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function FamilyDrawer({
  isOpen,
  onClose,
  typingEffectsEnabled,
  onTypingEffectsEnabledChange,
  showWordCount,
  onShowWordCountChange,
  showSavedTimestamp,
  onShowSavedTimestampChange,
  notebookLinesEnabled,
  onNotebookLinesEnabledChange,
  spellCheckEnabled,
  onSpellCheckEnabledChange,
  fontSize,
  onFontSizeChange,
}: FamilyDrawerProps) {
  const quickPages = [
    { href: "/changelog", label: "Changelog" },
    { href: "/about", label: "About" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed left-6 top-1/2 z-30 w-[300px] -translate-y-1/2 rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${isOpen
        ? "opacity-100 translate-x-0"
        : "pointer-events-none opacity-0 -translate-x-[340px]"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
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

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Notebook Lines
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notebookLinesEnabled}
            onClick={() => onNotebookLinesEnabledChange(!notebookLinesEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${notebookLinesEnabled
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${notebookLinesEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={TextFontIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Font Size
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onFontSizeChange(Math.max(12, fontSize - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-zinc-600 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              -
            </button>
            <span className="w-5 text-center text-xs font-medium text-zinc-700 dark:text-zinc-200">
              {fontSize}
            </span>
            <button
              type="button"
              onClick={() => onFontSizeChange(Math.min(32, fontSize + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-zinc-600 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={TextNumberSignIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Word Count
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showWordCount}
            onClick={() => onShowWordCountChange(!showWordCount)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${showWordCount
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${showWordCount ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Saved Timestamp
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showSavedTimestamp}
            onClick={() => onShowSavedTimestampChange(!showSavedTimestamp)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${showSavedTimestamp
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${showSavedTimestamp ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={TextCheckIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Spell Check
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={spellCheckEnabled}
            onClick={() => onSpellCheckEnabledChange(!spellCheckEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${spellCheckEnabled
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${spellCheckEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <HugeiconsIcon icon={SpeakerIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Typing Sound
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={typingEffectsEnabled}
            onClick={() => onTypingEffectsEnabledChange(!typingEffectsEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${typingEffectsEnabled
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

        <div className="mt-1 border-t border-black/5 pt-4 dark:border-white/10">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500/75 dark:text-zinc-400/70">
            Pages
          </div>
          <div className="flex flex-col gap-1.5">
            {quickPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-zinc-600/65 transition-colors hover:text-zinc-800/80 dark:text-zinc-300/60 dark:hover:text-zinc-100/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-black/5 pt-4 dark:border-white/10">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500/75 dark:text-zinc-400/70">
            Legal
          </div>
          <div className="flex flex-col gap-1.5">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-zinc-600/65 transition-colors hover:text-zinc-800/80 dark:text-zinc-300/60 dark:hover:text-zinc-100/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
