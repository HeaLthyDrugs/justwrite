export const CONSENT_STORAGE_KEY = "justwrite.cookie-consent";
export const CONSENT_CHANGED_EVENT = "justwrite-consent-changed";

export type ConsentState = "accepted" | "rejected" | "unset";

export function readConsentState(): ConsentState {
  if (typeof window === "undefined") {
    return "unset";
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === "accepted" || value === "rejected") {
    return value;
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

  window.localStorage.setItem(CONSENT_STORAGE_KEY, nextState);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextState }));
}
