"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BookOpen02Icon,
  Cancel01Icon,
  CloudLittleRainIcon,
  Clock01Icon,
  Coffee02Icon,
  HeadphonesIcon,
  Moon02Icon,
  NoteAddIcon,
  SiriIcon,
  SpeakerIcon,
  Tree01Icon,
  TextFontIcon,
  TextCheckIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@/components/ui/icon-button";
import type {
  AmbientAudioId,
  AmbientBackgroundId,
  AmbientBackgroundConfig,
} from "@/lib/ambient-scenes";

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
  ambientBackgroundOptions: AmbientBackgroundConfig[];
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

const AMBIENT_AUDIO_VISUALS: Record<
  AmbientAudioId,
  {
    icon: IconSvgElement;
    cardGradient: string;
    iconAccent: string;
  }
> = {
  rain: {
    icon: CloudLittleRainIcon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(237,246,255,0.98),rgba(221,235,255,0.94)_56%,rgba(209,225,248,0.9))]",
    iconAccent: "text-sky-400/85 dark:text-sky-300",
  },
  cafe: {
    icon: Coffee02Icon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(255,245,233,0.98),rgba(255,233,209,0.94)_56%,rgba(249,221,190,0.9))]",
    iconAccent: "text-orange-400/85 dark:text-orange-300",
  },
  library: {
    icon: BookOpen02Icon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(238,252,244,0.98),rgba(221,246,234,0.94)_56%,rgba(204,236,221,0.9))]",
    iconAccent: "text-emerald-400/85 dark:text-emerald-300",
  },
  night: {
    icon: Moon02Icon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(244,241,255,0.98),rgba(233,228,252,0.94)_56%,rgba(219,212,241,0.9))]",
    iconAccent: "text-violet-400/85 dark:text-violet-300",
  },
  forest: {
    icon: Tree01Icon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(237,251,247,0.98),rgba(222,245,236,0.94)_56%,rgba(203,233,223,0.9))]",
    iconAccent: "text-green-400/85 dark:text-green-300",
  },
  "lofi-room": {
    icon: HeadphonesIcon,
    cardGradient:
      "bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.92),transparent_40%),linear-gradient(145deg,rgba(248,240,255,0.98),rgba(239,228,252,0.94)_56%,rgba(226,214,241,0.9))]",
    iconAccent: "text-fuchsia-400/85 dark:text-fuchsia-300",
  },
};

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
  const selectedAmbientAudioVisual =
    AMBIENT_AUDIO_VISUALS[selectedAmbientAudio.id] ?? AMBIENT_AUDIO_VISUALS.rain;
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

  const renderAmbientBackgroundPreview = (
    backgroundConfig: AmbientBackgroundConfig,
    label: string
  ) => {
    const { background } = backgroundConfig;
    if (background.type === "video") {
      return (
        <video
          key={background.source}
          aria-hidden={label ? undefined : true}
          aria-label={label || undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={background.poster}
          className="h-full w-full object-cover object-center"
        >
          <source key={background.source} src={background.source} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={background.source}
        alt={label}
        fill
        sizes="160px"
        className="object-cover object-center"
      />
    );
  };

  const resolvedActiveAmbientPicker =
    isOpen && ambientEnabled ? activeAmbientPicker : null;
  const ambientPickerOptions =
    resolvedActiveAmbientPicker === "audio" ? ambientAudioOptions : ambientBackgroundOptions;
  const isAudioPicker = resolvedActiveAmbientPicker === "audio";
  const activeAmbientValue = isAudioPicker ? ambientAudioId : ambientBackgroundId;
  const comingSoonLabel = isAudioPicker
    ? "More audios will be added"
    : "More scenes will be added";

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
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="ambient-background-trigger"
                  type="button"
                  disabled={!ambientEnabled}
                  onClick={() =>
                    setActiveAmbientPicker((current) =>
                      current === "background" ? null : "background"
                    )
                  }
                  className={`group relative aspect-[1.45] min-h-[86px] overflow-hidden rounded-[18px] border border-white/45 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/12 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70 ${activeAmbientPicker === "background"
                    ? "ring-1 ring-zinc-900/55 dark:ring-zinc-100/60"
                    : "hover:border-black/20 dark:hover:border-white/20"
                    }`}
                >
                  <span className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.04]">
                    {renderAmbientBackgroundPreview(selectedAmbientBackground, "")}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-black/12" />
                  <span className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/20" />
                  <span className="absolute left-2 top-2 rounded-full bg-black/42 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-md">
                    Scene
                  </span>
                  <span className="absolute inset-x-2 bottom-2 truncate text-xs font-semibold text-white">
                    {selectedAmbientBackground.label}
                  </span>
                </button>
                <button
                  id="ambient-audio-trigger"
                  type="button"
                  disabled={!ambientEnabled}
                  onClick={() =>
                    setActiveAmbientPicker((current) =>
                      current === "audio" ? null : "audio"
                    )
                  }
                  className={`group relative aspect-[1.45] min-h-[86px] overflow-hidden rounded-[18px] border border-white/45 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/12 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70 ${activeAmbientPicker === "audio"
                    ? "border-white/80 ring-1 ring-white/65 dark:border-white/45 dark:ring-white/45"
                    : "hover:border-white/80 dark:hover:border-white/35"
                    }`}
                >
                  <span
                    className={`absolute inset-0 ${selectedAmbientAudioVisual.cardGradient}`}
                  />
                  <span className="absolute right-3 top-3 z-[2]">
                    <HugeiconsIcon
                      icon={selectedAmbientAudioVisual.icon}
                      size={34}
                      strokeWidth={1.9}
                      className={`${selectedAmbientAudioVisual.iconAccent} drop-shadow-[0_2px_3px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_2px_3px_rgba(0,0,0,0.42)]`}
                    />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-white/22 via-transparent to-transparent dark:from-black/12" />
                  <span className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/50" />
                  <span className="absolute left-2 top-2 z-[2] rounded-full bg-white/42 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-600/90 backdrop-blur-sm dark:bg-white/28 dark:text-zinc-700/95">
                    Audio
                  </span>
                  <span className="absolute inset-x-2 bottom-2 z-[2] truncate text-xs font-semibold text-zinc-800/95 dark:text-zinc-700/95">
                    {selectedAmbientAudio.label}
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
    <button
      type="button"
      aria-hidden={!resolvedActiveAmbientPicker}
      aria-label="Close ambient picker"
      tabIndex={resolvedActiveAmbientPicker ? 0 : -1}
      onClick={() => setActiveAmbientPicker(null)}
      className={`fixed inset-0 z-[29] cursor-default bg-transparent transition-opacity ${resolvedActiveAmbientPicker
        ? "pointer-events-auto opacity-100"
        : "pointer-events-none opacity-0"
        }`}
    />
    <div
      aria-hidden={!resolvedActiveAmbientPicker}
      data-ambient-dropdown-content
      data-drawer-root="settings"
      className={`fixed inset-x-3 bottom-20 z-40 transition-all duration-300 sm:inset-x-6 sm:bottom-24 md:inset-x-auto md:bottom-auto md:left-[calc(1.5rem+300px+10px)] md:top-1/2 md:w-[300px] md:-translate-y-1/2 ${resolvedActiveAmbientPicker
        ? "pointer-events-auto opacity-100 translate-y-0 md:translate-x-0"
        : "pointer-events-none opacity-0 translate-y-2 md:-translate-x-3"
        }`}
    >
      <div
        className={`max-h-[48vh] overflow-y-auto overflow-x-hidden rounded-[26px] border p-2 backdrop-blur-2xl md:max-h-[62vh] ${
          isAudioPicker
            ? "border-white/80 bg-[linear-gradient(165deg,rgba(240,251,247,0.86),rgba(230,238,255,0.8)_50%,rgba(246,236,255,0.82))] shadow-[0_16px_32px_rgba(151,177,196,0.22),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/36 dark:bg-[linear-gradient(165deg,rgba(50,58,70,0.68),rgba(66,64,88,0.62)_52%,rgba(58,74,70,0.64))]"
            : "border-white/80 bg-[linear-gradient(165deg,rgba(236,245,255,0.84),rgba(230,247,242,0.8)_50%,rgba(242,238,255,0.8))] shadow-[0_16px_32px_rgba(151,177,196,0.2),inset_0_1px_0_rgba(255,255,255,0.66)] dark:border-white/34 dark:bg-[linear-gradient(165deg,rgba(45,56,68,0.7),rgba(52,70,66,0.62)_52%,rgba(60,64,84,0.64))]"
        }`}
      >
        <div className="sticky top-0 z-10 -mx-1 mb-1 flex items-center justify-between rounded-[18px] px-2 py-1">
          <button
            type="button"
            aria-label="Close ambient picker"
            onClick={() => setActiveAmbientPicker(null)}
            className="flex h-7 w-7 items-center shadow-sm justify-center rounded-full border border-black/5 bg-white/45 text-zinc-600 transition-colors hover:border-black/10 hover:bg-white/70 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/18 dark:hover:bg-white/10 dark:hover:text-zinc-50"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={1.7} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ambientPickerOptions.map((option) => {
            const audioVisual = isAudioPicker
              ? AMBIENT_AUDIO_VISUALS[option.id as AmbientAudioId]
              : null;

            return (
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
                className={`group relative aspect-[1.22] overflow-hidden rounded-[18px] text-left transition-all ${
                  isAudioPicker
                    ? "border border-white/70 bg-white/52 shadow-[inset_1px_1px_0_rgba(255,255,255,0.58),inset_-1px_-1px_0_rgba(207,219,235,0.25),0_10px_18px_rgba(145,164,183,0.18)] dark:border-white/35 dark:bg-white/14"
                    : "border border-white/66 bg-white/45 shadow-[inset_1px_1px_0_rgba(255,255,255,0.56),inset_-1px_-1px_0_rgba(207,219,235,0.2),0_10px_18px_rgba(145,164,183,0.14)] dark:border-white/30 dark:bg-white/10"
                } ${
                  option.id === activeAmbientValue
                    ? "border-white/85 ring-1 ring-white/70 dark:border-white/50 dark:ring-white/45"
                    : "hover:border-white/85 dark:hover:border-white/45"
                }`}
              >
                <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03]">
                  {isAudioPicker ? (
                    <>
                      <span
                        className={`absolute inset-0 ${audioVisual?.cardGradient ?? ""}`}
                      />
                      <span className="absolute right-3 top-3 z-[2]">
                        <HugeiconsIcon
                          icon={audioVisual?.icon ?? SpeakerIcon}
                          size={38}
                          strokeWidth={1.95}
                          className={`${audioVisual?.iconAccent ?? "text-zinc-500 dark:text-zinc-200"} drop-shadow-[0_2px_3px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_2px_3px_rgba(0,0,0,0.42)]`}
                        />
                      </span>
                    </>
                  ) : (
                    renderAmbientBackgroundPreview(
                      option as AmbientBackgroundConfig,
                      option.label
                    )
                  )}
                </div>
                <div
                  className={`absolute inset-0 ${
                    isAudioPicker
                      ? "bg-gradient-to-t from-white/28 via-transparent to-transparent dark:from-black/12"
                      : "bg-gradient-to-t from-black/42 via-black/8 to-transparent dark:from-black/52"
                  }`}
                />
                <div className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/18" />
                <p
                  className={`absolute inset-x-2 bottom-2 truncate text-xs font-semibold ${
                    isAudioPicker
                      ? "text-zinc-800/95 dark:text-zinc-700/95"
                      : "text-white/95"
                  }`}
                >
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>
        <p className="px-1 pt-2 text-center text-[11px] font-medium leading-4 text-zinc-600/78 dark:text-zinc-300/72">
          {comingSoonLabel}.
        </p>
      </div>
    </div>
    </>
  );
}
