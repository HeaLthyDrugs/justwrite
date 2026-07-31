/**
 * Web Crypto API utilities for Zero-Knowledge End-to-End Encryption (E2EE)
 * Used for accountless note syncing and instant private note sharing.
 */

// A curated list of 256 memorable words for 4-word Sync Codes
const WORD_LIST = [
  "amber", "anchor", "arch", "arrow", "atlas", "autumn", "beacon", "bloom",
  "breeze", "bridge", "bright", "brook", "candle", "canyon", "castle", "cedar",
  "cliff", "cloud", "clover", "coast", "comet", "coral", "cosmos", "crest",
  "crown", "crystal", "dawn", "delta", "desert", "dew", "diamond", "drift",
  "dune", "eagle", "echo", "ember", "falcon", "feather", "fern", "field",
  "flame", "forest", "frost", "garden", "glade", "globe", "grace", "grove",
  "harbor", "haven", "hazel", "hearth", "heron", "horizon", "island", "ivory",
  "jade", "jasper", "jewel", "lagoon", "lake", "laurel", "leaf", "legend",
  "lotus", "lunar", "maple", "meadow", "melody", "mira", "mist", "moon",
  "moss", "mountain", "nebula", "nectar", "oasis", "ocean", "olive", "opal",
  "orbit", "orchid", "owl", "palm", "path", "peak", "pearl", "pebble",
  "phoenix", "pine", "planet", "prism", "pulse", "quartz", "rain", "raven",
  "reef", "ridge", "river", "robin", "rose", "ruby", "sage", "sail",
  "sapphire", "shadow", "shell", "shine", "sienna", "signal", "silk", "silver",
  "sky", "solar", "spark", "spectrum", "sphere", "spice", "spirit", "spring",
  "star", "stone", "storm", "stream", "summit", "sun", "swan", "swift",
  "timber", "topaz", "trace", "trail", "valley", "velvet", "wave", "willow",
  "wind", "wisdom", "zenith", "zephyr", "alder", "alpine", "arctic", "astral",
  "aurora", "azure", "balm", "balsam", "basalt", "bay", "birch", "blossom",
  "boulder", "bramble", "breeze", "broad", "brook", "canopy", "cascade", "celeste",
  "chart", "chime", "cider", "cirrus", "clearing", "cove", "crag", "crane",
  "current", "cypress", "dusk", "echo", "elixir", "elm", "evergreen", "fable",
  "fair", "flint", "flora", "foam", "fountain", "fox", "gale", "glacier",
  "gleam", "glimmer", "glen", "glowing", "granite", "halcyon", "harvest", "hazel",
  "hemlock", "highland", "hollow", "honey", "iris", "island", "ivy", "juniper",
  "kindle", "knoll", "lark", "light", "lily", "linden", "lunar", "lush",
  "magnolia", "mantle", "mariner", "marsh", "meadow", "mesa", "mirage", "monarch",
  "moonlight", "morning", "mountain", "myrtle", "nectar", "nook", "north", "oak",
  "oceanic", "orchard", "orion", "osprey", "owl", "petal", "pinecone", "pioneer",
  "plain", "plum", "pond", "poppy", "prairie", "prompt", "quartz", "radial",
  "radiant", "reeds", "ripple", "roamer", "rustic", "saffron", "sailor", "sand",
  "sequoia", "shelter", "shore", "silt", "solstice", "sound", "sparkle", "spruce",
  "starlight", "stride", "sumac", "sundown", "sunrise", "thistle", "tide", "timber"
];

/**
 * Generate a random 4-word Sync Code (e.g. "orbit-silver-maple-zenith")
 */
export function generateSyncCode(): string {
  const getRandomBytes = (count: number): Uint8Array => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint8Array(count);
      window.crypto.getRandomValues(arr);
      return arr;
    }
    const cryptoLib = require("crypto");
    return new Uint8Array(cryptoLib.randomBytes(count));
  };

  const bytes = getRandomBytes(4);
  const words = Array.from(bytes).map(byte => WORD_LIST[byte % WORD_LIST.length]);
  return words.join("-");
}

function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes =
    buffer instanceof Uint8Array
      ? buffer
      : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compute SHA-256 hash of Sync Code to use as server key (vaultId)
 */
export async function hashSyncCode(syncCode: string): Promise<string> {
  const normalized = syncCode.trim().toLowerCase();
  const getSubtle = () => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      return window.crypto.subtle;
    }
    const globalCrypto = typeof crypto !== "undefined" ? crypto : require("crypto").webcrypto;
    return globalCrypto.subtle;
  };

  const subtle = getSubtle();
  const hashBuffer = await subtle.digest("SHA-256", stringToBuffer(`justwrite-vault-id:${normalized}`));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function deriveAESKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const normalized = passphrase.trim().toLowerCase();
  const getSubtle = () => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      return window.crypto.subtle;
    }
    const globalCrypto = typeof crypto !== "undefined" ? crypto : require("crypto").webcrypto;
    return globalCrypto.subtle;
  };

  const subtle = getSubtle();
  const keyMaterial = await subtle.importKey(
    "raw",
    stringToBuffer(normalized),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 50000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export interface EncryptedPayload {
  salt: string; // Base64
  iv: string;   // Base64
  ciphertext: string; // Base64
  version: number;
}

/**
 * Encrypt plaintext string using Sync Code
 */
export async function encryptData(plaintext: string, syncCode: string): Promise<EncryptedPayload> {
  const getCrypto = () => {
    if (typeof window !== "undefined" && window.crypto) {
      return window.crypto;
    }
    return (require("crypto").webcrypto || require("crypto")) as Crypto;
  };

  const cryptObj = getCrypto();
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  cryptObj.getRandomValues(salt);
  cryptObj.getRandomValues(iv);

  const key = await deriveAESKey(syncCode, salt);
  const encryptedBuffer = await cryptObj.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    stringToBuffer(plaintext) as BufferSource
  );

  return {
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(encryptedBuffer),
    version: 1,
  };
}

/**
 * Decrypt EncryptedPayload using Sync Code
 */
export async function decryptData(payload: EncryptedPayload, syncCode: string): Promise<string> {
  const getSubtle = () => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      return window.crypto.subtle;
    }
    const globalCrypto = typeof crypto !== "undefined" ? crypto : require("crypto").webcrypto;
    return globalCrypto.subtle;
  };

  const subtle = getSubtle();
  const salt = base64ToBuffer(payload.salt);
  const iv = base64ToBuffer(payload.iv);
  const ciphertext = base64ToBuffer(payload.ciphertext);

  const key = await deriveAESKey(syncCode, salt);
  const decryptedBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext as BufferSource
  );

  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Generate a random secret key for single note sharing
 */
export function generateShareKey(): string {
  const getCrypto = () => {
    if (typeof window !== "undefined" && window.crypto) {
      return window.crypto;
    }
    return require("crypto").webcrypto || require("crypto");
  };

  const bytes = new Uint8Array(16);
  getCrypto().getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
