"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
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
  rememberInstallPromptSnooze,
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

  const handleRemindLater = () => {
    rememberInstallPromptSnooze();
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
        <div className="pointer-events-auto flex w-full max-w-md flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white/92 shadow-[0_22px_55px_rgba(15,15,15,0.16)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90 dark:ring-white/10">
          <div className="flex items-start gap-3 p-4 pb-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
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
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {description}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss install prompt"
              onClick={handleDismiss}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={14}
                strokeWidth={1.8}
              />
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-2xl bg-zinc-50/90 px-3 py-2.5 text-xs leading-relaxed text-zinc-600 ring-1 ring-black/5 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
              Install Justwrite for faster launch, a cleaner writing space, and better offline access.
            </div>
          </div>

          <div className="mt-auto flex flex-col-reverse gap-2 border-t border-black/5 bg-white/75 p-3 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-zinc-950/40">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleRemindLater}
            >
              Remind me later
            </Button>
            <Button
              type="button"
              className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              onClick={() => {
                void handleInstall();
              }}
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[32px] border border-black/5 bg-white/95 p-0 shadow-[0_28px_60px_rgba(15,15,15,0.18)] dark:border-white/10 dark:bg-zinc-950/95"
        >
          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <DialogHeader className="gap-3 pr-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
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

            <ol className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              {guideSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-2xl bg-zinc-50/90 p-3 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <DialogFooter className="mt-auto border-t border-black/5 bg-white/75 p-4 sm:justify-end dark:border-white/10 dark:bg-zinc-950/50">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleRemindLater}
            >
              Remind me later
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => setGuideOpen(false)}
            >
              Got it
            </Button>
          </DialogFooter>

          <button
            type="button"
            aria-label="Close install guide"
            onClick={() => setGuideOpen(false)}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
