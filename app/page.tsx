"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CenterFocusIcon,
  CheckmarkCircle01Icon,
  FileExportIcon,
  Folder01Icon,
  FolderAddIcon,
  FolderPinIcon,
  MoonIcon,
  MoreHorizontalIcon,
  NoteAddIcon,
  NoteIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  PinIcon,
  Search01Icon,
  Share01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconBadge } from "@/components/ui/icon-badge";
import { IconButton } from "@/components/ui/icon-button";
import { PillButton } from "@/components/ui/pill-button";
import { ToolbarButton } from "@/components/ui/toolbar-button";

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
            className="h-full w-full resize-none rounded-[32px] border border-white/60 bg-white/70 px-8 py-8 text-lg leading-[1.8] text-zinc-800 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl focus:outline-none dark:border-white/10 dark:bg-[#161618]/70 dark:text-zinc-100 dark:ring-white/10 dark:placeholder:text-zinc-500/80 md:px-12 md:py-12 md:text-xl lg:px-16 lg:py-16"
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

      <aside
        className={`fixed right-6 top-1/2 z-30 w-[320px] -translate-y-1/2 rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-xl transition-all duration-200 dark:border-white/10 dark:bg-[#161618]/85 ${drawerClass}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
            Notes
          </div>
          <div className="flex items-center gap-2">
            <IconButton label="Search notes" className="h-8 w-8">
              <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.6} />
            </IconButton>
            <IconButton label="New folder" className="h-8 w-8">
              <HugeiconsIcon icon={FolderAddIcon} size={16} strokeWidth={1.6} />
            </IconButton>
            <IconButton label="New note" className="h-8 w-8">
              <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
            </IconButton>
            <IconButton
              label="Close drawer"
              className="h-8 w-8"
              onClick={() => setDrawerOpen(false)}
            >
              <HugeiconsIcon
                icon={PanelRightCloseIcon}
                size={16}
                strokeWidth={1.6}
              />
            </IconButton>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Pinned
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-[#1b1b1d]/80">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                    <HugeiconsIcon
                      icon={Folder01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      Drafts
                    </div>
                    <div className="text-xs text-zinc-500">3 notes</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label="Unpin folder" className="h-8 w-8">
                    <HugeiconsIcon
                      icon={FolderPinIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                  <IconButton label="More" className="h-8 w-8">
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-[#1b1b1d]/80">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                    <HugeiconsIcon
                      icon={NoteIcon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      Meeting Flow
                    </div>
                    <div className="text-xs text-zinc-500">Updated 2m ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label="Unpin note" className="h-8 w-8">
                    <HugeiconsIcon
                      icon={PinIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                  <IconButton label="More" className="h-8 w-8">
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Folders
            </div>
            <div className="mt-3 space-y-2">
              {[
                { name: "Projects", count: "12 notes" },
                { name: "Ideas", count: "7 notes" },
                { name: "Personal", count: "5 notes" },
              ].map((folder) => (
                <div
                  key={folder.name}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-[#1b1b1d]/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                      <HugeiconsIcon
                        icon={Folder01Icon}
                        size={16}
                        strokeWidth={1.6}
                      />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {folder.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {folder.count}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label="Pin folder" className="h-8 w-8">
                      <HugeiconsIcon
                        icon={FolderPinIcon}
                        size={14}
                        strokeWidth={1.6}
                      />
                    </IconButton>
                    <IconButton label="More" className="h-8 w-8">
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        size={14}
                        strokeWidth={1.6}
                      />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Recent Notes
            </div>
            <div className="mt-3 space-y-2">
              {[
                { name: "Calm UI Notes", meta: "Edited today" },
                { name: "Pitch Outline", meta: "Edited yesterday" },
              ].map((note) => (
                <div
                  key={note.name}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-[#1b1b1d]/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                      <HugeiconsIcon icon={NoteIcon} size={16} strokeWidth={1.6} />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {note.name}
                      </div>
                      <div className="text-xs text-zinc-500">{note.meta}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label="Pin note" className="h-8 w-8">
                      <HugeiconsIcon icon={PinIcon} size={14} strokeWidth={1.6} />
                    </IconButton>
                    <IconButton label="More" className="h-8 w-8">
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        size={14}
                        strokeWidth={1.6}
                      />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
