export const CONSENT_STORAGE_KEY = "justwrite.cookie-consent";
export const CONSENT_CHANGED_EVENT = "justwrite-consent-changed";
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const CONSENT_COOKIE_NAME = CONSENT_STORAGE_KEY;

export type ConsentState = "accepted" | "rejected" | "unset";

function isPersistedConsentState(value: string | null): value is Exclude<ConsentState, "unset"> {
  return value === "accepted" || value === "rejected";
}

function readConsentFromCookie(): Exclude<ConsentState, "unset"> | null {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = `${encodeURIComponent(CONSENT_COOKIE_NAME)}=`;
  const cookieEntry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  if (!cookieEntry) {
    return null;
  }

  const decodedValue = decodeURIComponent(cookieEntry.slice(encodedName.length));
  return isPersistedConsentState(decodedValue) ? decodedValue : null;
}

function writeConsentToCookie(nextState: Exclude<ConsentState, "unset">) {
  if (typeof document === "undefined") {
    return;
  }

  const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${encodeURIComponent(CONSENT_COOKIE_NAME)}=${encodeURIComponent(nextState)}` +
    `; Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureAttribute}`;
}

export function readConsentState(): ConsentState {
  if (typeof window === "undefined") {
    return "unset";
  }

  const cookieConsent = readConsentFromCookie();
  if (cookieConsent) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, cookieConsent);
    } catch {
      // Intentionally ignored: cookie acts as fallback persistence.
    }
    return cookieConsent;
  }

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (isPersistedConsentState(value)) {
      writeConsentToCookie(value);
      return value;
    }
  } catch {
    // Intentionally ignored: cookie lookup above is the fallback.
  }

  return "unset";
}

export function hasPreferenceConsent() {
  return readConsentState() === "accepted";
}

export function setConsentState(nextState: Exclude<ConsentState, "unset">) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextState);
  } catch {
    // Intentionally ignored: cookie write below is the fallback.
  }

  writeConsentToCookie(nextState);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextState }));
}
