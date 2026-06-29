"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CenterFocusIcon,
  BookOpenTextIcon,
  ChevronDown,
  Delete02Icon,
  Edit02Icon,
  FileExportIcon,
  LayoutTwoColumnIcon,
  MobileProgramming01Icon,
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
import { MarkdownPreview } from "@/components/markdown-preview";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  PWA_APPLY_UPDATE_EVENT,
  PWA_INSTALL_AVAILABILITY_EVENT,
  PWA_TRIGGER_INSTALL_EVENT,
  PWA_UPDATE_READY_EVENT,
} from "@/lib/pwa";
import {
  DEFAULT_TYPING_SOUND_VARIANT_ID,
  TYPING_SOUND_VARIANT_ORDER,
  TYPING_SOUND_VARIANTS,
  isTypingSoundVariantId,
  type TypingSoundVariantId,
} from "@/lib/typing-sound-variants";

interface NotesState {
  notes: Note[];
  activeNoteId: string;
}

const TYPING_EFFECTS_STORAGE_KEY = "justwrite.typing-effects.enabled";
const TYPING_SOUND_VARIANT_STORAGE_KEY = "justwrite.typing-sound.variant";
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
type EditorMode = "edit" | "preview" | "split";

const subscribeToHydration = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(subscribeToHydration, () => true, () => false);
}

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

