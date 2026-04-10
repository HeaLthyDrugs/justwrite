"use client";

import { useMemo, useState } from "react";
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

function NotesSection({
  title,
  notes,
  activeNoteId,
  pendingDeleteNoteId,
  onSelectNote,
  onTogglePin,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  title: string;
  notes: Note[];
  activeNoteId: string | null;
  pendingDeleteNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onRequestDelete: (noteId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (noteId: string) => void;
}) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {notes.map((note) => {
          const isActive = note.id === activeNoteId;
          const isConfirmingDelete = note.id === pendingDeleteNoteId;

          return (
            <div
              key={note.id}
              className={`group flex w-full flex-col rounded-2xl border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-zinc-900/10 bg-black/10 dark:border-white/15 dark:bg-white/10"
                  : "border-black/5 bg-white/40 dark:border-white/5 dark:bg-white/5"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onCancelDelete();
                    onSelectNote(note.id);
                  }}
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
                </button>
                <div className="ml-2 flex items-center gap-1">
                  <IconButton
                    label={note.isPinned ? "Unpin note" : "Pin note"}
                    className={`h-8 w-8 border-none bg-black/5 dark:bg-white/5 ${
                      isActive || isConfirmingDelete
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={() => {
                      onCancelDelete();
                      onTogglePin(note.id);
                    }}
                  >
                    <HugeiconsIcon
                      icon={note.isPinned ? PinOffIcon : Pin02Icon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                  <IconButton
                    label={isConfirmingDelete ? "Cancel delete" : "Delete note"}
                    className={`h-8 w-8 border-none bg-black/5 dark:bg-white/5 ${
                      isActive || isConfirmingDelete
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={() =>
                      isConfirmingDelete
                        ? onCancelDelete()
                        : onRequestDelete(note.id)
                    }
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.6} />
                  </IconButton>
                </div>
              </div>

              {isConfirmingDelete ? (
                <div className="mt-2 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200/70 bg-rose-50/70 px-2.5 py-2 dark:border-rose-300/20 dark:bg-rose-500/10">
                    <p className="text-xs font-medium text-rose-700 dark:text-rose-200">
                      Delete this note?
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={onCancelDelete}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => onConfirmDelete(note.id)}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
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
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState<string | null>(
    null
  );

  const visiblePendingDeleteNoteId =
    pendingDeleteNoteId && notes.some((note) => note.id === pendingDeleteNoteId)
      ? pendingDeleteNoteId
      : null;

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
    <aside
      aria-hidden={!isOpen}
      className={`fixed right-6 top-1/2 z-30 w-[320px] -translate-y-1/2 rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
          Notes
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] tracking-normal text-zinc-500 dark:bg-white/10 dark:text-zinc-300">
            {notes.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            label="New note"
            className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
            onClick={onCreateNote}
          >
            <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
          </IconButton>
          <IconButton
            label="Close drawer"
            className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
            onClick={onClose}
          >
            <HugeiconsIcon icon={PanelRightCloseIcon} size={16} strokeWidth={1.6} />
          </IconButton>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {pinnedNotes.length > 0 ? (
          <NotesSection
            title="Pinned"
            notes={pinnedNotes}
            activeNoteId={activeNoteId}
            pendingDeleteNoteId={visiblePendingDeleteNoteId}
            onSelectNote={onSelectNote}
            onTogglePin={onTogglePin}
            onRequestDelete={setPendingDeleteNoteId}
            onCancelDelete={() => setPendingDeleteNoteId(null)}
            onConfirmDelete={(noteId) => {
              setPendingDeleteNoteId(null);
              onDeleteNote(noteId);
            }}
          />
        ) : null}
        {unpinnedNotes.length > 0 ? (
          <NotesSection
            title="All Notes"
            notes={unpinnedNotes}
            activeNoteId={activeNoteId}
            pendingDeleteNoteId={visiblePendingDeleteNoteId}
            onSelectNote={onSelectNote}
            onTogglePin={onTogglePin}
            onRequestDelete={setPendingDeleteNoteId}
            onCancelDelete={() => setPendingDeleteNoteId(null)}
            onConfirmDelete={(noteId) => {
              setPendingDeleteNoteId(null);
              onDeleteNote(noteId);
            }}
          />
        ) : null}
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white/40 px-4 py-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            No notes yet. Create one to get started.
          </div>
        ) : null}
      </div>
    </aside>
  );
}
