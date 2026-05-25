"use client";

import { useEffect } from "react";
import { hasPreferenceConsent } from "@/lib/consent";
import {
  THEME_SHORTCUT_TOGGLED_EVENT,
  type AppTheme,
} from "@/lib/theme-shortcut";

const THEME_STORAGE_KEY = "app-theme";

export function GlobalThemeShortcut() {
  useEffect(() => {
    const handleGlobalThemeShortcut = (event: KeyboardEvent) => {
      if (
        !event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.repeat
      ) {
        return;
      }

      if (event.code !== "Digit2" && event.code !== "Numpad2") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const root = document.documentElement;
      const nextTheme: AppTheme = root.classList.contains("dark")
        ? "light"
        : "dark";

      root.classList.toggle("dark", nextTheme === "dark");
      if (hasPreferenceConsent()) {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      }

      window.dispatchEvent(
        new CustomEvent<AppTheme>(THEME_SHORTCUT_TOGGLED_EVENT, {
          detail: nextTheme,
        })
      );
    };

    document.addEventListener("keydown", handleGlobalThemeShortcut, true);
    return () =>
      document.removeEventListener("keydown", handleGlobalThemeShortcut, true);
  }, []);

  return null;
}
