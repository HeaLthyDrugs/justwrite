export type TypingSoundVariantId =
  | "classic"
  | "crisp"
  | "typewriter"
  | "soft";

export interface TypingSoundVariantConfig {
  id: TypingSoundVariantId;
  label: string;
  category: "Balanced" | "Mechanical" | "Soft";
  keyPath: string;
  spacePath: string;
}

export const DEFAULT_TYPING_SOUND_VARIANT_ID: TypingSoundVariantId = "classic";

export const TYPING_SOUND_VARIANT_ORDER: TypingSoundVariantId[] = [
  "classic",
  "crisp",
  "typewriter",
  "soft",
];

export const TYPING_SOUND_VARIANTS: Record<
  TypingSoundVariantId,
  TypingSoundVariantConfig
> = {
  classic: {
    id: "classic",
    label: "Classic",
    category: "Balanced",
    keyPath: "/sounds/typing/classic/key.mp3",
    spacePath: "/sounds/typing/classic/space.mp3",
  },
  crisp: {
    id: "crisp",
    label: "Crisp Keys",
    category: "Balanced",
    keyPath: "/sounds/typing/crisp/key.mp3",
    spacePath: "/sounds/typing/crisp/space.mp3",
  },
  typewriter: {
    id: "typewriter",
    label: "Typewriter",
    category: "Mechanical",
    keyPath: "/sounds/typing/typewriter/key.mp3",
    spacePath: "/sounds/typing/typewriter/space.mp3",
  },
  soft: {
    id: "soft",
    label: "Soft Tap",
    category: "Soft",
    keyPath: "/sounds/typing/soft/key.mp3",
    spacePath: "/sounds/typing/soft/space.mp3",
  },
};

export function isTypingSoundVariantId(
  value: string
): value is TypingSoundVariantId {
  return value in TYPING_SOUND_VARIANTS;
}
