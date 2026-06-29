import Link from "next/link";
import { Kbd } from "@/components/ui/kbd";

const shortcutRows = [
  { keys: ["Alt", "1"], action: "Create a new note" },
  { keys: ["Alt", "2"], action: "Toggle light/dark theme" },
  { keys: ["Alt", "3"], action: "Toggle focus mode" },
  { keys: ["Alt", "4"], action: "Increase font size" },
  { keys: ["Alt", "5"], action: "Toggle typing sound" },
  { keys: ["Alt", "6"], action: "Toggle notebook lines" },
  { keys: ["Alt", "7"], action: "Toggle ambient mode" },
  { keys: ["Alt", "8"], action: "Toggle Markdown preview" },
];

export default function ShortcutsPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-3xl font-semibold tracking-tight">Keyboard Shortcuts</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          These shortcuts are intentionally simple and use <Kbd>Alt</Kbd> + number
          combos for better reliability while writing in the editor.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.05]">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-200">
                  Shortcut
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcutRows.map((item) => (
                <tr
                  key={item.action}
                  className="border-b border-black/5 last:border-b-0 dark:border-white/10"
                >
                  <td className="px-4 py-3">
                    <div className="inline-flex flex-wrap items-center gap-1.5">
                      {item.keys.map((part, index) => (
                        <span key={`${item.action}-${part}`} className="inline-flex items-center gap-1.5">
                          {index > 0 ? <span className="text-zinc-400">+</span> : null}
                          <Kbd>{part}</Kbd>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
