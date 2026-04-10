export const FALLBACK_SITE_URL = "https://justwrite.app";

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Justwrite",
  shortName: "Justwrite",
  description:
    "Justwrite is a local-first notes app for fast, private writing. No login required, automatic saving, and a distraction-free editor.",
  url: normalizeSiteUrl(configuredSiteUrl || FALLBACK_SITE_URL),
  ogImage: "/favicon/android-chrome-512x512.png",
} as const;

export const defaultKeywords = [
  "notes app",
  "online notes",
  "local-first notes",
  "notes app without login",
  "distraction-free writing app",
  "private browser notes",
  "offline notes app",
  "minimal writing app",
  "autosave notes",
  "fast note taking",
];

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}
