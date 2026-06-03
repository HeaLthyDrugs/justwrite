import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pixelify_Sans, Figtree } from "next/font/google";
import "./globals.css";
import { FontProvider } from "@/components/font-context";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { GlobalThemeShortcut } from "@/components/global-theme-shortcut";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { defaultKeywords, siteConfig, toAbsoluteUrl } from "@/lib/seo";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Justwrite | Your Private Local Notes",
    template: "%s | Justwrite",
  },
  description: siteConfig.description,
  keywords: defaultKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Justwrite | Your Private Local Notes",
    description: siteConfig.description,
    url: toAbsoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: toAbsoluteUrl(siteConfig.ogImage),
        width: 512,
        height: 512,
        alt: "Justwrite app icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Justwrite | Your Private Local Notes",
    description: siteConfig.description,
    images: [toAbsoluteUrl(siteConfig.ogImage)],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  icons: {
    icon: [
      { url: "/logo/justwrite-app-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/justwrite-app-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/justwrite-logo-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/logo/justwrite-logo-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/logo/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, pixelFont.variable, "font-sans", figtree.variable)}
    >
      <body className="antialiased" suppressHydrationWarning>
        <TooltipProvider>
          <FontProvider>
            <ServiceWorkerRegister />
            <GlobalThemeShortcut />
            {children}
            <CookieConsentBanner />
          </FontProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
