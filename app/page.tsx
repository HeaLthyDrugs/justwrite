"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CenterFocusIcon,
  FileExportIcon,
  MoonIcon,
  NoteAddIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";
import { NotesDrawer } from "@/components/notes-drawer";
import {
  createEmptyNote,
  formatNoteDateTime,
  type Note,
  loadNotesSnapshot,
  NOTES_STORAGE_VERSION,
  saveNotesSnapshot,
} from "@/lib/notes-storage";

interface NotesState {
  notes: Note[];
  activeNoteId: string;
}

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("app-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialNotesState(): NotesState {
  const snapshot = loadNotesSnapshot();
  if (snapshot && snapshot.notes.length > 0) {
    const firstNoteId = snapshot.notes[0].id;
    return {
      notes: snapshot.notes,
      activeNoteId: snapshot.activeNoteId ?? firstNoteId,
    };
  }

  const firstNote = createEmptyNote();
  return {
    notes: [firstNote],
    activeNoteId: firstNote.id,
  };
}

export default function Home() {
  const [focusMode, setFocusMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [notesState, setNotesState] = useState<NotesState>(getInitialNotesState);

  const notes = notesState.notes;
  const activeNoteId = notesState.activeNoteId;

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) ?? notes[0],
    [notes, activeNoteId]
  );

  const body = activeNote.body;

  const wordCount = useMemo(() => {
    const trimmed = body.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [body]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      saveNotesSnapshot({
        version: NOTES_STORAGE_VERSION,
        notes: notesState.notes,
        activeNoteId: notesState.activeNoteId,
      });
    }, 160);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notesState]);

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

  const updateActiveNote = (nextValues: Partial<Pick<Note, "body">>) => {
    setNotesState((previousState) => {
      let hasChanges = false;

      const updatedNotes = previousState.notes.map((note) => {
        if (note.id !== previousState.activeNoteId) {
          return note;
        }

        const nextBody = nextValues.body ?? note.body;
        if (nextBody === note.body) {
          return note;
        }

        hasChanges = true;
        return {
          ...note,
          body: nextBody,
          updatedAt: new Date().toISOString(),
        };
      });

      if (!hasChanges) {
        return previousState;
      }

      return {
        ...previousState,
        notes: updatedNotes,
      };
    });
  };

  const handleCreateNote = () => {
    const note = createEmptyNote();
    setNotesState((previousState) => ({
      notes: [note, ...previousState.notes],
      activeNoteId: note.id,
    }));
    setDrawerOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotesState((previousState) => {
      const remainingNotes = previousState.notes.filter((note) => note.id !== noteId);
      if (remainingNotes.length === 0) {
        const replacementNote = createEmptyNote();
        return {
          notes: [replacementNote],
          activeNoteId: replacementNote.id,
        };
      }

      if (previousState.activeNoteId === noteId) {
        return {
          notes: remainingNotes,
          activeNoteId: remainingNotes[0].id,
        };
      }

      return {
        ...previousState,
        notes: remainingNotes,
      };
    });
  };

  const handleTogglePinned = (noteId: string) => {
    setNotesState((previousState) => ({
      ...previousState,
      notes: previousState.notes.map((note) =>
        note.id === noteId
          ? {
            ...note,
            isPinned: !note.isPinned,
            updatedAt: new Date().toISOString(),
          }
          : note
      ),
    }));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className={`relative flex h-[95vh] w-full max-w-[1000px] flex-col transition-all duration-500 ease-in-out ${focusMode ? "py-0" : "py-14"}`}>
        <main className="relative flex h-full w-full flex-col">
          {/* Top Actions  */}
          <div
            className={`absolute -top-13 shadow-xs right-0 z-10 flex items-center gap-1 rounded-full border border-black/5 bg-white/80 p-1 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/80 ${chromeClass}`}
          >
            <IconButton
              label="New note"
              className="h-8 w-8 border-none"
              onClick={handleCreateNote}
            >
              <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
            </IconButton>

            <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />

            <FontSwitcher />

            <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />

            <IconButton
              label="Export"
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon icon={FileExportIcon} size={16} strokeWidth={1.6} />
            </IconButton>

            <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />

            <IconButton
              label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              pressed={theme === "dark"}
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun01Icon : MoonIcon}
                size={16}
                strokeWidth={1.6}
              />
            </IconButton>

            <IconButton
              label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
              onClick={() => setDrawerOpen((prev) => !prev)}
              pressed={drawerOpen}
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon
                icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
                size={16}
                strokeWidth={1.6}
              />
            </IconButton>

            <IconButton
              label={focusMode ? "Exit focus" : "Focus mode"}
              onClick={toggleFocus}
              pressed={focusMode}
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon icon={CenterFocusIcon} size={16} strokeWidth={1.6} />
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

          <section className="flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10">
            <textarea
              value={body}
              onChange={(event) => updateActiveNote({ body: event.target.value })}
              placeholder="Type here"
              className="h-full w-full resize-none px-8 py-8 text-lg leading-[1.8] text-zinc-800 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500/80 md:px-12 md:py-12 md:text-xl lg:px-16 lg:py-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            />
          </section>

          <div
            className={`absolute -bottom-10 left-0 flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-xs font-medium text-zinc-600 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 ${chromeClass}`}
          >
            <span className="text-zinc-800 dark:text-zinc-100">
              {wordCount} words
            </span>
            <div className="h-3.5 w-px bg-black/10 dark:bg-white/10" />
            <span className="inline-flex items-center gap-1.5">
              Saved {formatNoteDateTime(activeNote.updatedAt)}
            </span>
          </div>

        </main>
      </div>

      <NotesDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={(noteId) =>
          setNotesState((previousState) => ({
            ...previousState,
            activeNoteId: noteId,
          }))
        }
        onCreateNote={handleCreateNote}
        onTogglePin={handleTogglePinned}
        onDeleteNote={handleDeleteNote}
        className={drawerClass}
      />
    </div>
  );
}
