"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  clearInstallPromptDismissal,
  isInstallPromptCoolingDown,
  isStandaloneDisplayMode,
  PWA_INSTALL_AVAILABILITY_EVENT,
  PWA_TRIGGER_INSTALL_EVENT,
  rememberInstallPromptDismissal,
} from "@/lib/pwa";

type InstallSurface = "chromium" | "ios" | "mac-safari" | "unsupported";

function getInstallSurface(): InstallSurface {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  const isMac = /Mac/.test(platform) && !isIOS;
  const isSafari =
    /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(userAgent);

  if (isIOS) {
    return "ios";
  }

  if (isMac && isSafari) {
    return "mac-safari";
  }

  return "unsupported";
}

interface PwaInstallPromptProps {
  hidden?: boolean;
}

export function PwaInstallPrompt({
  hidden = false,
}: PwaInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [surface, setSurface] = useState<InstallSurface>(() =>
    typeof window === "undefined" ? "unsupported" : getInstallSurface()
  );
  const [isStandalone, setIsStandalone] = useState(isStandaloneDisplayMode);
  const [isDismissed, setIsDismissed] = useState(() =>
    typeof window === "undefined" ? true : isInstallPromptCoolingDown()
  );
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const syncStandalone = () => setIsStandalone(isStandaloneDisplayMode());
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setSurface("chromium");
      setIsStandalone(false);
    };
    const handleInstalled = () => {
      clearInstallPromptDismissal();
      setDeferredPrompt(null);
      setIsStandalone(true);
      setIsDismissed(true);
      setGuideOpen(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleInstalled);
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", syncStandalone);
    } else {
      legacyMediaQuery.addListener?.(syncStandalone);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleInstalled);
      if ("removeEventListener" in mediaQuery) {
        mediaQuery.removeEventListener("change", syncStandalone);
      } else {
        legacyMediaQuery.removeListener?.(syncStandalone);
      }
    };
  }, []);

  const canShowPrompt =
    !hidden &&
    !isStandalone &&
    !isDismissed &&
    (deferredPrompt !== null ||
      surface === "ios" ||
      surface === "mac-safari");

  const title = useMemo(() => {
    if (surface === "ios") {
      return "Install on your home screen";
    }

    if (surface === "mac-safari") {
      return "Add Justwrite to your dock";
    }

    return "Install Justwrite";
  }, [surface]);

  const description = useMemo(() => {
    if (surface === "ios") {
      return "Open the share menu, then add Justwrite to your home screen for a full app-like writing space.";
    }

    if (surface === "mac-safari") {
      return "Safari can pin Justwrite to your dock so it opens like a desktop app.";
    }

    return "Launch it like an app and keep your writing tools ready offline.";
  }, [surface]);

  const guideSteps = useMemo(() => {
    if (surface === "ios") {
      return [
        "Open the browser share menu.",
        "Choose Add to Home Screen.",
        "Tap Add to install Justwrite.",
      ];
    }

    return [
      "Open Safari's File menu.",
      "Choose Add to Dock.",
      "Confirm the app name to install Justwrite.",
    ];
  }, [surface]);

  const primaryLabel = deferredPrompt ? "Install" : "Show steps";

  const handleDismiss = () => {
    rememberInstallPromptDismissal();
    setIsDismissed(true);
    setGuideOpen(false);
  };

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      if (surface === "ios" || surface === "mac-safari") {
        setGuideOpen(true);
      }
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      clearInstallPromptDismissal();
      setIsStandalone(true);
      setIsDismissed(true);
      return;
    }

    rememberInstallPromptDismissal();
    setIsDismissed(true);
  }, [deferredPrompt, surface]);

  useEffect(() => {
    const isAvailable =
      !isStandalone &&
      (deferredPrompt !== null ||
        surface === "ios" ||
        surface === "mac-safari");

    window.dispatchEvent(
      new CustomEvent(PWA_INSTALL_AVAILABILITY_EVENT, {
        detail: {
          available: isAvailable,
          installed: isStandalone,
        },
      })
    );
  }, [deferredPrompt, isStandalone, surface]);

  useEffect(() => {
    const handleExternalInstallTrigger = () => {
      void handleInstall();
    };

    window.addEventListener(PWA_TRIGGER_INSTALL_EVENT, handleExternalInstallTrigger);
    return () => {
      window.removeEventListener(
        PWA_TRIGGER_INSTALL_EVENT,
        handleExternalInstallTrigger
      );
    };
  }, [handleInstall]);

  if (!canShowPrompt) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-18 z-50 flex justify-center px-3 md:bottom-5">
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-[28px] border border-black/5 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,15,15,0.14)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/88 dark:ring-white/10">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
            <Image
              src="/logo/justwrite-logo-light.svg"
              alt="Justwrite logo"
              width={22}
              height={24}
              className="block dark:hidden"
            />
            <Image
              src="/logo/justwrite-logo-dark.svg"
              alt="Justwrite logo"
              width={22}
              height={24}
              className="hidden dark:block"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-full bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              onClick={() => {
                void handleInstall();
              }}
            >
              {primaryLabel}
            </Button>
            {/* <button
              type="button"
              aria-label="Dismiss install prompt"
              onClick={handleDismiss}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={14}
                strokeWidth={1.8}
              />
            </button> */}
          </div>
        </div>
      </div>

      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-[32px] border border-black/5 bg-white/95 p-6 shadow-[0_28px_60px_rgba(15,15,15,0.18)] dark:border-white/10 dark:bg-zinc-950/95">
          <DialogHeader className="gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              <Image
                src="/logo/justwrite-logo-light.svg"
                alt="Justwrite logo"
                width={26}
                height={28}
                className="block dark:hidden"
              />
              <Image
                src="/logo/justwrite-logo-dark.svg"
                alt="Justwrite logo"
                width={26}
                height={28}
                className="hidden dark:block"
              />
            </div>
            <DialogTitle className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {description}
            </DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            {guideSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleDismiss}
            >
              Hide for now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
