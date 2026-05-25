import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <div className="mt-4 space-y-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>Why this exists: to help you write fast, privately, and without distractions.</p>
          <p>Who made it: built by Manish and launched with care.</p>
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
