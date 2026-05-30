"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CenterFocusIcon,
  ChevronDown,
  Delete02Icon,
  FileExportIcon,
  MoonIcon,
  NoteAddIcon,
  Pin02Icon,
  PinOffIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  SpeakerIcon,
  Settings02Icon,
  SiriIcon,
  Sun01Icon,
  Clock01Icon,
  TextCheckIcon,
  TextFontIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";
import { FontSwitcher } from "@/components/font-switcher";
import { IconButton } from "@/components/ui/icon-button";
import { NotesDrawer } from "@/components/notes-drawer";
import { FamilyDrawer } from "@/components/ui/family-drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  CustomToastViewport,
  type ToastMessage,
} from "@/components/ui/custom-toast";
import {
  createEmptyNote,
  formatNoteDateTime,
  type Note,
  loadNotesSnapshot,
  NOTES_STORAGE_VERSION,
  saveNotesSnapshot,
} from "@/lib/notes-storage";
import {
  CONSENT_CHANGED_EVENT,
  hasPreferenceConsent,
} from "@/lib/consent";
import {
  AMBIENT_AUDIO_ORDER,
  AMBIENT_AUDIOS,
  AMBIENT_BACKGROUND_ORDER,
  AMBIENT_BACKGROUNDS,
  DEFAULT_AMBIENT_AUDIO_ID,
  DEFAULT_AMBIENT_BACKGROUND_ID,
  DEFAULT_AMBIENT_VOLUME,
  isAmbientAudioId,
  isAmbientBackgroundId,
  type AmbientAudioId,
  type AmbientBackgroundId,
} from "@/lib/ambient-scenes";
import {
  THEME_SHORTCUT_TOGGLED_EVENT,
  type AppTheme,
} from "@/lib/theme-shortcut";

interface NotesState {
  notes: Note[];
  activeNoteId: string;
}

const TYPING_EFFECTS_STORAGE_KEY = "justwrite.typing-effects.enabled";
const SHOW_WORD_COUNT_STORAGE_KEY = "justwrite.show-word-count.enabled";
const SHOW_SAVED_TIMESTAMP_STORAGE_KEY = "justwrite.show-saved-timestamp.enabled";
const NOTEBOOK_LINES_STORAGE_KEY = "justwrite.notebook-lines.enabled";
const SPELL_CHECK_STORAGE_KEY = "justwrite.spell-check.enabled";
const FONT_SIZE_STORAGE_KEY = "justwrite.font-size";
const FOCUS_MODE_STORAGE_KEY = "justwrite.focus-mode.enabled";
const AMBIENT_ENABLED_STORAGE_KEY = "justwrite.ambient.enabled";
const AMBIENT_AUDIO_STORAGE_KEY = "justwrite.ambient.audio";
const AMBIENT_BACKGROUND_STORAGE_KEY = "justwrite.ambient.background";
const AMBIENT_LEGACY_SCENE_STORAGE_KEY = "justwrite.ambient.scene";
const AMBIENT_VOLUME_STORAGE_KEY = "justwrite.ambient.volume";
const AMBIENT_BACKDROP_DIM_STORAGE_KEY = "justwrite.ambient.backdrop-dim";
const EDGE_HOVER_TRIGGER_PX = 20;

type ExportFormat = "txt" | "md" | "json";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }
  if (!hasPreferenceConsent()) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
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

