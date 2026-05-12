export const FALLBACK_SITE_URL = "https://justwrite.sbs";

function normalizeSiteUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return withProtocol.endsWith("/")
    ? withProtocol.slice(0, -1)
    : withProtocol;
}

function resolveSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) return normalizeSiteUrl(configuredSiteUrl);

  const vercelProductionUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) return normalizeSiteUrl(vercelProductionUrl);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return normalizeSiteUrl(vercelUrl);

  return FALLBACK_SITE_URL;
}

export const siteConfig = {
  name: "Justwrite",
  shortName: "Justwrite",
  description:
    "Justwrite is a local-first notes app for fast, private writing. No login required, automatic saving, and a distraction-free editor.",
  url: resolveSiteUrl(),
  ogImage: "/og.png",
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