function getInitialTypingSoundVariant(): TypingSoundVariantId {
  if (typeof window === "undefined") {
    return DEFAULT_TYPING_SOUND_VARIANT_ID;
  }
  if (!hasPreferenceConsent()) {
    return DEFAULT_TYPING_SOUND_VARIANT_ID;
  }

  const storedValue = window.localStorage.getItem(TYPING_SOUND_VARIANT_STORAGE_KEY);
  if (storedValue && isTypingSoundVariantId(storedValue)) {
    return storedValue;
  }

  return DEFAULT_TYPING_SOUND_VARIANT_ID;
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

function getInitialOnlineStatus() {
  if (typeof navigator === "undefined") {
    return true;
  }

  return navigator.onLine;
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
  const isHydrated = useIsHydrated();
  const [isOnline, setIsOnline] = useState(getInitialOnlineStatus);
  const [focusMode, setFocusMode] = useState(getInitialFocusMode);
  const [markdownToolsEnabled, setMarkdownToolsEnabled] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [notesDrawerManualOpen, setNotesDrawerManualOpen] = useState(false);
  const [settingsDrawerManualOpen, setSettingsDrawerManualOpen] = useState(false);
  const [notesDrawerHoverOpen, setNotesDrawerHoverOpen] = useState(false);
  const [settingsDrawerHoverOpen, setSettingsDrawerHoverOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [typingEffectsEnabled, setTypingEffectsEnabled] = useState(
    getInitialTypingEffectsEnabled
  );
  const [typingSoundVariant, setTypingSoundVariant] = useState<TypingSoundVariantId>(
    getInitialTypingSoundVariant
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
  const pwaUpdateToastShownRef = useRef(false);
  const [ambientVideoFallbackSource, setAmbientVideoFallbackSource] = useState<
    string | null
  >(null);
  const [canInstallApp, setCanInstallApp] = useState(false);
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

  const typingSoundOptions = useMemo(
    () =>
      TYPING_SOUND_VARIANT_ORDER.map((variantId) => ({
        id: variantId,
        label: TYPING_SOUND_VARIANTS[variantId].label,
        category: TYPING_SOUND_VARIANTS[variantId].category,
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
  const shouldUseAmbientVideo =
    selectedAmbientBackground.background.type === "video" &&
    isOnline &&
    ambientVideoFallbackSource !== selectedAmbientBackground.background.source;

  const pushToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    const durationMs = toast.durationMs ?? 2600;

    setToasts((previous) => [...previous, { id, ...toast }]);
    if (durationMs > 0) {
      window.setTimeout(() => {
        setToasts((previous) => previous.filter((item) => item.id !== id));
      }, durationMs);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const syncStoredPreferences = useCallback(() => {
    if (typeof window === "undefined" || !hasPreferenceConsent()) {
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

    const typingVariantSaved = window.localStorage.getItem(
      TYPING_SOUND_VARIANT_STORAGE_KEY
    );
    if (typingVariantSaved && isTypingSoundVariantId(typingVariantSaved)) {
      setTypingSoundVariant(typingVariantSaved);
    }

    const wordCountSaved = window.localStorage.getItem(
      SHOW_WORD_COUNT_STORAGE_KEY
    );
    if (wordCountSaved === "true" || wordCountSaved === "false") {
      setShowWordCount(wordCountSaved === "true");
    }

    const savedTimestampPref = window.localStorage.getItem(
      SHOW_SAVED_TIMESTAMP_STORAGE_KEY
    );
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

    const ambientAudioSaved = window.localStorage.getItem(
      AMBIENT_AUDIO_STORAGE_KEY
    );
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
    if (
      ambientBackgroundSaved &&
      isAmbientBackgroundId(ambientBackgroundSaved)
    ) {
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
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAmbientVideoFallbackSource(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setAmbientVideoFallbackSource(selectedAmbientBackground.background.source);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [selectedAmbientBackground.background.source]);

  useEffect(() => {
    const syncConsent = () => {
      const nextHasConsent = hasPreferenceConsent();
      setHasPreferencesConsent(nextHasConsent);

      if (nextHasConsent) {
        syncStoredPreferences();
      }
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, syncConsent);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, syncConsent);
    };
  }, [syncStoredPreferences]);

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
      localStorage.setItem(TYPING_SOUND_VARIANT_STORAGE_KEY, typingSoundVariant);
    }
  }, [typingSoundVariant, hasPreferencesConsent]);

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
    const keyAudio = new Audio();
    keyAudio.preload = "auto";
    keyAudio.volume = 0.24;

    const spaceAudio = new Audio();
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
    if (typeof window === "undefined") {
      return;
    }

    const keyAudio = keyAudioRef.current;
    const spaceAudio = spaceAudioRef.current;
    if (!keyAudio || !spaceAudio) {
      return;
    }

    const selectedVariant =
      TYPING_SOUND_VARIANTS[typingSoundVariant] ??
      TYPING_SOUND_VARIANTS[DEFAULT_TYPING_SOUND_VARIANT_ID];

    const syncSource = (audio: HTMLAudioElement, source: string) => {
      const resolvedSource = new URL(source, window.location.origin).href;
      if (audio.src !== resolvedSource) {
        audio.pause();
        audio.src = source;
        audio.load();
      }
      audio.volume = 0.24;
    };

    syncSource(keyAudio, selectedVariant.keyPath);
    syncSource(spaceAudio, selectedVariant.spacePath);
  }, [typingSoundVariant]);

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
    if (
      !video ||
      selectedAmbientBackground.background.type !== "video" ||
      !shouldUseAmbientVideo
    ) {
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
    shouldUseAmbientVideo,
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

  const toggleFocus = useCallback(() => {
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
  }, [closeDrawers, focusMode, pushToast]);

  const updateActiveNote = useCallback((nextValues: Partial<Pick<Note, "body">>) => {
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
  }, []);

  const handleCreateNote = useCallback(() => {
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
  }, [pushToast]);

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

  const handleTypingEffectsChange = useCallback((enabled: boolean) => {
    setTypingEffectsEnabled(enabled);
    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: enabled ? "Typing sound on" : "Typing sound off",
      description: enabled ? "Audio feedback enabled." : "Audio feedback disabled.",
    });
  }, [pushToast]);

  const handleTypingSoundVariantChange = (variantId: TypingSoundVariantId) => {
    setTypingSoundVariant(variantId);
    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: "Typing sound style changed",
      description: `${TYPING_SOUND_VARIANTS[variantId].label} is now active.`,
    });
  };

  const handleAmbientEnabledChange = useCallback((enabled: boolean) => {
    setAmbientEnabled(enabled);
    pushToast({
      type: "info",
      icon: SpeakerIcon,
      title: enabled ? "Ambient mode on" : "Ambient mode off",
      description: enabled
        ? `${AMBIENT_AUDIOS[ambientAudio].label} audio is now playing.`
        : "Ambient playback is paused.",
    });
  }, [ambientAudio, pushToast]);

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
    setAmbientVideoFallbackSource(null);
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

  const handleNotebookLinesChange = useCallback((enabled: boolean) => {
    setNotebookLinesEnabled(enabled);
    pushToast({
      type: "info",
      icon: NoteAddIcon,
      title: enabled ? "Notebook lines on" : "Notebook lines off",
      description: enabled ? "Writing area now has guide lines." : "Writing area is now clean.",
    });
  }, [pushToast]);

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

  const handleFontSizeChange = useCallback((size: number) => {
    setFontSize(size);
    pushToast({
      type: "info",
      icon: TextFontIcon,
      title: "Font size updated",
      description: `Font size set to ${size}px.`,
    });
  }, [pushToast]);

  const focusEditor = useCallback(() => {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const handleEditorModeChange = useCallback((nextMode: EditorMode) => {
    if (nextMode === editorMode) {
      return;
    }

    setEditorMode(nextMode);
    closeDrawers();

    if (nextMode !== "preview") {
      focusEditor();
    }
  }, [closeDrawers, editorMode, focusEditor]);

  const handleMarkdownToolsEnabledChange = useCallback((enabled: boolean) => {
    setMarkdownToolsEnabled(enabled);
    closeDrawers();

    if (!enabled) {
      setEditorMode("edit");
      focusEditor();
    }

    pushToast({
      type: "info",
      icon: BookOpenTextIcon,
      title: enabled ? "Markdown tools shown" : "Markdown tools hidden",
      description: enabled
        ? "Edit, Preview, and Split tabs are now in the editor."
        : "The editor is back to a plain writing surface.",
    });
  }, [closeDrawers, focusEditor, pushToast]);

  const handleMarkdownPreviewToggle = useCallback(() => {
    if (!markdownToolsEnabled) {
      setMarkdownToolsEnabled(true);
      handleEditorModeChange("preview");
      return;
    }

    handleEditorModeChange(editorMode === "preview" ? "edit" : "preview");
  }, [editorMode, handleEditorModeChange, markdownToolsEnabled]);

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
    const handlePwaUpdateReady = () => {
      if (pwaUpdateToastShownRef.current) {
        return;
      }

      pwaUpdateToastShownRef.current = true;
      pushToast({
        type: "info",
        title: "Update ready",
        description: "Refresh once to install the latest offline bundle.",
        actionLabel: "Refresh now",
        durationMs: 0,
        onAction: () => {
          window.dispatchEvent(new Event(PWA_APPLY_UPDATE_EVENT));
        },
      });
    };

    window.addEventListener(PWA_UPDATE_READY_EVENT, handlePwaUpdateReady);
    return () => {
      window.removeEventListener(PWA_UPDATE_READY_EVENT, handlePwaUpdateReady);
    };
  }, [pushToast]);

  useEffect(() => {
    const handleInstallAvailabilityChange = (event: Event) => {
      const detail = (
        event as CustomEvent<{ available?: boolean; installed?: boolean }>
      ).detail;

      setCanInstallApp(Boolean(detail?.available) && !detail?.installed);
    };

    window.addEventListener(
      PWA_INSTALL_AVAILABILITY_EVENT,
      handleInstallAvailabilityChange as EventListener
    );

    return () => {
      window.removeEventListener(
        PWA_INSTALL_AVAILABILITY_EVENT,
        handleInstallAvailabilityChange as EventListener
      );
    };
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
        return;
      }

      if (event.code === "Digit8" || event.code === "Numpad8") {
        event.preventDefault();
        event.stopPropagation();
        handleMarkdownPreviewToggle();
      }
    };

    document.addEventListener("keydown", handleGlobalShortcut, true);
    return () => document.removeEventListener("keydown", handleGlobalShortcut, true);
  }, [
    focusEditor,
    handleCreateNote,
    handleFontSizeChange,
    handleAmbientEnabledChange,
    handleNotebookLinesChange,
    handleMarkdownPreviewToggle,
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

  const editorModeItems: Array<{
    id: EditorMode;
    label: string;
    icon: typeof Edit02Icon;
  }> = [
    { id: "edit", label: "Edit", icon: Edit02Icon },
    { id: "preview", label: "Preview", icon: BookOpenTextIcon },
    { id: "split", label: "Split", icon: LayoutTwoColumnIcon },
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
            <Image
              src={item.iconSrc}
              alt={`${item.id} format`}
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 shrink-0 opacity-75 transition-opacity group-hover/dropdown-menu-item:opacity-100 dark:invert dark:brightness-200 dark:opacity-85"
            />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderInstallButton = (compact = false) => {
    if (!canInstallApp) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Install Justwrite app"
            onClick={() =>
              window.dispatchEvent(new Event(PWA_TRIGGER_INSTALL_EVENT))
            }
            className={`inline-flex items-center justify-center rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-black/5 hover:text-zinc-900 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] dark:border-white/10 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 dark:hover:text-white dark:active:shadow-[inset_0_1px_4px_rgba(255,255,255,0.22)] ${
              compact ? "h-8 w-8" : "h-9 w-9"
            }`}
          >
            <HugeiconsIcon
              icon={MobileProgramming01Icon}
              size={compact ? 15 : 16}
              strokeWidth={1.7}
              className="shrink-0"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          Install Justwrite on this device
        </TooltipContent>
      </Tooltip>
    );
  };

  const renderMarkdownToolsButton = () => (
    <IconButton
      label={
        markdownToolsEnabled ? "Hide Markdown tools" : "Show Markdown tools"
      }
      onClick={() => handleMarkdownToolsEnabledChange(!markdownToolsEnabled)}
      pressed={markdownToolsEnabled}
      className="h-8 w-8 border-none"
    >
      <Image
        src="/logo/formats/md.svg"
        alt=""
        width={16}
        height={16}
        unoptimized
        className="h-4 w-4 opacity-75 dark:invert dark:brightness-200 dark:opacity-90"
      />
    </IconButton>
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

  const renderEditorTextarea = (className = "") => (
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
      className={`h-full w-full resize-none px-8 py-8 pb-24 leading-[var(--editor-line-height)] text-zinc-800 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500/80 md:px-12 md:py-10 md:pb-14 lg:px-16 lg:py-12 lg:pb-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${markdownToolsEnabled ? "pt-20 md:pt-20 lg:pt-20" : ""
        } ${notebookLinesEnabled ? "notebook-lines" : ""
        } ${className}`}
    />
  );

  return isHydrated ? (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-2">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-zinc-900/12 dark:from-zinc-900/30 dark:to-black/24" />
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${ambientEnabled ? "opacity-100" : "opacity-0"
            }`}
        >
          {shouldUseAmbientVideo ? (
            <video
              key={selectedAmbientBackground.background.source}
              ref={ambientVideoRef}
              autoPlay={ambientEnabled}
              muted
              loop
              playsInline
              poster={selectedAmbientBackground.background.poster}
              onError={() =>
                setAmbientVideoFallbackSource(
                  selectedAmbientBackground.background.source
                )
              }
              className="h-full w-full object-cover"
            >
              <source src={selectedAmbientBackground.background.source} type="video/mp4" />
            </video>
          ) : (
            <div
              aria-hidden="true"
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  selectedAmbientBackground.background.fallbackImage ??
                  selectedAmbientBackground.background.poster ??
                  selectedAmbientBackground.background.source
                })`,
              }}
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
              className={`absolute top-4 z-30 rounded-full bg-white/80 backdrop-blur-md dark:bg-zinc-800/80 ${
                markdownToolsEnabled ? "left-4" : "right-4"
              }`}
            >
              <HugeiconsIcon
                icon={CenterFocusIcon}
                size={18}
                strokeWidth={1.6}
              />
            </IconButton>
          ) : null}

          <section className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10">
            {markdownToolsEnabled ? (
              <div
                role="tablist"
                aria-label="Markdown view mode"
                className="absolute top-3 right-3 z-20 inline-flex rounded-full border border-black/5 bg-white/85 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/75"
              >
                {editorModeItems.map((item) => {
                  const selected = editorMode === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`${item.label} Markdown`}
                      onClick={() => handleEditorModeChange(item.id)}
                      className={`inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 ${selected
                        ? "bg-zinc-100/95 text-zinc-800 shadow-sm ring-1 ring-black/5 hover:text-zinc-900 dark:bg-white/12 dark:text-zinc-100 dark:ring-white/10 dark:hover:text-white"
                        : ""
                        }`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={14}
                        strokeWidth={1.7}
                        className="shrink-0"
                      />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {markdownToolsEnabled && editorMode === "preview" ? (
              <MarkdownPreview
                body={body}
                fontSize={fontSize}
                className="pt-20 md:pt-20 lg:pt-20"
              />
            ) : markdownToolsEnabled && editorMode === "split" ? (
              <div className="grid h-full min-h-0 w-full grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                <div className="min-h-0 border-b border-black/5 dark:border-white/10 md:border-r md:border-b-0">
                  {renderEditorTextarea(
                    "md:pr-8 lg:pr-10"
                  )}
                </div>
                <MarkdownPreview
                  body={body}
                  fontSize={fontSize}
                  className="min-h-0 pt-20 md:pl-8 md:pt-20 lg:pl-10 lg:pt-20"
                />
              </div>
            ) : (
              renderEditorTextarea()
            )}
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
                  {renderMarkdownToolsButton()}
                </div>

                <div className="flex items-center gap-2">
                  <FontSwitcher menuSide="top" />
                  {renderExportMenu()}
                  {renderInstallButton()}
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
            {renderMarkdownToolsButton()}
          </div>

          <div className="flex items-center gap-1">
            <FontSwitcher menuSide="top" compact showTooltip={false} />
            {renderExportMenu(true)}
            {renderInstallButton(true)}
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
        typingSoundVariantId={typingSoundVariant}
        typingSoundVariants={typingSoundOptions}
        onTypingSoundVariantChange={handleTypingSoundVariantChange}
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
        markdownToolsEnabled={markdownToolsEnabled}
        onMarkdownToolsEnabledChange={handleMarkdownToolsEnabledChange}
        notebookLinesEnabled={notebookLinesEnabled}
        onNotebookLinesEnabledChange={handleNotebookLinesChange}
        spellCheckEnabled={spellCheckEnabled}
        onSpellCheckEnabledChange={handleSpellCheckChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
      <PwaInstallPrompt hidden={focusMode} />
      <CustomToastViewport toasts={toasts} onClose={dismissToast} />
    </div>
  ) : (
    <div className="h-screen w-full" suppressHydrationWarning />
  );
}