function getInitialTypingEffectsEnabled() {
  if (typeof window === "undefined") {
    return true;
  }
  if (!hasPreferenceConsent()) {
    return true;
  }

  const storedValue = window.localStorage.getItem(TYPING_EFFECTS_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return true;
}

function getInitialShowWordCount() {
  if (typeof window === "undefined") {
    return true;
  }
  if (!hasPreferenceConsent()) {
    return true;
  }

  const storedValue = window.localStorage.getItem(SHOW_WORD_COUNT_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return true;
}

function getInitialNotebookLinesEnabled() {
  if (typeof window === "undefined") {
    return false;
  }
  if (!hasPreferenceConsent()) {
    return false;
  }

  const storedValue = window.localStorage.getItem(NOTEBOOK_LINES_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return false;
}

function getInitialShowSavedTimestamp() {
  if (typeof window === "undefined") {
    return true;
  }
  if (!hasPreferenceConsent()) {
    return true;
  }

  const storedValue = window.localStorage.getItem(SHOW_SAVED_TIMESTAMP_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return true;
}

function getInitialSpellCheckEnabled() {
  if (typeof window === "undefined") {
    return true;
  }
  if (!hasPreferenceConsent()) {
    return true;
  }

  const storedValue = window.localStorage.getItem(SPELL_CHECK_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return true;
}

function getInitialFontSize() {
  if (typeof window === "undefined") {
    return 18;
  }
  if (!hasPreferenceConsent()) {
    return 18;
  }

  const storedValue = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  if (storedValue) {
    const parsed = parseInt(storedValue, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 18;
}

function getInitialFocusMode() {
  if (typeof window === "undefined") {
    return false;
  }
  if (!hasPreferenceConsent()) {
    return false;
  }

  const storedValue = window.localStorage.getItem(FOCUS_MODE_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return false;
}

function getInitialAmbientEnabled() {
  if (typeof window === "undefined") {
    return false;
  }
  if (!hasPreferenceConsent()) {
    return false;
  }

  const storedValue = window.localStorage.getItem(AMBIENT_ENABLED_STORAGE_KEY);
  if (storedValue === "true") return true;
  if (storedValue === "false") return false;
  return false;
}

function getInitialAmbientAudio(): AmbientAudioId {
  if (typeof window === "undefined") {
    return DEFAULT_AMBIENT_AUDIO_ID;
  }
  if (!hasPreferenceConsent()) {
    return DEFAULT_AMBIENT_AUDIO_ID;
  }

  const storedValue = window.localStorage.getItem(AMBIENT_AUDIO_STORAGE_KEY);
  if (storedValue && isAmbientAudioId(storedValue)) {
    return storedValue;
  }

  const legacySceneValue = window.localStorage.getItem(
    AMBIENT_LEGACY_SCENE_STORAGE_KEY
  );
  if (legacySceneValue && isAmbientAudioId(legacySceneValue)) {
    return legacySceneValue;
  }

  return DEFAULT_AMBIENT_AUDIO_ID;
}

function getInitialAmbientBackground(): AmbientBackgroundId {
  if (typeof window === "undefined") {
    return DEFAULT_AMBIENT_BACKGROUND_ID;
  }
  if (!hasPreferenceConsent()) {
    return DEFAULT_AMBIENT_BACKGROUND_ID;
  }

  const storedValue = window.localStorage.getItem(AMBIENT_BACKGROUND_STORAGE_KEY);
  if (storedValue && isAmbientBackgroundId(storedValue)) {
    return storedValue;
  }

  const legacySceneValue = window.localStorage.getItem(
    AMBIENT_LEGACY_SCENE_STORAGE_KEY
  );
  if (legacySceneValue && isAmbientBackgroundId(legacySceneValue)) {
    return legacySceneValue;
  }

  return DEFAULT_AMBIENT_BACKGROUND_ID;
}

function getInitialAmbientVolume() {
  if (typeof window === "undefined") {
    return DEFAULT_AMBIENT_VOLUME;
  }
  if (!hasPreferenceConsent()) {
    return DEFAULT_AMBIENT_VOLUME;
  }

  const storedValue = window.localStorage.getItem(AMBIENT_VOLUME_STORAGE_KEY);
  if (storedValue) {
    const parsed = parseInt(storedValue, 10);
    if (!isNaN(parsed)) {
      return Math.min(100, Math.max(0, parsed));
    }
  }
  return DEFAULT_AMBIENT_VOLUME;
}

function getInitialAmbientBackdropDim() {
  if (typeof window === "undefined") {
    return 55;
  }
  if (!hasPreferenceConsent()) {
    return 55;
  }

  const storedValue = window.localStorage.getItem(AMBIENT_BACKDROP_DIM_STORAGE_KEY);
  if (storedValue) {
    const parsed = parseInt(storedValue, 10);
    if (!isNaN(parsed)) {
      return Math.min(90, Math.max(0, parsed));
    }
  }
  return 55;
}

function shouldPlayTypingFeedback(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  if (event.key === " ") {
    return true;
  }

  return (
    event.key.length === 1 ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "Enter" ||
    event.key === "Tab"
  );
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  fallbackText: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  const content = selected || fallbackText;
  const nextValue =
    textarea.value.slice(0, start) +
    before +
    content +
    after +
    textarea.value.slice(end);

  const nextSelectionStart = start + before.length;
  const nextSelectionEnd = nextSelectionStart + content.length;

  return { nextValue, nextSelectionStart, nextSelectionEnd };
}

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [focusMode, setFocusMode] = useState(getInitialFocusMode);
  const [notesDrawerManualOpen, setNotesDrawerManualOpen] = useState(false);
  const [settingsDrawerManualOpen, setSettingsDrawerManualOpen] = useState(false);
  const [notesDrawerHoverOpen, setNotesDrawerHoverOpen] = useState(false);
  const [settingsDrawerHoverOpen, setSettingsDrawerHoverOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [typingEffectsEnabled, setTypingEffectsEnabled] = useState(
    getInitialTypingEffectsEnabled
  );
  const [showWordCount, setShowWordCount] = useState(getInitialShowWordCount);
  const [showSavedTimestamp, setShowSavedTimestamp] = useState(getInitialShowSavedTimestamp);
  const [notebookLinesEnabled, setNotebookLinesEnabled] = useState(getInitialNotebookLinesEnabled);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(getInitialSpellCheckEnabled);
  const [fontSize, setFontSize] = useState(getInitialFontSize);
  const [ambientEnabled, setAmbientEnabled] = useState(getInitialAmbientEnabled);
  const [ambientAudio, setAmbientAudio] = useState<AmbientAudioId>(
    getInitialAmbientAudio
  );
  const [ambientBackground, setAmbientBackground] = useState<AmbientBackgroundId>(
    getInitialAmbientBackground
  );
  const [ambientVolume, setAmbientVolume] = useState(getInitialAmbientVolume);
  const [ambientBackdropDim, setAmbientBackdropDim] = useState(
    getInitialAmbientBackdropDim
  );
  const [hasPreferencesConsent, setHasPreferencesConsent] = useState(
    hasPreferenceConsent
  );
  const [notesState, setNotesState] = useState<NotesState>(getInitialNotesState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const keyAudioRef = useRef<HTMLAudioElement | null>(null);
  const spaceAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);
  const drawerOpen = notesDrawerManualOpen || notesDrawerHoverOpen;
  const settingsOpen = settingsDrawerManualOpen || settingsDrawerHoverOpen;
  const closeDrawers = useCallback(() => {
    setNotesDrawerManualOpen(false);
    setSettingsDrawerManualOpen(false);
    setNotesDrawerHoverOpen(false);
    setSettingsDrawerHoverOpen(false);
  }, []);

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

  const ambientAudioOptions = useMemo(
    () =>
      AMBIENT_AUDIO_ORDER.map((audioId) => ({
        id: audioId,
        label: AMBIENT_AUDIOS[audioId].label,
        iconPath: AMBIENT_AUDIOS[audioId].iconPath,
      })),
    []
  );

  const ambientBackgroundOptions = useMemo(
    () =>
      AMBIENT_BACKGROUND_ORDER.map(
        (backgroundId) => AMBIENT_BACKGROUNDS[backgroundId]
      ),
    []
  );

  const selectedAmbientBackground = AMBIENT_BACKGROUNDS[ambientBackground];

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const syncConsent = () => setHasPreferencesConsent(hasPreferenceConsent());
    window.addEventListener(CONSENT_CHANGED_EVENT, syncConsent);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!hasPreferencesConsent || typeof window === "undefined") {
      return;
    }

    const savedTheme = window.localStorage.getItem("app-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const typingSaved = window.localStorage.getItem(TYPING_EFFECTS_STORAGE_KEY);
    if (typingSaved === "true" || typingSaved === "false") {
      setTypingEffectsEnabled(typingSaved === "true");
    }

    const wordCountSaved = window.localStorage.getItem(SHOW_WORD_COUNT_STORAGE_KEY);
    if (wordCountSaved === "true" || wordCountSaved === "false") {
      setShowWordCount(wordCountSaved === "true");
    }

    const savedTimestampPref = window.localStorage.getItem(SHOW_SAVED_TIMESTAMP_STORAGE_KEY);
    if (savedTimestampPref === "true" || savedTimestampPref === "false") {
      setShowSavedTimestamp(savedTimestampPref === "true");
    }

    const linesSaved = window.localStorage.getItem(NOTEBOOK_LINES_STORAGE_KEY);
    if (linesSaved === "true" || linesSaved === "false") {
      setNotebookLinesEnabled(linesSaved === "true");
    }

    const spellSaved = window.localStorage.getItem(SPELL_CHECK_STORAGE_KEY);
    if (spellSaved === "true" || spellSaved === "false") {
      setSpellCheckEnabled(spellSaved === "true");
    }

    const sizeSaved = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (sizeSaved) {
      const parsed = parseInt(sizeSaved, 10);
      if (!isNaN(parsed)) {
        setFontSize(parsed);
      }
    }

    const focusModeSaved = window.localStorage.getItem(FOCUS_MODE_STORAGE_KEY);
    if (focusModeSaved === "true" || focusModeSaved === "false") {
      setFocusMode(focusModeSaved === "true");
    }

    const ambientEnabledSaved = window.localStorage.getItem(
      AMBIENT_ENABLED_STORAGE_KEY
    );
    if (ambientEnabledSaved === "true" || ambientEnabledSaved === "false") {
      setAmbientEnabled(ambientEnabledSaved === "true");
    }

    const ambientAudioSaved = window.localStorage.getItem(AMBIENT_AUDIO_STORAGE_KEY);
    if (ambientAudioSaved && isAmbientAudioId(ambientAudioSaved)) {
      setAmbientAudio(ambientAudioSaved);
    } else {
      const legacySceneSaved = window.localStorage.getItem(
        AMBIENT_LEGACY_SCENE_STORAGE_KEY
      );
      if (legacySceneSaved && isAmbientAudioId(legacySceneSaved)) {
        setAmbientAudio(legacySceneSaved);
      }
    }

    const ambientBackgroundSaved = window.localStorage.getItem(
      AMBIENT_BACKGROUND_STORAGE_KEY
    );
    if (ambientBackgroundSaved && isAmbientBackgroundId(ambientBackgroundSaved)) {
      setAmbientBackground(ambientBackgroundSaved);
    } else {
      const legacySceneSaved = window.localStorage.getItem(
        AMBIENT_LEGACY_SCENE_STORAGE_KEY
      );
      if (legacySceneSaved && isAmbientBackgroundId(legacySceneSaved)) {
        setAmbientBackground(legacySceneSaved);
      }
    }

    const ambientVolumeSaved = window.localStorage.getItem(
      AMBIENT_VOLUME_STORAGE_KEY
    );
    if (ambientVolumeSaved) {
      const parsed = parseInt(ambientVolumeSaved, 10);
      if (!isNaN(parsed)) {
        setAmbientVolume(Math.min(100, Math.max(0, parsed)));
      }
    }

    const ambientBackdropDimSaved = window.localStorage.getItem(
      AMBIENT_BACKDROP_DIM_STORAGE_KEY
    );
    if (ambientBackdropDimSaved) {
      const parsed = parseInt(ambientBackdropDimSaved, 10);
      if (!isNaN(parsed)) {
        setAmbientBackdropDim(Math.min(90, Math.max(0, parsed)));
      }
    }
  }, [hasPreferencesConsent]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    if (hasPreferencesConsent) {
      localStorage.setItem("app-theme", theme);
    }
  }, [theme, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(TYPING_EFFECTS_STORAGE_KEY, String(typingEffectsEnabled));
    }
  }, [typingEffectsEnabled, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(SHOW_WORD_COUNT_STORAGE_KEY, String(showWordCount));
    }
  }, [showWordCount, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(
        SHOW_SAVED_TIMESTAMP_STORAGE_KEY,
        String(showSavedTimestamp)
      );
    }
  }, [showSavedTimestamp, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(NOTEBOOK_LINES_STORAGE_KEY, String(notebookLinesEnabled));
    }
  }, [notebookLinesEnabled, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(SPELL_CHECK_STORAGE_KEY, String(spellCheckEnabled));
    }
  }, [spellCheckEnabled, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontSize));
    }
  }, [fontSize, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(FOCUS_MODE_STORAGE_KEY, String(focusMode));
    }
  }, [focusMode, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(AMBIENT_ENABLED_STORAGE_KEY, String(ambientEnabled));
    }
  }, [ambientEnabled, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(AMBIENT_AUDIO_STORAGE_KEY, ambientAudio);
    }
  }, [ambientAudio, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(AMBIENT_BACKGROUND_STORAGE_KEY, ambientBackground);
    }
  }, [ambientBackground, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(AMBIENT_VOLUME_STORAGE_KEY, String(ambientVolume));
    }
  }, [ambientVolume, hasPreferencesConsent]);

  useEffect(() => {
    if (hasPreferencesConsent) {
      localStorage.setItem(
        AMBIENT_BACKDROP_DIM_STORAGE_KEY,
        String(ambientBackdropDim)
      );
    }
  }, [ambientBackdropDim, hasPreferencesConsent]);

  useEffect(() => {
    const keyAudio = new Audio("/sounds/keystorkes.mp3");
    keyAudio.preload = "auto";
    keyAudio.volume = 0.24;

    const spaceAudio = new Audio("/sounds/spacebar.mp3");
    spaceAudio.preload = "auto";
    spaceAudio.volume = 0.24;

    const ambientAudio = new Audio(AMBIENT_AUDIOS[DEFAULT_AMBIENT_AUDIO_ID].assetPath);
    ambientAudio.preload = "auto";
    ambientAudio.loop = true;
    ambientAudio.volume = DEFAULT_AMBIENT_VOLUME / 100;

    keyAudioRef.current = keyAudio;
    spaceAudioRef.current = spaceAudio;
    ambientAudioRef.current = ambientAudio;

    return () => {
      ambientAudio.pause();
      keyAudioRef.current = null;
      spaceAudioRef.current = null;
      ambientAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ambientPlayer = ambientAudioRef.current;
    if (!ambientPlayer || typeof window === "undefined") {
      return;
    }

    const nextSource = AMBIENT_AUDIOS[ambientAudio].assetPath;
    const resolvedSource = new URL(nextSource, window.location.origin).href;

    if (ambientPlayer.src !== resolvedSource) {
      ambientPlayer.pause();
      ambientPlayer.src = nextSource;
      ambientPlayer.load();
    }

    if (ambientEnabled) {
      void ambientPlayer.play().catch(() => {
        // Ignore playback errors (for example browser autoplay restrictions).
      });
    }
  }, [ambientAudio, ambientEnabled]);

  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) {
      return;
    }

    ambientAudio.volume = ambientVolume / 100;
  }, [ambientVolume]);

  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) {
      return;
    }

    if (!ambientEnabled) {
      ambientAudio.pause();
      ambientAudio.currentTime = 0;
      return;
    }

    void ambientAudio.play().catch(() => {
      // Ignore playback errors (for example browser autoplay restrictions).
    });
  }, [ambientEnabled]);

  useEffect(() => {
    const video = ambientVideoRef.current;
    if (!video || selectedAmbientBackground.background.type !== "video") {
      return;
    }

    if (!ambientEnabled) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    void video.play().catch(() => {
      // Ignore playback errors (for example browser autoplay restrictions).
    });
  }, [
    ambientEnabled,
    selectedAmbientBackground.background.source,
    selectedAmbientBackground.background.type,
  ]);

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
    const next = !focusMode;
    setFocusMode(next);
    if (next) {
      closeDrawers();
    }
    pushToast({
      type: "info",
      icon: CenterFocusIcon,
      title: next ? "Focus mode enabled" : "Focus mode disabled",
      description: next
        ? "Distraction-free writing is now on."
        : "Toolbars and drawers are back.",
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
    setNotesDrawerManualOpen(true);
    setNotesDrawerHoverOpen(false);
    pushToast({
      type: "success",
      icon: NoteAddIcon,
      title: "New note created",
      description: "You can start writing right away.",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find((note) => note.id === noteId);
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
    pushToast({
      type: "info",
      icon: Delete02Icon,
      title: "Note deleted",
      description: noteToDelete
        ? noteToDelete.body.trim()
          ? "The selected note was removed."
          : "An untitled note was removed."
        : "The selected note was removed.",
    });
  };

  const handleTogglePinned = (noteId: string) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    const willBePinned = !(noteToToggle?.isPinned ?? false);
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
    pushToast({
      type: "info",
      icon: willBePinned ? Pin02Icon : PinOffIcon,
      title: willBePinned ? "Note pinned" : "Note unpinned",
      description: willBePinned
        ? "Pinned notes stay at the top."
        : "The note moved back to regular list.",
    });
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const pushToast = (toast: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    setToasts((previous) => [...previous, { id, ...toast }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== id));
    }, 2600);
  };

  const dismissToast = (id: string) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  };

  const handleThemeToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    pushToast({
      type: "info",
      icon: next === "dark" ? MoonIcon : Sun01Icon,
      title: next === "dark" ? "Dark theme enabled" : "Light theme enabled",
      description:
        next === "dark" ? "Switched to dark appearance." : "Switched to light appearance.",
    });
  };

  const handleTypingEffectsChange = (enabled: boolean) => {
    setTypingEffectsEnabled(enabled);
    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: enabled ? "Typing sound on" : "Typing sound off",
      description: enabled ? "Audio feedback enabled." : "Audio feedback disabled.",
    });
  };

  const handleAmbientEnabledChange = (enabled: boolean) => {
    setAmbientEnabled(enabled);
    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: enabled ? "Ambient mode on" : "Ambient mode off",
      description: enabled
        ? `${AMBIENT_AUDIOS[ambientAudio].label} audio is now playing.`
        : "Ambient playback is paused.",
    });
  };

  const handleAmbientAudioChange = (audioId: AmbientAudioId) => {
    setAmbientAudio(audioId);
    if (!ambientEnabled) {
      return;
    }

    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: "Ambient audio changed",
      description: `${AMBIENT_AUDIOS[audioId].label} audio is now active.`,
    });
  };

  const handleAmbientBackgroundChange = (backgroundId: AmbientBackgroundId) => {
    setAmbientBackground(backgroundId);
    pushToast({
      type: "info",
      icon: SiriIcon,
      title: "Background scene changed",
      description: `${AMBIENT_BACKGROUNDS[backgroundId].label} background is now active.`,
    });
  };

  const handleAmbientVolumeChange = (volume: number) => {
    setAmbientVolume(Math.min(100, Math.max(0, volume)));
  };

  const handleAmbientBackdropDimChange = (value: number) => {
    setAmbientBackdropDim(Math.min(90, Math.max(0, value)));
  };

  const handleWordCountChange = (enabled: boolean) => {
    setShowWordCount(enabled);
    pushToast({
      type: "info",
      icon: TextNumberSignIcon,
      title: enabled ? "Word count shown" : "Word count hidden",
      description: enabled ? "Footer now shows total words." : "Footer word count is hidden.",
    });
  };

  const handleNotebookLinesChange = (enabled: boolean) => {
    setNotebookLinesEnabled(enabled);
    pushToast({
      type: "info",
      icon: NoteAddIcon,
      title: enabled ? "Notebook lines on" : "Notebook lines off",
      description: enabled ? "Writing area now has guide lines." : "Writing area is now clean.",
    });
  };

  const handleShowSavedTimestampChange = (enabled: boolean) => {
    setShowSavedTimestamp(enabled);
    pushToast({
      type: "info",
      icon: Clock01Icon,
      title: enabled ? "Saved timestamp shown" : "Saved timestamp hidden",
      description: enabled
        ? "Footer now shows last saved time."
        : "Footer saved time is hidden.",
    });
  };

  const handleSpellCheckChange = (enabled: boolean) => {
    setSpellCheckEnabled(enabled);
    pushToast({
      type: "info",
      icon: TextCheckIcon,
      title: enabled ? "Spell check on" : "Spell check off",
      description: enabled ? "Typos will be highlighted." : "Spell checking disabled.",
    });
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    pushToast({
      type: "info",
      icon: TextFontIcon,
      title: "Font size updated",
      description: `Font size set to ${size}px.`,
    });
  };

  const focusEditor = () => {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleToggleNotesDrawer = () => {
    if (drawerOpen) {
      setNotesDrawerManualOpen(false);
      setNotesDrawerHoverOpen(false);
      return;
    }

    setNotesDrawerManualOpen(true);
    setNotesDrawerHoverOpen(false);
  };

  const handleToggleSettingsDrawer = () => {
    if (settingsOpen) {
      setSettingsDrawerManualOpen(false);
      setSettingsDrawerHoverOpen(false);
      return;
    }

    setSettingsDrawerManualOpen(true);
    setSettingsDrawerHoverOpen(false);
  };

  const closeNotesDrawer = () => {
    setNotesDrawerManualOpen(false);
    setNotesDrawerHoverOpen(false);
  };

  const closeSettingsDrawer = () => {
    setSettingsDrawerManualOpen(false);
    setSettingsDrawerHoverOpen(false);
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (focusMode) {
        return;
      }

      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      const target = event.target;
      const targetElement = target instanceof Element ? target : null;
      const isOverNotesDrawer = Boolean(
        targetElement?.closest('[data-drawer-root="notes"]')
      );
      const isOverSettingsDrawer = Boolean(
        targetElement?.closest('[data-drawer-root="settings"]') ||
          targetElement?.closest("[data-ambient-dropdown-content]")
      );

      const isNearLeftEdge = event.clientX <= EDGE_HOVER_TRIGGER_PX;
      const isNearRightEdge =
        event.clientX >= window.innerWidth - EDGE_HOVER_TRIGGER_PX;

      const nextSettingsHoverOpen = isNearLeftEdge || isOverSettingsDrawer;
      const nextNotesHoverOpen = isNearRightEdge || isOverNotesDrawer;

      setSettingsDrawerHoverOpen((previous) =>
        previous === nextSettingsHoverOpen ? previous : nextSettingsHoverOpen
      );
      setNotesDrawerHoverOpen((previous) =>
        previous === nextNotesHoverOpen ? previous : nextNotesHoverOpen
      );
    };

    document.addEventListener("pointermove", handlePointerMove);
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, [focusMode]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!drawerOpen && !settingsOpen) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      if (
        target.closest("[data-drawer-root]") ||
        target.closest("[data-drawer-toggle]") ||
        target.closest("[data-ambient-dropdown-content]")
      ) {
        return;
      }

      closeDrawers();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeDrawers, drawerOpen, settingsOpen]);

  const handleExport = (format: ExportFormat) => {
    try {
      if (format === "txt") {
        downloadFile(body, "note.txt", "text/plain;charset=utf-8");
        pushToast({
          type: "success",
          title: "TXT exported",
          description: "Your note was downloaded as plain text.",
        });
        return;
      }

      if (format === "md") {
        downloadFile(body, "note.md", "text/markdown;charset=utf-8");
        pushToast({
          type: "success",
          title: "Markdown exported",
          description: "Your note was downloaded as .md.",
        });
        return;
      }

      const payload = {
        id: activeNote.id,
        body: activeNote.body,
        updatedAt: activeNote.updatedAt,
      };
      downloadFile(
        JSON.stringify(payload, null, 2),
        "note.json",
        "application/json;charset=utf-8"
      );
      pushToast({
        type: "success",
        title: "JSON exported",
        description: "Your note metadata and content were exported.",
      });
    } catch {
      pushToast({
        type: "error",
        title: "Export failed",
        description: `Could not export ${format.toUpperCase()} right now.`,
      });
    }
  };

  useEffect(() => {
    const handleThemeShortcutToggle = (
      event: Event
    ) => {
      const nextTheme = (event as CustomEvent<AppTheme>).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener(
      THEME_SHORTCUT_TOGGLED_EVENT,
      handleThemeShortcutToggle as EventListener
    );
    return () =>
      window.removeEventListener(
        THEME_SHORTCUT_TOGGLED_EVENT,
        handleThemeShortcutToggle as EventListener
      );
  }, []);

  useEffect(() => {
    const handleGlobalShortcut = (event: globalThis.KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (event.repeat) {
        return;
      }

      if (event.code === "Digit1" || event.code === "Numpad1") {
        event.preventDefault();
        event.stopPropagation();
        handleCreateNote();
        focusEditor();
        return;
      }

      if (event.code === "Digit3" || event.code === "Numpad3") {
        event.preventDefault();
        event.stopPropagation();
        toggleFocus();
        focusEditor();
        return;
      }

      if (event.code === "Digit4" || event.code === "Numpad4") {
        event.preventDefault();
        event.stopPropagation();
        handleFontSizeChange(Math.min(32, fontSize + 1));
        return;
      }

      if (event.code === "Digit5" || event.code === "Numpad5") {
        event.preventDefault();
        event.stopPropagation();
        handleTypingEffectsChange(!typingEffectsEnabled);
        return;
      }

      if (event.code === "Digit6" || event.code === "Numpad6") {
        event.preventDefault();
        event.stopPropagation();
        handleNotebookLinesChange(!notebookLinesEnabled);
        return;
      }

      if (event.code === "Digit7" || event.code === "Numpad7") {
        event.preventDefault();
        event.stopPropagation();
        handleAmbientEnabledChange(!ambientEnabled);
      }
    };

    document.addEventListener("keydown", handleGlobalShortcut, true);
    return () => document.removeEventListener("keydown", handleGlobalShortcut, true);
  }, [
    handleCreateNote,
    handleFontSizeChange,
    handleAmbientEnabledChange,
    handleNotebookLinesChange,
    handleTypingEffectsChange,
    ambientEnabled,
    fontSize,
    notebookLinesEnabled,
    toggleFocus,
    typingEffectsEnabled,
  ]);

  const exportItems = [
    {
      id: "txt",
      label: "Plain Text (.txt)",
      iconSrc: "/logo/formats/txt.svg",
      onClick: () => handleExport("txt"),
    },
    {
      id: "md",
      label: "Markdown (.md)",
      iconSrc: "/logo/formats/md.svg",
      onClick: () => handleExport("md"),
    },
    {
      id: "json",
      label: "JSON (.json)",
      iconSrc: "/logo/formats/json.svg",
      onClick: () => handleExport("json"),
    },
  ];

  const renderExportMenu = (compact = false) => (
    <DropdownMenu>
      <ButtonGroup
        className={`overflow-hidden rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out dark:border-white/10 dark:bg-zinc-800/5 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] ${
          compact ? "h-8" : "h-9"
        }`}
      >
        <span
          className={`flex items-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
            compact
              ? "h-8 w-8 justify-center"
              : "h-9 gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-3"
          }`}
        >
          <HugeiconsIcon
            icon={FileExportIcon}
            size={compact ? 15 : 14}
            strokeWidth={1.6}
            className="shrink-0 sm:size-4"
          />
          {!compact ? (
            <span className="truncate text-[10px] font-medium sm:text-xs">
              Export
            </span>
          ) : null}
        </span>
        <ButtonGroupSeparator className="bg-black/10 dark:bg-white/10" />
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open export menu"
            type="button"
            className={`flex items-center justify-center rounded-none text-zinc-400 outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
              compact ? "h-8 w-8" : "h-9 w-8 sm:w-8.5"
            }`}
          >
            <HugeiconsIcon
              icon={ChevronDown}
              size={12}
              strokeWidth={1.6}
              className="shrink-0 rotate-180 sm:size-3.5"
            />
          </button>
        </DropdownMenuTrigger>
      </ButtonGroup>
      <DropdownMenuContent
        side="top"
        sideOffset={8}
        align="end"
        className="min-w-[170px] rounded-2xl border border-black/5 bg-white/90 p-0.5 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/90"
      >
        {exportItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={item.onClick}
            className="m-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-xs font-medium text-zinc-500 outline-none transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <img
              src={item.iconSrc}
              alt={`${item.id} format`}
              className="h-4 w-4 shrink-0 opacity-75 transition-opacity group-hover/dropdown-menu-item:opacity-100 dark:invert dark:brightness-200 dark:opacity-85"
            />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const playAudioEffect = (audio: HTMLAudioElement | null) => {
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Ignore playback errors (for example browser autoplay restrictions).
    });
  };

  const triggerHapticEffect = () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(8);
    }
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;

    if ((event.metaKey || event.ctrlKey) && !event.altKey) {
      const key = event.key.toLowerCase();

      if (key === "b") {
        event.preventDefault();
        const result = wrapSelection(textarea, "**", "**", "bold text");
        updateActiveNote({ body: result.nextValue });
        requestAnimationFrame(() => {
          textarea.setSelectionRange(
            result.nextSelectionStart,
            result.nextSelectionEnd
          );
        });
        return;
      }

      if (key === "i") {
        event.preventDefault();
        const result = wrapSelection(textarea, "*", "*", "italic text");
        updateActiveNote({ body: result.nextValue });
        requestAnimationFrame(() => {
          textarea.setSelectionRange(
            result.nextSelectionStart,
            result.nextSelectionEnd
          );
        });
        return;
      }

      if (key === "k") {
        event.preventDefault();
        const result = wrapSelection(textarea, "[", "](https://)", "link text");
        updateActiveNote({ body: result.nextValue });
        requestAnimationFrame(() => {
          textarea.setSelectionRange(
            result.nextSelectionStart,
            result.nextSelectionEnd
          );
        });
        return;
      }
    }

    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextValue =
        textarea.value.slice(0, start) + "  " + textarea.value.slice(end);
      updateActiveNote({ body: nextValue });
      requestAnimationFrame(() => {
        const caret = start + 2;
        textarea.setSelectionRange(caret, caret);
      });
      return;
    }

    if (!typingEffectsEnabled || !shouldPlayTypingFeedback(event)) {
      return;
    }

    if (event.key === " ") {
      playAudioEffect(spaceAudioRef.current);
    } else {
      playAudioEffect(keyAudioRef.current);
    }

    triggerHapticEffect();
  };

  const textareaStyle: CSSProperties & { "--editor-line-height": number } = {
    fontSize: `${fontSize}px`,
    "--editor-line-height": 1.8,
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-2">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-zinc-900/12 dark:from-zinc-900/30 dark:to-black/24" />
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${ambientEnabled ? "opacity-100" : "opacity-0"
            }`}
        >
          {selectedAmbientBackground.background.type === "video" ? (
            <video
              key={selectedAmbientBackground.background.source}
              ref={ambientVideoRef}
              autoPlay={ambientEnabled}
              muted
              loop
              playsInline
              poster={selectedAmbientBackground.background.poster}
              className="h-full w-full object-cover"
            >
              <source src={selectedAmbientBackground.background.source} type="video/mp4" />
            </video>
          ) : (
            <div
              aria-hidden="true"
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${selectedAmbientBackground.background.source})` }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(255,255,255,${ambientBackdropDim / 100})`,
            }}
          />
          <div
            className="absolute inset-0 dark:block hidden"
            style={{
              backgroundColor: `rgba(0,0,0,${ambientBackdropDim / 100})`,
            }}
          />
        </div>
      </div>
      <div
        className={`relative flex h-full w-full max-w-[1000px] flex-col ${focusMode ? "pb-0" : "pb-16 md:pb-0"
          }`}
      >
        <main className="relative flex h-full w-full flex-col">
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

          <section className="flex h-full w-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(event) => {
                closeDrawers();
                updateActiveNote({ body: event.target.value });
              }}
              onFocus={closeDrawers}
              onPointerDown={closeDrawers}
              onKeyDown={(event) => {
                closeDrawers();
                handleTextareaKeyDown(event);
              }}
              placeholder="Start. Flow. Finish."
              spellCheck={spellCheckEnabled}
              style={textareaStyle}
              className={`h-full w-full resize-none px-8 py-8 pb-24 leading-[var(--editor-line-height)] text-zinc-800 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500/80 md:px-12 md:py-10 md:pb-14 lg:px-16 lg:py-12 lg:pb-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${notebookLinesEnabled ? "notebook-lines" : ""
                }`}
            />
            {!focusMode && (showWordCount || showSavedTimestamp || !isOnline) ? (
              <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 text-[10px] font-medium tracking-[0.02em] text-zinc-500/90 dark:text-zinc-400/90 md:bottom-5 md:left-8 md:text-[11px] lg:left-12">
                {!isOnline ? (
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/12 px-2 py-0.5 text-[9px] font-semibold tracking-[0.06em] text-amber-700 dark:text-amber-300">
                    OFFLINE
                  </span>
                ) : null}
                {showWordCount ? `${wordCount} words` : ""}
                {showWordCount && showSavedTimestamp ? " - " : ""}
                {showSavedTimestamp ? `Saved ${formatNoteDateTime(activeNote.updatedAt)}` : ""}
              </div>
            ) : null}
          </section>

          {!focusMode ? (
            <div className={`mt-3 hidden items-center justify-center transition-all duration-300 md:flex ${chromeClass}`}>
              <div className="flex w-full max-w-[760px] items-center justify-between rounded-full border border-black/5 bg-white/80 p-1.5 backdrop-blur-md dark:border-white/10 dark:bg-zinc-800/80">
                <div className="flex items-center gap-2">
                  <IconButton
                    label="New note"
                    className="h-8 w-8 border-none"
                    onClick={handleCreateNote}
                  >
                    <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
                  </IconButton>
                  <div data-drawer-toggle>
                    <IconButton
                      label={settingsOpen ? "Close settings" : "Open settings"}
                      onClick={handleToggleSettingsDrawer}
                      pressed={settingsOpen}
                      className="h-8 w-8 border-none"
                    >
                      <HugeiconsIcon icon={Settings02Icon} size={16} strokeWidth={1.6} />
                    </IconButton>
                  </div>
                  <IconButton
                    label={
                      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                    }
                    onClick={handleThemeToggle}
                    pressed={theme === "dark"}
                    className="h-8 w-8 border-none"
                  >
                    <HugeiconsIcon
                      icon={theme === "dark" ? Sun01Icon : MoonIcon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                  <div data-drawer-toggle>
                    <IconButton
                      label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
                      onClick={handleToggleNotesDrawer}
                      pressed={drawerOpen}
                      className="h-8 w-8 border-none"
                    >
                      <HugeiconsIcon
                        icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
                        size={16}
                        strokeWidth={1.6}
                      />
                    </IconButton>
                  </div>
                  <IconButton
                    label={focusMode ? "Exit focus" : "Focus mode"}
                    onClick={toggleFocus}
                    pressed={focusMode}
                    className="h-8 w-8 border-none"
                  >
                    <HugeiconsIcon icon={CenterFocusIcon} size={16} strokeWidth={1.6} />
                  </IconButton>
                </div>

                <div className="flex items-center gap-2">
                  <FontSwitcher menuSide="top" />
                  {renderExportMenu()}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {!focusMode ? (
        <div className="fixed bottom-2 left-1/2 z-40 flex w-[calc(100%-0.75rem)] max-w-[calc(100%-0.75rem)] -translate-x-1/2 items-center justify-between rounded-full border border-black/5 bg-white/85 px-2 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-zinc-800/85 md:hidden">
          <div className="flex items-center gap-1">
            <IconButton
              label="New note"
              className="h-8 w-8 border-none"
              onClick={handleCreateNote}
            >
              <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
            </IconButton>

            <div data-drawer-toggle>
              <IconButton
                label={settingsOpen ? "Close settings" : "Open settings"}
                onClick={handleToggleSettingsDrawer}
                pressed={settingsOpen}
                className="h-8 w-8 border-none"
              >
                <HugeiconsIcon icon={Settings02Icon} size={16} strokeWidth={1.6} />
              </IconButton>
            </div>

            <IconButton
              label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={handleThemeToggle}
              pressed={theme === "dark"}
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun01Icon : MoonIcon}
                size={16}
                strokeWidth={1.6}
              />
            </IconButton>

            <div data-drawer-toggle>
              <IconButton
                label={drawerOpen ? "Close notes drawer" : "Open notes drawer"}
                onClick={handleToggleNotesDrawer}
                pressed={drawerOpen}
                className="h-8 w-8 border-none"
              >
                <HugeiconsIcon
                  icon={drawerOpen ? PanelRightCloseIcon : PanelRightOpenIcon}
                  size={16}
                  strokeWidth={1.6}
                />
              </IconButton>
            </div>

            <IconButton
              label={focusMode ? "Exit focus" : "Focus mode"}
              onClick={toggleFocus}
              pressed={focusMode}
              className="h-8 w-8 border-none"
            >
              <HugeiconsIcon icon={CenterFocusIcon} size={16} strokeWidth={1.6} />
            </IconButton>
          </div>

          <div className="flex items-center gap-2">
            <FontSwitcher menuSide="top" compact showTooltip={false} />
            {renderExportMenu(true)}
          </div>
        </div>
      ) : null}

      <NotesDrawer
        isOpen={drawerOpen}
        onClose={closeNotesDrawer}
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
      <FamilyDrawer
        isOpen={settingsOpen}
        onClose={closeSettingsDrawer}
        typingEffectsEnabled={typingEffectsEnabled}
        onTypingEffectsEnabledChange={handleTypingEffectsChange}
        ambientEnabled={ambientEnabled}
        onAmbientEnabledChange={handleAmbientEnabledChange}
        ambientAudioId={ambientAudio}
        ambientAudioOptions={ambientAudioOptions}
        onAmbientAudioChange={handleAmbientAudioChange}
        ambientBackgroundId={ambientBackground}
        ambientBackgroundOptions={ambientBackgroundOptions}
        onAmbientBackgroundChange={handleAmbientBackgroundChange}
        ambientVolume={ambientVolume}
        onAmbientVolumeChange={handleAmbientVolumeChange}
        ambientBackdropDim={ambientBackdropDim}
        onAmbientBackdropDimChange={handleAmbientBackdropDimChange}
        showWordCount={showWordCount}
        onShowWordCountChange={handleWordCountChange}
        showSavedTimestamp={showSavedTimestamp}
        onShowSavedTimestampChange={handleShowSavedTimestampChange}
        notebookLinesEnabled={notebookLinesEnabled}
        onNotebookLinesEnabledChange={handleNotebookLinesChange}
        spellCheckEnabled={spellCheckEnabled}
        onSpellCheckEnabledChange={handleSpellCheckChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
      <CustomToastViewport toasts={toasts} onClose={dismissToast} />
    </div>
  );
}
