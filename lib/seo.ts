import type { Metadata } from "next";

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
    "Justwrite is a fast, local-first notes app for distraction-free writing. No login required, automatic offline autosave, and zero cloud tracking.",
  url: resolveSiteUrl(),
  ogImage: "/og.png",
} as const;

export const defaultKeywords = [
  "notes app",
  "online notepad",
  "notes app without login",
  "local-first notes",
  "distraction-free writing app",
  "private browser notes",
  "offline notes app",
  "minimal writing app",
  "autosave notes",
  "markdown editor online",
  "encrypted notes app",
  "fast note taking",
];

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
}

export function createPageMetadata({
  title,
  description,
  path,
  ogImage = siteConfig.ogImage,
  keywords = defaultKeywords,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = toAbsoluteUrl(path);
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: toAbsoluteUrl(ogImage),
          width: 1200,
          height: 630,
          alt: `${title} - Justwrite`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [toAbsoluteUrl(ogImage)],
    },
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
  };
}

export function getWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "All (Web, PWA)",
    browserRequirements: "Requires modern JavaScript-enabled browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Manish",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/logo/justwrite-app-512.png"),
      },
    },
  };
}

export function getBlogPostJsonLd(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
}) {
  const postUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    image: toAbsoluteUrl(siteConfig.ogImage),
    author: {
      "@type": "Person",
      name: "Manish",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/logo/justwrite-app-512.png"),
      },
    },
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}
