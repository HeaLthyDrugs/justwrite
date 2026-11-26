"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  BookOpenTextIcon,
  Cancel01Icon,
  Clock01Icon,
  NoteAddIcon,
  SiriIcon,
  SpeakerIcon,
  Tick02Icon,
  TextFontIcon,
  TextCheckIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  AmbientAudioId,
  AmbientAudioConfig,
  AmbientBackgroundId,
  AmbientBackgroundConfig,
} from "@/lib/ambient-scenes";
import type { NoteAttachmentCacheUsage } from "@/lib/note-attachments";
import type { TypingSoundVariantId } from "@/lib/typing-sound-variants";

interface FamilyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typingEffectsEnabled: boolean;
  onTypingEffectsEnabledChange: (enabled: boolean) => void;
  typingSoundVariantId: TypingSoundVariantId;
  typingSoundVariants: Array<{
    id: TypingSoundVariantId;
    label: string;
    category: string;
  }>;
  onTypingSoundVariantChange: (variantId: TypingSoundVariantId) => void;
  typingSoundVolume: number;
  onTypingSoundVolumeChange: (volume: number) => void;
  ambientEnabled: boolean;
  onAmbientEnabledChange: (enabled: boolean) => void;
  ambientAudioId: AmbientAudioId;
  ambientAudioOptions: Array<Pick<AmbientAudioConfig, "id" | "label" | "imagePath">>;
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
  markdownToolsEnabled: boolean;
  onMarkdownToolsEnabledChange: (enabled: boolean) => void;
  notebookLinesEnabled: boolean;
  onNotebookLinesEnabledChange: (enabled: boolean) => void;
  spellCheckEnabled: boolean;
  onSpellCheckEnabledChange: (enabled: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  mediaCacheUsage: NoteAttachmentCacheUsage | null;
  mediaCacheReadFailed: boolean;
  onClearMediaCache: () => Promise<boolean>;
}

function formatMediaCacheSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function FamilyDrawer({
  isOpen,
  onClose,
  typingEffectsEnabled,
  onTypingEffectsEnabledChange,
  typingSoundVariantId,
  typingSoundVariants,
  onTypingSoundVariantChange,
  typingSoundVolume,
  onTypingSoundVolumeChange,
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
  markdownToolsEnabled,
  onMarkdownToolsEnabledChange,
  notebookLinesEnabled,
  onNotebookLinesEnabledChange,
  spellCheckEnabled,
  onSpellCheckEnabledChange,
  fontSize,
  onFontSizeChange,
  mediaCacheUsage,
  mediaCacheReadFailed,
  onClearMediaCache,
}: FamilyDrawerProps) {
  const quickPages = [
    { href: "/blog", label: "Blog & Guides" },
    { href: "/how-it-works", label: "How Book & Sharing Works" },
    { href: "/shortcuts", label: "Shortcuts" },
    { href: "/about", label: "About" },
    { href: "/changelog", label: "Changelog", hasBadge: true },
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
  const [confirmingMediaCacheClear, setConfirmingMediaCacheClear] = useState(false);
  const [clearingMediaCache, setClearingMediaCache] = useState(false);
  const [ambientPickerPosition, setAmbientPickerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const ambientPickerRef = useRef<HTMLDivElement | null>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const checkScrollFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowTopFade(scrollTop > 4);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 4);
  }, []);

  useEffect(() => {
    checkScrollFades();
  }, [checkScrollFades]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(checkScrollFades, 50);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, checkScrollFades]);

  const typingSoundCategories = Array.from(
    new Set(typingSoundVariants.map((option) => option.category))
  );
  const selectedTypingSoundVariant =
    typingSoundVariants.find((variant) => variant.id === typingSoundVariantId) ??
    typingSoundVariants[0];

  const handleConfirmClearMediaCache = async () => {
    setClearingMediaCache(true);
    try {
      if (await onClearMediaCache()) {
        setConfirmingMediaCacheClear(false);
      }
    } finally {
      setClearingMediaCache(false);
    }
  };

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

  const renderAmbientAudioPreview = (
    audioConfig: Pick<AmbientAudioConfig, "imagePath">
  ) => (
    <Image
      src={audioConfig.imagePath}
      alt=""
      fill
      sizes="160px"
      className="rounded-[inherit] object-cover object-center"
      loading="lazy"
      draggable={false}
    />
  );

  const renderAmbientBackgroundPreview = (
    backgroundConfig: AmbientBackgroundConfig,
    label: string
  ) => {
    const { background } = backgroundConfig;
    return (
      <Image
        src={background.poster ?? background.fallbackImage ?? background.source}
        alt={label}
        fill
        sizes="160px"
        className="rounded-[inherit] object-cover object-center"
        loading="lazy"
      />
    );
  };

  const resolvedActiveAmbientPicker =
    isOpen && ambientEnabled ? activeAmbientPicker : null;
  const ambientPickerOptions =
    resolvedActiveAmbientPicker === "audio" ? ambientAudioOptions : ambientBackgroundOptions;
  const isAudioPicker = resolvedActiveAmbientPicker === "audio";
  const activeAmbientValue = isAudioPicker ? ambientAudioId : ambientBackgroundId;
  useEffect(() => {
    if (!resolvedActiveAmbientPicker) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        ambientPickerRef.current?.contains(target) ||
        document.getElementById("ambient-background-trigger")?.contains(target) ||
        document.getElementById("ambient-audio-trigger")?.contains(target)
      ) {
        return;
      }
      setActiveAmbientPicker(null);
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [resolvedActiveAmbientPicker]);

  const toggleAmbientPicker = (picker: "background" | "audio") => {
    if (activeAmbientPicker === picker) {
      setActiveAmbientPicker(null);
      return;
    }

    const trigger = document.getElementById(
      picker === "audio" ? "ambient-audio-trigger" : "ambient-background-trigger"
    );
    const drawer = document.querySelector<HTMLElement>(
      '[data-drawer-root="settings"]'
    );
    if (trigger && drawer) {
      const triggerBounds = trigger.getBoundingClientRect();
      const drawerBounds = drawer.getBoundingClientRect();
      const pickerWidth = Math.min(310, window.innerWidth - 24);
      const left = Math.min(
        drawerBounds.right + 12,
        window.innerWidth - pickerWidth - 12
      );
      const maxPickerHeight = Math.min(window.innerHeight * 0.62, 520);
      const top = Math.max(
        12,
        Math.min(triggerBounds.top, window.innerHeight - maxPickerHeight - 12)
      );
      setAmbientPickerPosition({ top, left });
    }
    setActiveAmbientPicker(picker);
  };
  useEffect(() => {
    if (!resolvedActiveAmbientPicker) {
      return;
    }

    window.requestAnimationFrame(() => {
      ambientPickerRef.current
        ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus();
    });
  }, [resolvedActiveAmbientPicker]);

  return (
    <>
    <aside
      aria-hidden={!isOpen}
      data-drawer-root="settings"
      className={`fixed left-3 sm:left-4 z-30 flex h-[84vh] max-h-[calc(100dvh-2rem)] w-[310px] sm:w-[320px] max-w-[calc(100vw-1.5rem)] flex-col overflow-visible rounded-[34px] squircle-outer border border-black/10 dark:border-white/14 bg-white/70 dark:bg-zinc-950/75 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl will-change-[translate,opacity] transition-[opacity,translate] duration-[360ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] drawer-position-center ${isOpen
        ? "opacity-100 pointer-events-auto drawer-enter-from-left"
        : "pointer-events-none opacity-0 drawer-off-left"
        }`}
    >
      <div className="flex h-full max-h-full w-full min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] squircle-inner border border-black/[0.07] dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)]">
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
          ref={scrollRef}
          onScroll={checkScrollFades}
          data-settings-scroll
          data-scroll-fade={
            !showTopFade && !showBottomFade
              ? "none"
              : showTopFade && showBottomFade
              ? "both"
              : showTopFade
              ? "top"
              : "bottom"
          }
          className="h-full space-y-6 overflow-y-auto pr-1 pt-2 pb-4 transition-[mask-image] duration-300"
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
              Font Style
            </div>
            <FontSwitcher menuSide="bottom" showTooltip={false} />
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
            <HugeiconsIcon icon={BookOpenTextIcon} size={16} strokeWidth={1.6} className="text-zinc-500 dark:text-zinc-400" />
            Markdown Preview
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={markdownToolsEnabled}
            onClick={() => onMarkdownToolsEnabledChange(!markdownToolsEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${markdownToolsEnabled
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${markdownToolsEnabled ? "translate-x-5" : "translate-x-0.5"
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
          <div className={`mt-2 ${typingEffectsEnabled ? "" : "opacity-60"}`}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                Sound Style
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={!typingEffectsEnabled}
                    className="inline-flex h-8 min-w-[132px] items-center justify-between gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="truncate">
                      {selectedTypingSoundVariant?.label ?? "Select"}
                    </span>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={13}
                      strokeWidth={2}
                      className="text-zinc-500 dark:text-zinc-400"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Choose typing sound</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={typingSoundVariantId}
                    onValueChange={(value) =>
                      onTypingSoundVariantChange(value as TypingSoundVariantId)
                    }
                  >
                    {typingSoundCategories.map((category, index) => (
                      <Fragment key={category}>
                        {index > 0 ? <DropdownMenuSeparator /> : null}
                        <DropdownMenuLabel className="py-1 text-[10px] uppercase tracking-[0.08em]">
                          {category}
                        </DropdownMenuLabel>
                        {typingSoundVariants
                          .filter((option) => option.category === category)
                          .map((option) => (
                            <DropdownMenuRadioItem key={option.id} value={option.id}>
                              {option.label}
                            </DropdownMenuRadioItem>
                          ))}
                      </Fragment>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="typing-sound-volume-range"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400"
                >
                  Volume
                </label>
                <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                  {typingSoundVolume}%
                </span>
              </div>
              <input
                id="typing-sound-volume-range"
                type="range"
                min={0}
                max={60}
                step={1}
                value={typingSoundVolume}
                disabled={!typingEffectsEnabled}
                onChange={(event) =>
                  onTypingSoundVolumeChange(Number(event.target.value))
                }
                className="w-full accent-zinc-800 dark:accent-zinc-200 disabled:cursor-not-allowed"
              />
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
                className="group flex items-center justify-between text-xs font-medium text-zinc-700/90 transition-colors hover:text-zinc-900 dark:text-zinc-200/90 dark:hover:text-zinc-50"
              >
                <span>{item.label}</span>
                {item.hasBadge && (
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                )}
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
            <div className={`mt-3 space-y-3 ${ambientEnabled ? "" : "opacity-60"}`}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="ambient-background-trigger"
                  type="button"
                  disabled={!ambientEnabled}
                  onClick={() => toggleAmbientPicker("background")}
                  className={`group relative isolate aspect-[1.45] min-h-[86px] overflow-hidden rounded-[18px] border border-white/45 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-300 dark:border-white/12 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70 ${activeAmbientPicker === "background"
                    ? "border-zinc-900/55 ring-1 ring-inset ring-zinc-900/55 dark:border-zinc-100/60 dark:ring-zinc-100/60"
                    : "hover:border-black/20 dark:hover:border-white/20"
                    }`}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-[inherit] transition-transform duration-300 group-hover:scale-[1.04]">
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
                  onClick={() => toggleAmbientPicker("audio")}
                  className={`group relative isolate aspect-[1.45] min-h-[86px] overflow-hidden rounded-[18px] border border-white/45 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-300 dark:border-white/12 dark:focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-70 ${activeAmbientPicker === "audio"
                    ? "border-white/80 ring-1 ring-inset ring-white/65 dark:border-white/45 dark:ring-white/45"
                    : "hover:border-white/80 dark:hover:border-white/35"
                    }`}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#e8e4dc] transition-transform duration-300 motion-safe:group-hover:scale-[1.03]">
                    {renderAmbientAudioPreview(selectedAmbientAudio)}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-[#f5f1e9]/95 via-[#f5f1e9]/10 to-transparent" />
                  <span className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/50" />
                  <span className="absolute left-2 top-2 z-[2] rounded-full bg-[#f5f1e9]/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-700 backdrop-blur-sm">
                    Audio
                  </span>
                  <span className="absolute inset-x-2 bottom-2 z-[2] truncate text-xs font-semibold text-zinc-800">
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

          <div id="media-cache-settings" className="border-t border-black/5 pt-4 dark:border-white/10">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500/75 dark:text-zinc-400/70">
              Media Cache
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              Pasted images are saved on this device so they stay available after reloads.
            </p>
            <div className="mt-3 rounded-2xl border border-black/5 bg-black/[0.025] px-3 py-2.5 dark:border-white/8 dark:bg-white/[0.035]">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-600 dark:text-zinc-300">Stored images</span>
                <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                  {mediaCacheUsage
                    ? formatMediaCacheSize(mediaCacheUsage.bytes)
                    : mediaCacheReadFailed
                      ? "Unavailable"
                      : "Checking…"}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                {mediaCacheUsage
                  ? `${mediaCacheUsage.count} ${mediaCacheUsage.count === 1 ? "image" : "images"} on this device.`
                  : mediaCacheReadFailed
                    ? "Could not read this device’s storage."
                    : "Checking storage…"}
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Clear it to delete saved images here. Note text stays; synced copies may return.
            </p>
            {confirmingMediaCacheClear ? (
              <div
                role="alertdialog"
                aria-label="Confirm clearing media cache"
                className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.045] p-3 dark:border-rose-300/15 dark:bg-rose-300/[0.045]"
              >
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                  Delete {mediaCacheUsage?.count ?? 0} stored {mediaCacheUsage?.count === 1 ? "image" : "images"} ({formatMediaCacheSize(mediaCacheUsage?.bytes ?? 0)})?
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                  This can’t be undone for this device. You can cancel and keep your images.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingMediaCacheClear(false)}
                    disabled={clearingMediaCache}
                    className="rounded-full px-3 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-black/5 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleConfirmClearMediaCache()}
                    disabled={clearingMediaCache || !mediaCacheUsage?.count}
                    className="rounded-full bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-500 dark:hover:bg-rose-400"
                  >
                    {clearingMediaCache ? "Clearing…" : "Delete images"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingMediaCacheClear(true)}
                disabled={!mediaCacheUsage?.count || mediaCacheReadFailed}
                className="mt-3 rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-rose-500/30 hover:bg-rose-500/[0.04] hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/12 dark:text-zinc-300 dark:hover:border-rose-300/20 dark:hover:bg-rose-300/[0.05] dark:hover:text-rose-200"
              >
                Clear Media Cache
              </button>
            )}
          </div>


        </div>
      </div>
      </div>
    </aside>
    <div
      ref={ambientPickerRef}
      aria-hidden={!resolvedActiveAmbientPicker}
      aria-label={isAudioPicker ? "Choose ambient audio" : "Choose ambient scene"}
      data-ambient-dropdown-content
      role="dialog"
      style={ambientPickerPosition ?? { top: 12, left: 12 }}
      className={`fixed z-40 w-[310px] max-w-[calc(100vw-24px)] transition-[opacity,translate] duration-300 ease-out ${resolvedActiveAmbientPicker
        ? "pointer-events-auto opacity-100 translate-x-0 translate-y-0"
        : "pointer-events-none opacity-0 -translate-x-3 translate-y-0"
        }`}
    >
      <div
        className={`relative max-h-[48vh] overflow-y-auto overflow-x-hidden rounded-[30px] squircle-outer border border-black/10 dark:border-white/14 p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.22)] backdrop-blur-3xl md:max-h-[62vh] ${
          isAudioPicker
            ? "bg-[linear-gradient(145deg,rgba(239,246,247,0.88),rgba(248,249,252,0.84)_55%,rgba(239,241,249,0.88))] dark:bg-[linear-gradient(145deg,rgba(39,48,56,0.94),rgba(24,24,27,0.96)_55%,rgba(35,38,51,0.94))]"
            : "bg-[linear-gradient(145deg,rgba(245,247,249,0.9),rgba(250,250,250,0.86)_55%,rgba(241,244,246,0.9))] dark:bg-[linear-gradient(145deg,rgba(38,43,49,0.94),rgba(24,24,27,0.96)_55%,rgba(36,39,45,0.94))]"
        }`}
      >
        <div className="relative z-[1]">
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
        <div className="isolate grid grid-cols-2 overflow-hidden rounded-[26px]">
          {ambientPickerOptions.map((option, index) => {
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={option.id === activeAmbientValue}
                onClick={() => {
                  if (isAudioPicker) {
                    onAmbientAudioChange(option.id as AmbientAudioId);
                  } else {
                    onAmbientBackgroundChange(option.id as AmbientBackgroundId);
                  }
                  setActiveAmbientPicker(null);
                }}
                className={`group relative isolate aspect-[1.22] overflow-hidden rounded-none text-left outline-none transition-[filter] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-700 ${
                  isAudioPicker
                    ? "bg-white/52 hover:brightness-[1.03] dark:bg-white/14"
                    : "bg-white/45 hover:brightness-[1.03] dark:bg-white/10"
                } ${
                  index % 2 === 0 && index < ambientPickerOptions.length - 1
                    ? "border-r border-white/30 dark:border-white/12"
                    : ""
                } ${
                  index < ambientPickerOptions.length - 2
                    ? "border-b border-white/30 dark:border-white/12"
                    : ""
                }`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                  {"imagePath" in option ? (
                    renderAmbientAudioPreview(option)
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
                      ? "bg-gradient-to-t from-[#f5f1e9]/95 via-[#f5f1e9]/10 to-transparent"
                      : "bg-gradient-to-t from-black/42 via-black/8 to-transparent dark:from-black/52"
                  }`}
                />
                <p
                  className={`absolute inset-x-2 bottom-2 truncate text-center text-xs font-semibold ${
                    isAudioPicker
                      ? "text-zinc-800"
                      : "text-white/95"
                  }`}
                >
                  {option.label}
                </p>
                {option.id === activeAmbientValue ? (
                  <span className="absolute right-2 top-2 z-[3] flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md ring-1 ring-black/10 dark:bg-zinc-900/85 dark:text-white dark:ring-white/15">
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.2} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
