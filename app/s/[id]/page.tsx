"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  Download01Icon,
  Tick01Icon,
  ArrowLeft02Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";
import { MarkdownPreview } from "@/components/markdown-preview";
import { loadNotesSnapshot, saveNotesSnapshot, createEmptyNote, formatNoteDateTime } from "@/lib/notes-storage";
import { decryptData, EncryptedPayload } from "@/lib/crypto";

interface SharedNoteData {
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export default function SharedNotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [noteData, setNoteData] = useState<SharedNoteData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<boolean>(false);
  const [copiedContent, setCopiedContent] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAndDecrypt() {
      setIsLoading(true);
      setError(null);

      // 1. Get secret key from URL hash fragment (#key=...)
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const keyMatch = hash.match(/#key=([a-f0-9]+)/i);
      const shareKey = keyMatch ? keyMatch[1] : null;

      if (!shareKey) {
        setError("Missing secret decryption key in share link URL.");
        setIsLoading(false);
        return;
      }

      try {
        // 2. Fetch encrypted payload from server
        const res = await fetch(`/api/share/${resolvedParams.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("This shared note was not found or has expired.");
          }
          throw new Error("Failed to load shared note from server.");
        }

        const data = (await res.json()) as { payload?: EncryptedPayload };
        if (!data.payload) {
          throw new Error("Invalid payload format received from server.");
        }

        // 3. Decrypt in browser
        const decryptedText = await decryptData(data.payload, shareKey);
        const parsed = JSON.parse(decryptedText) as SharedNoteData;

        setNoteData(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to decrypt shared note.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndDecrypt();
  }, [resolvedParams.id]);

  const handleImportNote = () => {
    if (!noteData) return;

    let snapshot = loadNotesSnapshot();
    const newNote = createEmptyNote();
    newNote.body = noteData.body;
    newNote.createdAt = noteData.createdAt || new Date().toISOString();
    newNote.updatedAt = new Date().toISOString();

    if (!snapshot) {
      snapshot = {
        version: 1,
        notes: [newNote],
        activeNoteId: newNote.id,
      };
    } else {
      snapshot.notes = [newNote, ...snapshot.notes];
      snapshot.activeNoteId = newNote.id;
    }

    saveNotesSnapshot(snapshot);
    setImported(true);

    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  const handleCopyContent = async () => {
    if (!noteData?.body) return;
    try {
      await navigator.clipboard.writeText(noteData.body);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-3 md:p-6 bg-neutral-50/50 dark:bg-neutral-950 text-zinc-900 dark:text-zinc-100 font-sans relative">
      <main className="relative flex h-full w-full max-w-[920px] flex-col justify-center py-4 md:py-6 z-10">
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/70 p-10 text-center shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10 space-y-4">
              <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Decrypting shared note...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/70 p-8 text-center shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10 space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                <HugeiconsIcon icon={LockIcon} size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Unable to Decrypt Shared Note
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  {error}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 h-9 px-4 rounded-full text-xs font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={15} />
                  <span>Back to App</span>
                </Link>
              </div>
            </div>
          </div>
        ) : noteData ? (
          <div className="w-full flex flex-col h-full min-h-0 animate-in fade-in duration-200">
            {/* Plain text Date and Time outside top right corner of card */}
            <div className="w-full flex justify-end mb-2 px-3 shrink-0">
              <span className="text-xs font-medium text-zinc-500/90 dark:text-zinc-400/90">
                {formatNoteDateTime(noteData.updatedAt || noteData.createdAt)}
              </span>
            </div>

            {/* Note Preview Container - Fixed height & responsive like app editor */}
            <article className="relative flex h-[68vh] min-h-[380px] max-h-[720px] w-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_24px_60px_rgba(15,15,15,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161618]/70 dark:ring-white/10">
              <MarkdownPreview body={noteData.body} fontSize={18} className="h-full w-full" />
            </article>

            {/* Action buttons below Note preview */}
            <div className="w-full mt-3 flex items-center justify-between gap-3 shrink-0">
              <Link
                href="/"
                className="h-9 px-4 rounded-full border border-black/5 bg-white/80 hover:bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-semibold shadow-xs backdrop-blur-md transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={15} />
                <span>Back to App</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="h-9 px-3.5 rounded-full border border-black/5 bg-white/80 hover:bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-semibold shadow-xs backdrop-blur-md transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <HugeiconsIcon icon={copiedContent ? Tick01Icon : Copy01Icon} size={14} />
                  <span>{copiedContent ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleImportNote}
                  disabled={imported}
                  className="h-9 px-4 rounded-full border border-amber-500/30 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <HugeiconsIcon icon={imported ? Tick01Icon : Download01Icon} size={15} />
                  <span>{imported ? "Imported!" : "Import Note"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}


