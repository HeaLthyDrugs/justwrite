import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "How Book & Sharing Work | Justwrite",
  description:
    "A simple guide to Justwrite's accountless, end-to-end encrypted note syncing and private link sharing.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-8">
        {/* Title & Navigation */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">How Book &amp; Sharing Work</h1>
            <Link
              href="/changelog"
              className="text-sm font-medium text-emerald-600 underline underline-offset-4 transition-colors hover:text-emerald-500 dark:text-emerald-400"
            >
              Changelog
            </Link>
          </div>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Justwrite is built for privacy. We use accountless end-to-end encryption so your notes stay private on your own devices.
          </p>
        </div>

        {/* Section 1: Privacy First */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">1. Zero-Knowledge Privacy</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            You don&apos;t need an email or account to write. Your notes are encrypted inside your browser before leaving your phone or computer. The server only stores scrambled data and cannot read your writing.
          </p>
        </section>

        {/* Section 2: Your Book */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">2. &ldquo;Your Book&rdquo; Sync</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Your Book uses a simple 4-word code (like <code>alpha-delta-zulu-mike</code>) to pair your devices. Your devices derive an AES-256 encryption key locally to lock and unlock your notes.
          </p>

          {/* Pencil Hand-drawn Diagram 1 */}
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <Image
              src="/blog/notebook-sync.jpg"
              alt="Hand-drawn diagram showing laptop and mobile phone encrypted data sync"
              width={1200}
              height={675}
              className="w-full object-cover"
              priority
            />
          </div>

          {/* High-Contrast Readable Code Block */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Client Encryption Code:
            </span>
            <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm">
              <pre>{`// 1. Generate 256-bit encryption key locally in browser
const aesKey = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 50000, hash: "SHA-256" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);

// 2. Encrypt notes on your device before sending to server
const encrypted = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  aesKey,
  new TextEncoder().encode(noteContent)
);`}</pre>
            </div>
          </div>
        </section>

        {/* Section 3: Instant Note Sharing */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">3. Private Note Sharing</h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            When you share a note, a secret key is added to the link after a <code>#</code> symbol (e.g. <code>/s/note#key=123</code>).
          </p>

          {/* Pencil Hand-drawn Diagram 2 */}
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <Image
              src="/blog/notebook-sharing.jpg"
              alt="Hand-drawn diagram showing browser URL hash fragment client-side decryption"
              width={1200}
              height={675}
              className="w-full object-cover"
            />
          </div>

          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Web browsers <strong>never send the <code>#key</code> part to the server</strong>. The server only sees the encrypted note ID, so your secret key never leaves the link.
          </p>
        </section>

        {/* Section 4: Summary Table */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">4. Summary</h2>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.05]">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-200">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-200">Traditional Apps</th>
                  <th className="px-4 py-3 text-left font-semibold text-emerald-600 dark:text-emerald-400">Justwrite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10 text-zinc-600 dark:text-zinc-300">
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Account</td>
                  <td className="px-4 py-3">Required</td>
                  <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">None</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Encryption</td>
                  <td className="px-4 py-3">Server-side</td>
                  <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">Client-side (AES-256)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Secret Links</td>
                  <td className="px-4 py-3">Server readable</td>
                  <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">URL hash (Browser only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-4">
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
