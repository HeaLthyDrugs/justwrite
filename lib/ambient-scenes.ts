export type AmbientOptionId =
  | "rain"
  | "cafe"
  | "library"
  | "night"
  | "forest"
  | "lofi-room";

export type AmbientAudioId = AmbientOptionId;
export type AmbientBackgroundId = AmbientOptionId;

export interface AmbientAudioConfig {
  id: AmbientAudioId;
  label: string;
  iconPath: string;
  assetPath: string;
}

export interface AmbientBackgroundConfig {
  id: AmbientBackgroundId;
  label: string;
  iconPath: string;
  background: {
    type: "image" | "video";
    source: string;
    poster?: string;
  };
}

export const AMBIENT_AUDIOS: Record<AmbientAudioId, AmbientAudioConfig> = {
  rain: {
    id: "rain",
    label: "Rain",
    iconPath: "/icons/ambient/rain.svg",
    assetPath: "/sounds/ambient/rain.mp3",
  },
  cafe: {
    id: "cafe",
    label: "Coffee / Cafe",
    iconPath: "/icons/ambient/cafe.svg",
    assetPath: "/sounds/ambient/cafe.mp3",
  },
  library: {
    id: "library",
    label: "Library",
    iconPath: "/icons/ambient/library.svg",
    assetPath: "/sounds/ambient/library.mp3",
  },
  night: {
    id: "night",
    label: "Night",
    iconPath: "/icons/ambient/night.svg",
    assetPath: "/sounds/ambient/night.mp3",
  },
  forest: {
    id: "forest",
    label: "Forest",
    iconPath: "/icons/ambient/forest.svg",
    assetPath: "/sounds/ambient/forest.mp3",
  },
  "lofi-room": {
    id: "lofi-room",
    label: "Lo-fi Room",
    iconPath: "/icons/ambient/lofi-room.svg",
    assetPath: "/sounds/ambient/lofi-room.mp3",
  },
};

export const AMBIENT_BACKGROUNDS: Record<
  AmbientBackgroundId,
  AmbientBackgroundConfig
> = {
  rain: {
    id: "rain",
    label: "Rain",
    iconPath: "/icons/ambient/rain.svg",
    background: {
      type: "video",
      source: "/videos/ambient/rain.mp4",
      poster: "/backgrounds/4.jpg",
    },
  },
  cafe: {
    id: "cafe",
    label: "Coffee / Cafe",
    iconPath: "/icons/ambient/cafe.svg",
    background: {
      type: "image",
      source: "/backgrounds/2.jpg",
    },
  },
  library: {
    id: "library",
    label: "Library",
    iconPath: "/icons/ambient/library.svg",
    background: {
      type: "image",
      source: "/backgrounds/1.jpg",
    },
  },
  night: {
    id: "night",
    label: "Night",
    iconPath: "/icons/ambient/night.svg",
    background: {
      type: "image",
      source: "/backgrounds/4.jpg",
    },
  },
  forest: {
    id: "forest",
    label: "Forest",
    iconPath: "/icons/ambient/forest.svg",
    background: {
      type: "image",
      source: "/backgrounds/3.jpg",
    },
  },
  "lofi-room": {
    id: "lofi-room",
    label: "Lo-fi Room",
    iconPath: "/icons/ambient/lofi-room.svg",
    background: {
      type: "image",
      source: "/backgrounds/2.jpg",
    },
  },
};

export const AMBIENT_AUDIO_ORDER: AmbientAudioId[] = [
  "rain",
  "cafe",
  "library",
  "night",
  "forest",
  "lofi-room",
];

export const AMBIENT_BACKGROUND_ORDER: AmbientBackgroundId[] = [
  "rain",
  "cafe",
  "library",
  "night",
  "forest",
  "lofi-room",
];

export const DEFAULT_AMBIENT_AUDIO_ID: AmbientAudioId = "rain";
export const DEFAULT_AMBIENT_BACKGROUND_ID: AmbientBackgroundId = "rain";
export const DEFAULT_AMBIENT_VOLUME = 35;

export function isAmbientAudioId(value: string): value is AmbientAudioId {
  return value in AMBIENT_AUDIOS;
}

export function isAmbientBackgroundId(
  value: string
): value is AmbientBackgroundId {
  return value in AMBIENT_BACKGROUNDS;
}
