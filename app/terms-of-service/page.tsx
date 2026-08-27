import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";

export const metadata = {
  title: "Terms of Service | Justwrite",
  description: "Terms of Service for Justwrite.",
};

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          This website is provided as-is, without warranties of any kind.
        </p>
        <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          You are responsible for how you use the service and for keeping local backups
          of your own notes.
        </p>

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
