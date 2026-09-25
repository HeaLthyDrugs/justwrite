import Link from "next/link";
import { Kbd } from "@/components/ui/kbd";
import { AdBanner } from "@/components/ad-banner";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Keyboard Shortcuts | Justwrite",
  description: "Boost your productivity with Justwrite's keyboard shortcuts. Learn how to navigate and format your notes efficiently.",
};

const shortcutRows = [
  { keys: ["Alt", "1"], action: "Create a new note" },
  { keys: ["Alt", "2"], action: "Toggle light/dark theme" },
  { keys: ["Alt", "3"], action: "Toggle focus mode" },
  { keys: ["Alt", "4"], action: "Increase font size" },
  { keys: ["Alt", "5"], action: "Toggle typing sound" },
  { keys: ["Alt", "6"], action: "Toggle notebook lines" },
  { keys: ["Alt", "7"], action: "Toggle ambient mode" },
  { keys: ["Alt", "8"], action: "Toggle Markdown preview" },
  { keys: ["Ctrl/Cmd", "B"], action: "Bold text" },
  { keys: ["Ctrl/Cmd", "I"], action: "Italic text" },
  { keys: ["Ctrl/Cmd", "K"], action: "Insert link" },
];

export default function ShortcutsPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Keyboard Shortcuts</h1>
        
        <div className="space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>
            Mastering keyboard shortcuts is one of the easiest ways to significantly boost your writing productivity. When you don&apos;t have to lift your hands off the keyboard to navigate menus or toggle settings, your ideas can flow uninterrupted onto the page. Justwrite is designed to be entirely operable without a mouse.
          </p>
          <p>
            To avoid conflicting with common browser commands or your operating system&apos;s native shortcuts, our application-specific shortcuts intentionally use the <Kbd>Alt</Kbd> + number combination. This pattern ensures better reliability while writing in the editor and guarantees that your shortcuts will trigger exactly when you expect them to.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
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

        <div className="space-y-4 mt-8 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">Pro Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Universal Access:</strong> These shortcuts work seamlessly across all of Justwrite&apos;s visual themes and focus modes.</li>
            <li><strong>Markdown First:</strong> Standard Markdown formatting shortcuts (like <Kbd>Ctrl/Cmd</Kbd> + <Kbd>B</Kbd> for bold, <Kbd>Ctrl/Cmd</Kbd> + <Kbd>I</Kbd> for italic, and <Kbd>Ctrl/Cmd</Kbd> + <Kbd>K</Kbd> for inserting a link) are fully supported out-of-the-box in the editor.</li>
            <li><strong>Mac vs PC:</strong> On Mac, use the <Kbd>Option</Kbd> key instead of <Kbd>Alt</Kbd>, and <Kbd>Cmd</Kbd> instead of <Kbd>Ctrl</Kbd>.</li>
          </ul>
        </div>

        <AdBanner className="mt-8" />

        <Footer />
      </div>
    </main>
  );
}
