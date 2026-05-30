export type AmbientOptionId =
  | "rain"
  | "cafe"
  | "library"
  | "night"
  | "forest"
  | "lofi-room";

export type AmbientAudioId = AmbientOptionId;
export type AmbientBackgroundId =
  | "beach-shore"
  | "butterfly"
  | "flowers"
  | "nature-walk";

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
  credit: {
    name: string;
    url: string;
  };
  background: {
    type: "image" | "video";
    source: string;
    poster?: string;
  };
}

const BACKGROUND_VIDEO_BASE_URL =
  "https://assets.mnsh.online/work/justwrite/assets/background-videos";

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
  "beach-shore": {
    id: "beach-shore",
    label: "Beach Shore",
    iconPath: "/icons/ambient/forest.svg",
    credit: {
      name: "Beach Shore",
      url: `${BACKGROUND_VIDEO_BASE_URL}/beach-shore.mp4`,
    },
    background: {
      type: "video",
      source: `${BACKGROUND_VIDEO_BASE_URL}/beach-shore.mp4`,
    },
  },
  butterfly: {
    id: "butterfly",
    label: "Butterfly",
    iconPath: "/icons/ambient/forest.svg",
    credit: {
      name: "Butterfly",
      url: `${BACKGROUND_VIDEO_BASE_URL}/butterfly.mp4`,
    },
    background: {
      type: "video",
      source: `${BACKGROUND_VIDEO_BASE_URL}/butterfly.mp4`,
    },
  },
  flowers: {
    id: "flowers",
    label: "Flowers",
    iconPath: "/icons/ambient/forest.svg",
    credit: {
      name: "Flowers",
      url: `${BACKGROUND_VIDEO_BASE_URL}/flowers.mp4`,
    },
    background: {
      type: "video",
      source: `${BACKGROUND_VIDEO_BASE_URL}/flowers.mp4`,
    },
  },
  "nature-walk": {
    id: "nature-walk",
    label: "Nature Walk",
    iconPath: "/icons/ambient/forest.svg",
    credit: {
      name: "Nature Walk",
      url: `${BACKGROUND_VIDEO_BASE_URL}/nature-walk.mp4`,
    },
    background: {
      type: "video",
      source: `${BACKGROUND_VIDEO_BASE_URL}/nature-walk.mp4`,
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
  "beach-shore",
  "butterfly",
  "flowers",
  "nature-walk",
];

export const DEFAULT_AMBIENT_AUDIO_ID: AmbientAudioId = "rain";
export const DEFAULT_AMBIENT_BACKGROUND_ID: AmbientBackgroundId = "nature-walk";
export const DEFAULT_AMBIENT_VOLUME = 35;

export function isAmbientAudioId(value: string): value is AmbientAudioId {
  return value in AMBIENT_AUDIOS;
}

export function isAmbientBackgroundId(
  value: string
): value is AmbientBackgroundId {
  return value in AMBIENT_BACKGROUNDS;
}
