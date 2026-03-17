"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontType = "sans" | "mono" | "pixel";

interface FontContextType {
  font: FontType;
  setFont: (font: FontType) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontType>("sans");

  // Load from localStorage on mount
  useEffect(() => {
    const savedFont = localStorage.getItem("app-font") as FontType;
    if (savedFont && ["sans", "mono", "pixel"].includes(savedFont)) {
      setFontState(savedFont);
    }
  }, []);

  const setFont = (newFont: FontType) => {
    setFontState(newFont);
    localStorage.setItem("app-font", newFont);
  };

  // Sync state to DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
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
