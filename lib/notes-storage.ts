export const NOTES_STORAGE_KEY = "justwrite.notes.v1";
export const NOTES_STORAGE_VERSION = 1;

export interface Note {
  id: string;
  body: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesSnapshot {
  version: number;
  notes: Note[];
  activeNoteId: string | null;
}

const noteDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function generateNoteId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIsoDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function sanitizeNote(value: unknown): Note | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "string" ? value.id : null;
  const legacyTitle = typeof value.title === "string" ? value.title.trim() : "";
  const rawBody = typeof value.body === "string" ? value.body : "";
  // Backward compatibility: older versions stored title separately.
  const body = rawBody.trim().length === 0 && legacyTitle.length > 0
    ? legacyTitle
    : rawBody;
  const isPinned = typeof value.isPinned === "boolean" ? value.isPinned : false;
  const createdAt = isIsoDateString(value.createdAt)
    ? value.createdAt
    : new Date().toISOString();
  const updatedAt = isIsoDateString(value.updatedAt) ? value.updatedAt : createdAt;

  if (!id) {
    return null;
  }

  return {
    id,
    body,
    isPinned,
    createdAt,
    updatedAt,
  };
}

function dedupeNotesById(notes: Note[]) {
  const seen = new Set<string>();

  return notes.filter((note) => {
    if (seen.has(note.id)) {
      return false;
    }

    seen.add(note.id);
    return true;
  });
}

export function createEmptyNote(): Note {
  const now = new Date().toISOString();

  return {
    id: generateNoteId(),
    body: "",
    isPinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadNotesSnapshot(): NotesSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || !Array.isArray(parsed.notes)) {
      return null;
    }

    const sanitizedNotes = parsed.notes
      .map(sanitizeNote)
      .filter((note): note is Note => note !== null);
    const notes = dedupeNotesById(sanitizedNotes);
    if (notes.length === 0) {
      return null;
    }

    const activeNoteId =
      typeof parsed.activeNoteId === "string" ? parsed.activeNoteId : null;
    const activeExists = activeNoteId
      ? notes.some((note) => note.id === activeNoteId)
      : false;

    return {
      version:
        typeof parsed.version === "number" ? parsed.version : NOTES_STORAGE_VERSION,
      notes,
      activeNoteId: activeExists ? activeNoteId : notes[0].id,
    };
  } catch {
    return null;
  }
}

export function saveNotesSnapshot(snapshot: NotesSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Intentionally ignored: this is best-effort persistence.
  }
}

function truncateWithEllipsis(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

export function getNoteDisplayTitle(note: Pick<Note, "body">, maxLength = 48) {
  const firstLine = note.body
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) {
    return "Untitled note";
  }

  return truncateWithEllipsis(firstLine, maxLength);
}

export function formatNoteDateTime(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return noteDateFormatter.format(date);
}
