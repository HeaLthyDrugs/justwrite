import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Justwrite",
  description: "Privacy Policy and data practices for Justwrite.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        
        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Local-First Notes</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Justwrite is built for local-first note taking. Your notes stay encrypted and stored on your own device. We do not sell or monetize your personal notes or content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Third-Party Advertising &amp; Google AdSense</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            We use Google AdSense to serve advertisements on our site to support operations. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites on the internet.
          </p>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.
          </p>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Policy Updates</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            By using this website, you agree to this policy and any future updates posted here.
          </p>
        </section>

        <AdBanner className="mt-6" />

        <Footer />
      </div>
    </main>
  );
}
