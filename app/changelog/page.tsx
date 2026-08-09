import Link from "next/link";

const changelogEntries = [
  {
    date: "August 9, 2026",
    title: "Your Book (Zero-Knowledge E2EE Sync) & Instant Note Sharing",
    items: [
      "Added 'Your Book' accountless multi-device note syncing with 4-word Sync Codes (e.g. orbit-silver-maple-zenith).",
      "End-to-End Encryption (E2EE) powered by client-side Web Crypto API (AES-GCM-256 with PBKDF2 50,000 iterations).",
      "Zero-Knowledge Vault Architecture: SHA-256 vault hashing ensures server only stores encrypted data without seeing your keys.",
      "QR Code modal for fast instant device pairing and live connected device manager.",
      "Instant Note Sharing with unique client-side secret keys stored in URL hash fragments (#key=...)—never sent to the server.",
      "Added interactive GooeyMenu component for fluid menu triggers.",
      "Note preview container updated to match editor dimensions perfectly.",
      "Added green indicator dot in settings drawer for new changelog updates.",
      "Added technical documentation page (/how-it-works) explaining privacy architecture.",
    ],
  },
  {
    date: "July 18, 2026",
    title: "Audio Volume Control, Sound Categories & Spell Check",
    items: [
      "Added 0-60% Volume Range Slider for typing sounds with instant live feedback.",
      "Added organized dropdown menu for typing sound variants (Typewriter, Mechanical, Digital, Soft).",
      "Added browser native Spell Check toggle control in the Settings drawer.",
      "Added Product Hunt badge integration in navigation bar and drawer header.",
    ],
  },
  {
    date: "June 29, 2026",
    title: "Markdown Preview + Split View",
    items: [
      "Added Markdown Preview mode for rendering notes directly inside the main editor card.",
      "Added Edit, Preview, and Split view tabs for raw, rendered, and side-by-side writing.",
      "Added bottom-bar Markdown toggle to show or hide editor preview tabs.",
      "Full GitHub-flavored Markdown support (tables, task lists, strikethrough).",
      "Added Alt+8 shortcut for instant toggling of Markdown preview mode.",
    ],
  },
  {
    date: "June 4, 2026",
    title: "Installable App + PWA Release",
    items: [
      "Justwrite can now be installed as an app on desktop and mobile browsers.",
      "Dedicated install button in editor chrome with guided fallback steps for iOS and Safari.",
      "Pre-cached static shell, icons, audio, and background images for complete offline support.",
      "Service worker updates now use an explicit refresh-ready flow.",
    ],
  },
  {
    date: "June 1, 2026",
    title: "Ambient Mode V2 + Shortcut Expansion",
    items: [
      "Independent Scene and Audio selection pickers directly in Settings.",
      "Redesigned ambient cards with custom gradients for light and dark themes.",
      "Expanded keyboard shortcuts to full Alt+1 through Alt+8 set.",
    ],
  },
  {
    date: "May 25, 2026",
    title: "Ambient Mode V1",
    items: [
      "Looped ambient scenes: Rain, Coffee Shop, Library, Night, Forest, and Lo-fi Room.",
      "Volume control and scene selection persisted in local storage.",
      "Keyboard shortcut Alt+7 for toggling ambient mode.",
    ],
  },
  {
    date: "May 10, 2026",
    title: "Launch Build",
    items: [
      "Local-first notes with automatic save and offline-aware status.",
      "Multi-note workflow with create, pin/unpin, delete, and updated timestamps.",
      "Distraction-free writing with Focus Mode.",
      "Export options for TXT, Markdown, and JSON snapshots.",
      "Settings controls for notebook lines, font size, word count, spell check, and typing sound.",
      "Theme toggle (light/dark) and font switching (sans, mono, pixel).",
      "Legal pages added: Privacy Policy, Terms of Service, Cookie Policy, Disclaimer.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-emerald-600 underline underline-offset-4 transition-colors hover:text-emerald-500 dark:text-emerald-400"
          >
            How Book &amp; Sharing Works
          </Link>
        </div>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          Product updates and shipped features.
        </p>

        <div className="mt-8 space-y-8">
          {changelogEntries.map((entry) => (
            <section key={entry.date}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                {entry.date}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">{entry.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 pt-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Back to Editor so this should be a link to the main page
          </Link>
        </div>
      </div>
    </main>
  );
}
