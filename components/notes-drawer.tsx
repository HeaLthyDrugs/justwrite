"use client";

import { useMemo } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  NoteAddIcon,
  NoteIcon,
  PanelRightCloseIcon,
  Pin02Icon,
  PinOffIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@/components/ui/icon-button";
import {
  formatNoteDateTime,
  getNoteDisplayTitle,
  type Note,
} from "@/lib/notes-storage";

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  className?: string;
}

const rowSpring = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.72,
} as const;

function NotesSection({
  title,
  notes,
  activeNoteId,
  onSelectNote,
  onTogglePin,
  onDeleteNote,
}: {
  title: string;
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <div className="mt-3 space-y-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {notes.map((note) => {
            const isActive = note.id === activeNoteId;

            return (
              <motion.div
                key={note.id}
                layout
                layoutId={`note-row-${note.id}`}
                initial={{ opacity: 0, scale: 0.985, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={rowSpring}
                className={`group flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "border-zinc-900/10 bg-black/10 dark:border-white/15 dark:bg-white/10"
                    : "border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                }`}
              >
                <motion.button
                  type="button"
                  onClick={() => onSelectNote(note.id)}
                  whileTap={{ scale: 0.994 }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                    <HugeiconsIcon icon={NoteIcon} size={16} strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      {getNoteDisplayTitle(note, 42)}
                    </div>
                    <div className="truncate text-xs text-zinc-500">
                      Updated {formatNoteDateTime(note.updatedAt)}
                    </div>
                  </div>
                </motion.button>
                <div className="ml-2 flex items-center gap-1">
                  <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
                    <IconButton
                      label={note.isPinned ? "Unpin note" : "Pin note"}
                      className={`h-8 w-8 border-none bg-black/5 dark:bg-white/5 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      onClick={() => onTogglePin(note.id)}
                    >
                      <motion.span
                        key={note.isPinned ? "unpinned" : "pinned"}
                        initial={{ rotate: -20, scale: 0.8, opacity: 0.55 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 20, scale: 0.8, opacity: 0.5 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="inline-flex"
                      >
                        <HugeiconsIcon
                          icon={note.isPinned ? PinOffIcon : Pin02Icon}
                          size={14}
                          strokeWidth={1.6}
                        />
                      </motion.span>
                    </IconButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      label="Delete note"
                      className={`h-8 w-8 border-none bg-black/5 dark:bg-white/5 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      onClick={() => onDeleteNote(note.id)}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        size={14}
                        strokeWidth={1.6}
                      />
                    </IconButton>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export function NotesDrawer({
  isOpen,
  onClose,
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  onDeleteNote,
  className = "",
}: NotesDrawerProps) {
  const sortedNotes = useMemo(
    () =>
      [...notes].sort((left, right) => {
        if (left.isPinned !== right.isPinned) {
          return left.isPinned ? -1 : 1;
        }

        return (
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
      }),
    [notes]
  );

  const pinnedNotes = sortedNotes.filter((note) => note.isPinned);
  const unpinnedNotes = sortedNotes.filter((note) => !note.isPinned);

  return (
    <LayoutGroup id="notes-drawer">
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-6 top-1/2 z-30 w-[320px] -translate-y-1/2 rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
            Notes
            <motion.span
              layout
              className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] tracking-normal text-zinc-500 dark:bg-white/10 dark:text-zinc-300"
            >
              {notes.length}
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
              <IconButton
                label="New note"
                className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
                onClick={onCreateNote}
              >
                <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
              <IconButton
                label="Close drawer"
                className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
                onClick={onClose}
              >
                <HugeiconsIcon
                  icon={PanelRightCloseIcon}
                  size={16}
                  strokeWidth={1.6}
                />
              </IconButton>
            </motion.div>
          </div>
        </div>

        <motion.div layout className="mt-6 space-y-5">
          <AnimatePresence initial={false}>
            {pinnedNotes.length > 0 ? (
              <NotesSection
                key="pinned-section"
                title="Pinned"
                notes={pinnedNotes}
                activeNoteId={activeNoteId}
                onSelectNote={onSelectNote}
                onTogglePin={onTogglePin}
                onDeleteNote={onDeleteNote}
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {unpinnedNotes.length > 0 ? (
              <NotesSection
                key="all-section"
                title="All Notes"
                notes={unpinnedNotes}
                activeNoteId={activeNoteId}
                onSelectNote={onSelectNote}
                onTogglePin={onTogglePin}
                onDeleteNote={onDeleteNote}
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {notes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="rounded-2xl border border-black/5 bg-white/40 px-4 py-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                No notes yet. Create one to get started.
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </aside>
    </LayoutGroup>
  );
}
