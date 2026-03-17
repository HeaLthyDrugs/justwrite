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
    <div className="min-h-screen bg-[#f6f6f7] text-zinc-900 dark:bg-[#0f0f10] dark:text-zinc-50">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f6f6f7_55%,_#efeff1_100%)] px-4 py-16 dark:bg-[radial-gradient(circle_at_top,_#1f1f21_0%,_#121214_55%,_#0f0f10_100%)]">
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[900px] items-center">
          <main className="relative w-full rounded-[28px] border border-white/60 bg-white/70 p-10 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70">
            <div
              className={`absolute left-10 right-10 top-8 flex items-center justify-between gap-6 transition-all duration-200 ${chromeClass}`}
            >
              <div className="flex items-center gap-3">
                <IconBadge label="Justwrite">
                  <HugeiconsIcon icon={NoteIcon} size={18} strokeWidth={1.6} />
                </IconBadge>
              </div>
              <div className="flex items-center gap-3">
                <IconButton
                  label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
                  onClick={() => setDrawerOpen((prev) => !prev)}
                  pressed={drawerOpen}
                >
                  <HugeiconsIcon
                    icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
                    size={18}
                    strokeWidth={1.6}
                  />
                </IconButton>
                <IconButton label="Pin note">
                  <HugeiconsIcon icon={PinIcon} size={18} strokeWidth={1.6} />
                </IconButton>
                <IconButton
                  label={
                    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                  }
                  onClick={() =>
                    setTheme((current) => (current === "dark" ? "light" : "dark"))
                  }
                  pressed={theme === "dark"}
                >
                  <HugeiconsIcon
                    icon={theme === "dark" ? Sun01Icon : MoonIcon}
                    size={18}
                    strokeWidth={1.6}
                  />
                </IconButton>
                <IconButton label="More actions">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    size={18}
                    strokeWidth={1.6}
                  />
                </IconButton>
                <FontSwitcher />
              </div>
            </div>

            {focusMode ? (
              <IconButton
                label="Exit focus mode"
                onClick={toggleFocus}
                className="absolute right-8 top-8"
              >
                <HugeiconsIcon
                  icon={CenterFocusIcon}
                  size={18}
                  strokeWidth={1.6}
                />
              </IconButton>
            ) : null}

            <div className="flex flex-col gap-6 pt-20 pb-24">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Untitled Note"
                className="w-full rounded-2xl bg-black/5 px-5 py-4 text-3xl font-semibold text-zinc-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] outline-none transition focus:bg-black/10 dark:bg-white/5 dark:text-white dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.16)] dark:focus:bg-white/10"
              />

              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Start writing with a calm, focused mind..."
                className="min-h-[420px] w-full resize-none rounded-[24px] bg-white/80 px-8 py-8 text-base leading-[1.7] text-zinc-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/5 focus:outline-none dark:bg-[#1b1b1d]/80 dark:text-zinc-100 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] dark:ring-white/10 dark:placeholder:text-zinc-500/80"
              />
            </div>

            <div
              className={`absolute bottom-8 left-10 flex items-center gap-2 text-xs text-zinc-500 transition-all duration-200 ${chromeClass}`}
            >
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {wordCount} words
              </span>
              <span className="text-zinc-400">•</span>
              <span>Saved locally</span>
            </div>
            <div
              className={`absolute bottom-6 right-10 flex flex-wrap items-center gap-2 transition-all duration-200 ${chromeClass}`}
            >
              <PillButton label="New note">
                <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
              </PillButton>
              <PillButton label="Export">
                <HugeiconsIcon icon={FileExportIcon} size={16} strokeWidth={1.6} />
              </PillButton>
              <PillButton label="Share">
                <HugeiconsIcon icon={Share01Icon} size={16} strokeWidth={1.6} />
              </PillButton>
              <PillButton
                label={focusMode ? "Exit focus" : "Focus mode"}
                onClick={toggleFocus}
                pressed={focusMode}
              >
                <HugeiconsIcon icon={CenterFocusIcon} size={16} strokeWidth={1.6} />
              </PillButton>
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

        <div
          className={`fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-2 shadow-[0_12px_30px_rgba(15,15,15,0.12)] backdrop-blur-xl transition-all duration-200 dark:border-white/10 dark:bg-[#161618]/80 ${chromeClass}`}
        >
          <ToolbarButton label="New note">
            <HugeiconsIcon icon={NoteAddIcon} size={18} strokeWidth={1.6} />
          </ToolbarButton>
          <ToolbarButton label="Search">
            <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.6} />
          </ToolbarButton>
          <ToolbarButton label="Export">
            <HugeiconsIcon icon={FileExportIcon} size={18} strokeWidth={1.6} />
          </ToolbarButton>
          <ToolbarButton
            label={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            pressed={theme === "dark"}
          >
            <HugeiconsIcon
              icon={theme === "dark" ? Sun01Icon : MoonIcon}
              size={18}
              strokeWidth={1.6}
            />
          </ToolbarButton>
          <ToolbarButton
            label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
            onClick={() => setDrawerOpen((prev) => !prev)}
            pressed={drawerOpen}
          >
            <HugeiconsIcon
              icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
              size={18}
              strokeWidth={1.6}
            />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}
