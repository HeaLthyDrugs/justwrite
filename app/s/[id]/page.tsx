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
  SecurityCheckIcon,
  Clock01Icon,
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          <span>Open JustWrite</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <HugeiconsIcon icon={SecurityCheckIcon} size={14} />
            <span>Zero-Knowledge Encrypted</span>
          </span>

          {noteData && (
            <button
              onClick={handleImportNote}
              disabled={imported}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xs transition disabled:opacity-50"
            >
              <HugeiconsIcon icon={imported ? Tick01Icon : Download01Icon} size={15} />
              <span>{imported ? "Imported!" : "Import Note to My App"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Decrypting private shared note...
            </p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-500">
              <HugeiconsIcon icon={LockIcon} size={32} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Unable to Decrypt Shared Note
            </h2>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">{error}</p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl"
              >
                Go to JustWrite Home
              </Link>
            </div>
          </div>
        ) : noteData ? (
          <article className="space-y-6 bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2 text-xs text-neutral-400">
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                <span>Shared Note • {formatNoteDateTime(noteData.updatedAt || noteData.createdAt)}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <MarkdownPreview body={noteData.body} fontSize={16} />
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}
