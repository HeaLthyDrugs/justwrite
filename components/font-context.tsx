"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

    const savedFont = window.localStorage.getItem("app-font");
    return isValidFont(savedFont) ? savedFont : "sans";
  });

  const setFont = (newFont: FontType) => {
    setFontState(newFont);
    localStorage.setItem("app-font", newFont);
  };

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
