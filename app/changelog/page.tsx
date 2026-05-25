import Link from "next/link";

const changelogEntries = [
  {
    date: "May 10, 2026",
    title: "Launch Build",
    items: [
      "Local-first notes with automatic save and offline-aware status.",
      "Multi-note workflow with create, pin/unpin, delete, and updated timestamps.",
      "Distraction-free writing with Focus Mode.",
      "Markdown-friendly editor with shortcuts: Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+K, and Tab indent.",
      "Export options for TXT, Markdown, and JSON snapshots.",
      "Settings controls for notebook lines, font size, word count, spell check, and typing sound.",
      "Theme toggle (light/dark) and font switching (sans, mono, pixel).",
      "Legal pages added: Privacy Policy, Terms of Service, Cookie Policy, Disclaimer.",
      "Cookie/local-storage consent system: essential storage always on, optional preference storage by consent.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
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

        <div className="mt-6">
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
