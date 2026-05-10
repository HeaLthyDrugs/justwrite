"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CONSENT_STORAGE_KEY, readConsentState, setConsentState } from "@/lib/consent";

export function CookieConsentBanner() {
  const [consentState, setLocalConsentState] = useState(readConsentState);
  const visible = useMemo(() => consentState === "unset", [consentState]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[70] w-[min(680px,calc(100%-1rem))] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/92 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/92">
      <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">
        We use essential local storage to keep notes working. Preference storage
        (theme, font, editor options) is optional.
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Consent key: <code>{CONSENT_STORAGE_KEY}</code>. Read more in{" "}
        <Link href="/cookie-policy" className="underline underline-offset-2">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setConsentState("rejected");
            setLocalConsentState("rejected");
          }}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Reject optional
        </button>
        <button
          type="button"
          onClick={() => {
            setConsentState("accepted");
            setLocalConsentState("accepted");
          }}
          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
