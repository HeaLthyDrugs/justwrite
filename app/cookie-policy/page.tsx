import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";

export const metadata = {
  title: "Cookie Policy | Justwrite",
  description: "Cookie Policy and storage usage details for Justwrite.",
};

export default function CookiePolicyPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Cookie Policy</h1>
        
        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Essential Local Storage</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            We use essential local browser storage to save your notes privately on your device. We also use preference storage to save your selected theme, font, and editor preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Advertising &amp; Analytics Cookies</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            We use Google AdSense on this site. Google and its partner advertising networks may place and read cookies on your browser, or use web beacons and device identifiers to collect information in the course of ads being served.
          </p>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            These cookies allow Google to serve personalized ads based on your visits to this and other websites. You can control your ad personalization settings at{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Managing Cookies</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            You can configure your browser settings to decline cookies or alert you when a cookie is being placed. Please note that blocking essential storage may impair local note-saving capabilities.
          </p>
        </section>

        <AdBanner className="mt-6" />

        <div className="mt-6 pt-2">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    </main>
  );
}
