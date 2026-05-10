"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  hasPreferenceConsent,
} from "@/lib/consent";

type FontType = "sans" | "mono" | "pixel";

interface FontContextType {
  font: FontType;
  setFont: (font: FontType) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

function isValidFont(value: string | null): value is FontType {
  return value === "sans" || value === "mono" || value === "pixel";
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontType>(() => {
    if (typeof window === "undefined") {
      return "sans";
    }
    if (!hasPreferenceConsent()) {
      return "sans";
    }

    const savedFont = window.localStorage.getItem("app-font");
    return isValidFont(savedFont) ? savedFont : "sans";
  });

  const setFont = (newFont: FontType) => {
    setFontState(newFont);
    if (hasPreferenceConsent()) {
      localStorage.setItem("app-font", newFont);
    }
  };

  useEffect(() => {
    const syncFont = () => {
      if (!hasPreferenceConsent()) {
        return;
      }
      const savedFont = window.localStorage.getItem("app-font");
      if (isValidFont(savedFont)) {
        setFontState(savedFont);
      }
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, syncFont);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, syncFont);
    };
  }, []);

  // Sync state to DOM
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font", font);
    }
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}
