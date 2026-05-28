"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Clock01Icon,
  NoteAddIcon,
  SiriIcon,
  SpeakerIcon,
  TextFontIcon,
  TextCheckIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@/components/ui/icon-button";
import type {
  AmbientAudioId,
  AmbientBackgroundId,
  AmbientOptionId,
} from "@/lib/ambient-scenes";
import { AMBIENT_BACKGROUNDS } from "@/lib/ambient-scenes";

interface FamilyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typingEffectsEnabled: boolean;
  onTypingEffectsEnabledChange: (enabled: boolean) => void;
  ambientEnabled: boolean;
  onAmbientEnabledChange: (enabled: boolean) => void;
  ambientAudioId: AmbientAudioId;
  ambientAudioOptions: Array<{ id: AmbientAudioId; label: string; iconPath: string }>;
  onAmbientAudioChange: (audioId: AmbientAudioId) => void;
  ambientBackgroundId: AmbientBackgroundId;
  ambientBackgroundOptions: Array<{
    id: AmbientBackgroundId;
    label: string;
    iconPath: string;
  }>;
  onAmbientBackgroundChange: (backgroundId: AmbientBackgroundId) => void;
  ambientVolume: number;
  onAmbientVolumeChange: (volume: number) => void;
  ambientBackdropDim: number;
  onAmbientBackdropDimChange: (value: number) => void;
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
  ambientEnabled,
  onAmbientEnabledChange,
  ambientAudioId,
  ambientAudioOptions,
  onAmbientAudioChange,
  ambientBackgroundId,
  ambientBackgroundOptions,
  onAmbientBackgroundChange,
  ambientVolume,
  onAmbientVolumeChange,
  ambientBackdropDim,
  onAmbientBackdropDimChange,
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
    { href: "/shortcuts", label: "Shortcuts" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];
  const selectedAmbientAudio =
    ambientAudioOptions.find((audio) => audio.id === ambientAudioId) ??
    ambientAudioOptions[0];
  const selectedAmbientBackground =
    ambientBackgroundOptions.find(
      (background) => background.id === ambientBackgroundId
    ) ?? ambientBackgroundOptions[0];
  const [activeAmbientPicker, setActiveAmbientPicker] = useState<
    "background" | "audio" | null
  >(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveAmbientPicker(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getAmbientPreviewSource = (id: AmbientOptionId) => {
    const background = AMBIENT_BACKGROUNDS[id].background;
    if (background.type === "video") {
      return background.poster ?? "/backgrounds/1.jpg";
    }
    return background.source;
  };

  const resolvedActiveAmbientPicker =
    isOpen && ambientEnabled ? activeAmbientPicker : null;
  const ambientPickerOptions =
    resolvedActiveAmbientPicker === "audio" ? ambientAudioOptions : ambientBackgroundOptions;
  const isAudioPicker = resolvedActiveAmbientPicker === "audio";
  const activeAmbientValue = isAudioPicker ? ambientAudioId : ambientBackgroundId;

  return (
    <>
    <aside
      aria-hidden={!isOpen}
      data-drawer-root="settings"
      className={`fixed left-6 top-1/2 z-30 flex h-[82vh] w-[300px] -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[0_24px_60px_rgba(8,8,8,0.24)] backdrop-blur-[52px] transition-all duration-500 ease-in-out dark:border-white/20 dark:bg-black/70 ${isOpen
        ? "opacity-100 translate-x-0"
        : "pointer-events-none opacity-0 -translate-x-[340px]"
        }`}
    >
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-100">
          Settings
        </div>
        <IconButton
          label="Close settings"
          className="h-8 w-8 border-none bg-white/75 dark:bg-black/45"
          onClick={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.6} />
        </IconButton>
      </div>

      <div className="relative mt-6 min-h-0 flex-1 overflow-hidden -mx-5 px-5 isolate">
        <div
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                <HugeiconsIcon
                  icon={SiriIcon}
                  size={16}
                  strokeWidth={1.6}
                  className="text-zinc-500 dark:text-zinc-400"
                />
                Ambient Mode
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={ambientEnabled}
                onClick={() => {
                  if (ambientEnabled) {
                    setActiveAmbientPicker(null);
                  }
                  onAmbientEnabledChange(!ambientEnabled);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${ambientEnabled
                  ? "bg-zinc-900 dark:bg-zinc-100"
                  : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${ambientEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              Pick any background scene and any audio mix independently.
            </p>

            <div className={`mt-3 space-y-3 ${ambientEnabled ? "" : "opacity-60"}`}>
              <div className="space-y-1.5">
                <label
                  htmlFor="ambient-background-trigger"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400"
                >
                  Background Scene
                </label>
                <button
                  id="ambient-background-trigger"
                  type="button"
                  disabled={!ambientEnabled}
                  onClick={() =>
                    setActiveAmbientPicker((current) =>
                      current === "background" ? null : "background"
                    )
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-black/12 bg-white/92 p-2 text-left outline-none transition-all hover:border-black/24 hover:bg-white focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/20 dark:bg-black/58 dark:hover:border-white/35 dark:hover:bg-black/68 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative h-12 w-[78px] shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-sm dark:border-white/15">
                      <Image
                        src={getAmbientPreviewSource(selectedAmbientBackground.id)}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="78px"
                        className="object-cover object-center"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                        {selectedAmbientBackground.label}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                        Choose scene
                      </span>
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ambient-audio-trigger"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400"
                >
                  Ambient Audio
                </label>
                <button
                  id="ambient-audio-trigger"
                  type="button"
                  disabled={!ambientEnabled}
                  onClick={() =>
                    setActiveAmbientPicker((current) =>
                      current === "audio" ? null : "audio"
                    )
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-black/12 bg-white/92 p-2 text-left outline-none transition-all hover:border-black/24 hover:bg-white focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/20 dark:bg-black/58 dark:hover:border-white/35 dark:hover:bg-black/68 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative h-12 w-[78px] shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-sm dark:border-white/15">
                      <Image
                        src={getAmbientPreviewSource(selectedAmbientAudio.id)}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="78px"
                        className="object-cover object-center"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                        {selectedAmbientAudio.label}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                        Choose audio
                      </span>
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ambient-volume-range"
                    className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400"
                  >
                    Volume
                  </label>
                  <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                    {ambientVolume}%
                  </span>
                </div>
                <input
                  id="ambient-volume-range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={ambientVolume}
                  disabled={!ambientEnabled}
                  onChange={(event) =>
                    onAmbientVolumeChange(Number(event.target.value))
                  }
                  className="w-full accent-zinc-800 dark:accent-zinc-200 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ambient-backdrop-dim-range"
                    className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400"
                  >
                    Background Dim
                  </label>
                  <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                    {ambientBackdropDim}%
                  </span>
                </div>
                <input
                  id="ambient-backdrop-dim-range"
                  type="range"
                  min={0}
                  max={90}
                  step={1}
                  value={ambientBackdropDim}
                  onChange={(event) =>
                    onAmbientBackdropDimChange(Number(event.target.value))
                  }
                  className="w-full accent-zinc-800 dark:accent-zinc-200"
                />
              </div>
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
                className="text-xs font-medium text-zinc-700/90 transition-colors hover:text-zinc-900 dark:text-zinc-200/90 dark:hover:text-zinc-50"
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
                className="text-xs font-medium text-zinc-700/90 transition-colors hover:text-zinc-900 dark:text-zinc-200/90 dark:hover:text-zinc-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>
    </aside>
    <div
      aria-hidden={!resolvedActiveAmbientPicker}
      data-ambient-dropdown-content
      data-drawer-root="settings"
      className={`fixed inset-x-3 bottom-20 z-40 max-h-[54vh] transition-all duration-300 sm:inset-x-6 sm:bottom-24 md:inset-x-auto md:bottom-auto md:left-[calc(1.5rem+300px+14px)] md:top-1/2 md:max-h-none md:w-[340px] md:-translate-y-1/2 ${resolvedActiveAmbientPicker
        ? "pointer-events-auto opacity-100 translate-y-0 md:translate-x-0"
        : "pointer-events-none opacity-0 translate-y-2 md:-translate-x-3"
        }`}
    >
      <div className="h-full overflow-y-auto overflow-x-hidden rounded-[28px] border border-black/12 bg-white/92 p-2.5 shadow-[0_22px_60px_rgba(8,8,8,0.28)] backdrop-blur-2xl dark:border-white/20 dark:bg-black/78 md:h-auto md:overflow-visible">
        <div className="grid grid-cols-2 gap-2">
          {ambientPickerOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (isAudioPicker) {
                  onAmbientAudioChange(option.id as AmbientAudioId);
                } else {
                  onAmbientBackgroundChange(option.id as AmbientBackgroundId);
                }
                setActiveAmbientPicker(null);
              }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-[18px] text-left transition-all ${option.id === activeAmbientValue
                ? "ring-2 ring-zinc-900/55 dark:ring-zinc-100/55"
                : "ring-1 ring-black/8 hover:ring-black/16 dark:ring-white/10 dark:hover:ring-white/20"
                }`}
            >
              <Image
                src={getAmbientPreviewSource(option.id)}
                alt={option.label}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <p className="absolute bottom-2 left-2 text-[11px] font-medium text-white/95">
                {option.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
