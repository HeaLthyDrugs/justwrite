"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CenterFocusIcon,
  FileExportIcon,
  MoonIcon,
  NoteAddIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  Share01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";
import { NotesDrawer } from "@/components/notes-drawer";

export default function Home() {
  const [focusMode, setFocusMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const wordCount = useMemo(() => {
    const trimmed = body.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [body]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const nextTheme = savedTheme ?? (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const chromeClass = focusMode
    ? "opacity-0 pointer-events-none translate-y-2"
    : "opacity-100";

  const drawerClass = focusMode
    ? "opacity-0 pointer-events-none translate-x-[420px]"
    : drawerOpen
      ? "opacity-100 translate-x-0"
      : "opacity-0 pointer-events-none translate-x-[420px]";

  const toggleFocus = () => {
    setFocusMode((prev) => {
      const next = !prev;
      if (next) {
        setDrawerOpen(false);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className={`relative flex h-[95vh] w-full max-w-[1000px] flex-col transition-all duration-500 ease-in-out ${focusMode ? "py-0" : "py-14"}`}>
        <main className="relative flex h-full w-full flex-col">
          {/* Top Actions  */}
          <div
            className={`absolute -top-13 shadow-xs right-0 z-10 flex items-center gap-1 rounded-full border border-black/5 bg-white/80 p-1 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/80 ${chromeClass}`}
          >
            <FontSwitcher />

            <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

            <IconButton
              label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              pressed={theme === "dark"}
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun01Icon : MoonIcon}
                size={18}
                strokeWidth={1.6}
              />
            </IconButton>

            <IconButton
              label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
              onClick={() => setDrawerOpen((prev) => !prev)}
              pressed={drawerOpen}
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon
                icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
                size={18}
                strokeWidth={1.6}
              />
            </IconButton>
          </div>

          {focusMode ? (
            <IconButton
              label="Exit focus mode"
              onClick={toggleFocus}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/80 backdrop-blur-md dark:bg-zinc-800/80"
            >
              <HugeiconsIcon
                icon={CenterFocusIcon}
                size={18}
                strokeWidth={1.6}
              />
            </IconButton>
          ) : null}

          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Start writing..."
            className="h-full w-full resize-none rounded-[32px] border border-white/60 bg-white/70 px-8 py-8 text-lg leading-[1.8] text-zinc-800 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl focus:outline-none dark:border-white/10 dark:bg-[#161618]/70 dark:text-zinc-100 dark:ring-white/10 dark:placeholder:text-zinc-500/80 md:px-12 md:py-12 md:text-xl lg:px-16 lg:py-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          />

          <div
            className={`absolute -bottom-10 left-0 flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-xs font-medium text-zinc-600 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 ${chromeClass}`}
          >
            <span className="text-zinc-800 dark:text-zinc-100">
              {wordCount} words
            </span>
          </div>

          <div
            className={`absolute -bottom-13 right-0 flex items-center gap-2 rounded-full border border-black/5 bg-white/80 p-1 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/80 ${chromeClass}`}
          >
            <IconButton
              label="New note"
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
            </IconButton>
            <IconButton
              label="Export"
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon icon={FileExportIcon} size={16} strokeWidth={1.6} />
            </IconButton>
            <IconButton
              label="Share"
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon icon={Share01Icon} size={16} strokeWidth={1.6} />
            </IconButton>
            <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />
            <IconButton
              label={focusMode ? "Exit focus" : "Focus mode"}
              onClick={toggleFocus}
              pressed={focusMode}
              className="h-9 w-9 border-none"
            >
              <HugeiconsIcon icon={CenterFocusIcon} size={16} strokeWidth={1.6} />
            </IconButton>
          </div>
        </main>
      </div>

      <NotesDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} className={drawerClass} />
    </div>
  );
}
