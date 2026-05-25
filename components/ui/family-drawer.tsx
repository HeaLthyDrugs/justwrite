"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";

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
  const shortcutRows = [
    { keys: ["Ctrl/Cmd", "S"], action: "Save now" },
    { keys: ["Ctrl/Cmd", "Shift", "N"], action: "Create new note" },
    { keys: ["Ctrl/Cmd", "Shift", "[", "]"], action: "Previous / next note" },
    { keys: ["Ctrl/Cmd", "Shift", "L"], action: "Toggle notes drawer" },
    { keys: ["Ctrl/Cmd", "Shift", "S"], action: "Toggle settings drawer" },
    { keys: ["Ctrl/Cmd", "Shift", "F"], action: "Toggle focus mode" },
    { keys: ["Ctrl/Cmd", "Shift", "T"], action: "Toggle light/dark theme" },
    { keys: ["Ctrl/Cmd", "Shift", "M"], action: "Cycle app font" },
    { keys: ["Ctrl/Cmd", "Shift", "P"], action: "Pin or unpin active note" },
    { keys: ["Ctrl/Cmd", "Shift", "Backspace"], action: "Delete active note" },
    { keys: ["Ctrl/Cmd", "Shift", "1", "2", "3"], action: "Export TXT / MD / JSON" },
    { keys: ["Ctrl/Cmd", "Shift", "?"], action: "Show shortcut help toast" },
  ];

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showTopEdgeBlur, setShowTopEdgeBlur] = useState(false);
  const [showBottomEdgeBlur, setShowBottomEdgeBlur] = useState(false);
  const topEdgeMask =
    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 36%, rgba(0,0,0,0.38) 74%, rgba(0,0,0,0) 100%)";
  const bottomEdgeMask =
    "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 36%, rgba(0,0,0,0.38) 74%, rgba(0,0,0,0) 100%)";

  const updateEdgeBlurVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    const edgeTolerance = 6;
    const fadeHeight = 76;

    if (!container) {
      setShowTopEdgeBlur(false);
      setShowBottomEdgeBlur(false);
      return;
    }

    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
    const hasOverflow = maxScrollTop > 1;

    if (!hasOverflow) {
      setShowTopEdgeBlur(false);
      setShowBottomEdgeBlur(false);
      return;
    }

    const atTop = container.scrollTop <= edgeTolerance;
    const remainingScroll = Math.max(0, maxScrollTop - container.scrollTop);
    const atBottom = remainingScroll <= Math.max(edgeTolerance, fadeHeight * 0.7);

    setShowTopEdgeBlur(!atTop);
    setShowBottomEdgeBlur(!atBottom);
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateEdgeBlurVisibility);
    const handleResize = () => updateEdgeBlurVisibility();

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updateEdgeBlurVisibility]);

  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed left-6 top-1/2 z-30 flex h-[82vh] w-[300px] -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${isOpen
        ? "opacity-100 translate-x-0"
        : "pointer-events-none opacity-0 -translate-x-[340px]"
        }`}
    >
      <div className="flex shrink-0 items-center justify-between">
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

      <div className="relative mt-6 min-h-0 flex-1 overflow-hidden -mx-5 px-5 isolate">
        <div
          ref={scrollContainerRef}
          onScroll={updateEdgeBlurVisibility}
          className="h-full space-y-6 overflow-y-auto pr-1 pt-2 pb-0"
        >
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

          <div className="border-t border-black/5 pt-4 dark:border-white/10">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500/75 dark:text-zinc-400/70">
            Keyboard
          </div>
          <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 dark:border-white/10 dark:bg-white/[0.03]">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">
                  <th className="px-2.5 py-1.5 text-left font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300">
                    Shortcut
                  </th>
                  <th className="px-2.5 py-1.5 text-left font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {shortcutRows.map((item, index) => (
                  <tr
                    key={`${item.action}-${index}`}
                    className="border-b border-black/5 last:border-b-0 dark:border-white/10"
                  >
                    <td className="px-2.5 py-1.5 align-top">
                      <div className="inline-flex flex-wrap items-center gap-1">
                        {item.keys.map((part, keyIndex) => (
                          <span key={`${part}-${keyIndex}`} className="inline-flex items-center gap-1">
                            {keyIndex > 0 ? (
                              part === "]" ? (
                                <span className="text-zinc-400">/</span>
                              ) : part === "2" || part === "3" ? (
                                <span className="text-zinc-400">/</span>
                              ) : (
                                <span className="text-zinc-400">+</span>
                              )
                            ) : null}
                            <Kbd>{part}</Kbd>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 text-zinc-600 dark:text-zinc-300">
                      {item.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        {showTopEdgeBlur ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[76px] backdrop-blur-[12px]"
              style={{ WebkitMaskImage: topEdgeMask, maskImage: topEdgeMask }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[76px] dark:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 10%, rgba(255,255,255,0.45) 90%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.5) 52%, rgba(255,255,255,0) 100%)",
                WebkitMaskImage: topEdgeMask,
                maskImage: topEdgeMask,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-[76px] dark:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(9,9,11,0) 0%, rgba(9,9,11,0.32) 10%, rgba(9,9,11,0.32) 90%, rgba(9,9,11,0) 100%), linear-gradient(to bottom, rgba(9,9,11,0.58) 0%, rgba(9,9,11,0.32) 52%, rgba(9,9,11,0) 100%)",
                WebkitMaskImage: topEdgeMask,
                maskImage: topEdgeMask,
              }}
            />
          </>
        ) : null}
        {showBottomEdgeBlur ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[76px] backdrop-blur-[12px]"
              style={{ WebkitMaskImage: bottomEdgeMask, maskImage: bottomEdgeMask }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[76px] dark:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 10%, rgba(255,255,255,0.45) 90%, rgba(255,255,255,0) 100%), linear-gradient(to top, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.5) 52%, rgba(255,255,255,0) 100%)",
                WebkitMaskImage: bottomEdgeMask,
                maskImage: bottomEdgeMask,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[76px] dark:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(9,9,11,0) 0%, rgba(9,9,11,0.32) 10%, rgba(9,9,11,0.32) 90%, rgba(9,9,11,0) 100%), linear-gradient(to top, rgba(9,9,11,0.58) 0%, rgba(9,9,11,0.32) 52%, rgba(9,9,11,0) 100%)",
                WebkitMaskImage: bottomEdgeMask,
                maskImage: bottomEdgeMask,
              }}
            />
          </>
        ) : null}
      </div>
    </aside>
  );
}
