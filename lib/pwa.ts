export const PWA_UPDATE_READY_EVENT = "justwrite:pwa-update-ready";
export const PWA_APPLY_UPDATE_EVENT = "justwrite:pwa-apply-update";
export const PWA_TRIGGER_INSTALL_EVENT = "justwrite:pwa-trigger-install";
export const PWA_INSTALL_AVAILABILITY_EVENT =
  "justwrite:pwa-install-availability";
export const PWA_INSTALL_DISMISSED_AT_STORAGE_KEY =
  "justwrite.pwa.install.dismissed-at";
export const PWA_INSTALL_PROMPT_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7;
export const PWA_STANDALONE_MEDIA_QUERY = "(display-mode: standalone)";

export function isInstallPromptCoolingDown(now = Date.now()) {
  if (typeof window === "undefined") {
    return false;
  }

  const storedValue = window.localStorage.getItem(
    PWA_INSTALL_DISMISSED_AT_STORAGE_KEY
  );
  if (!storedValue) {
    return false;
  }

  const dismissedAt = Number.parseInt(storedValue, 10);
  if (Number.isNaN(dismissedAt)) {
    return false;
  }

  return now - dismissedAt < PWA_INSTALL_PROMPT_COOLDOWN_MS;
}

export function rememberInstallPromptDismissal(now = Date.now()) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PWA_INSTALL_DISMISSED_AT_STORAGE_KEY,
    String(now)
  );
}

export function clearInstallPromptDismissal() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PWA_INSTALL_DISMISSED_AT_STORAGE_KEY);
}

export function isStandaloneDisplayMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia(PWA_STANDALONE_MEDIA_QUERY).matches ||
    window.navigator.standalone === true
  );
}
