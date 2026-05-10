export default function DisclaimerPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          Content written in this app is user-generated and provided for personal productivity.
        </p>
        <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          We do not guarantee completeness, reliability, or suitability for legal, medical, or
          financial purposes.
        </p>
      </div>
    </main>
  );
}
