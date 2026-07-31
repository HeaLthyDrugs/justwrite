"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Tick01Icon,
  Cancel01Icon,
  QrCodeIcon,
} from "@hugeicons/core-free-icons";
import { QRModal } from "./qr-modal";
import { Note, getNoteDisplayTitle } from "@/lib/notes-storage";
import { generateShareKey, encryptData } from "@/lib/crypto";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, note }) => {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && note) {
      void generateLink();
    }
  }, [isOpen, note]);

  const generateLink = async () => {
    if (!note) return;
    setIsGenerating(true);
    setError(null);
    setShareUrl("");

    try {
      const shareKey = generateShareKey();

      const notePayload = JSON.stringify({
        title: getNoteDisplayTitle(note),
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });

      const encryptedPayload = await encryptData(notePayload, shareKey);

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: encryptedPayload }),
      });

      if (!res.ok) {
        throw new Error("Failed to create share link.");
      }

      const data = (await res.json()) as { shareId?: string };
      if (!data.shareId) {
        throw new Error("Invalid response from server.");
      }

      const origin = window.location.origin;
      const fullUrl = `${origin}/s/${data.shareId}#key=${shareKey}`;
      setShareUrl(fullUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating share link.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !note) return null;

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
          
          {/* Top Bar: Title + Close */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Share this note
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Close"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Content */}
          {isGenerating ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Creating share link...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Full Share Link Box */}
              <div
                onClick={handleCopyLink}
                className="w-full max-w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 transition cursor-pointer overflow-hidden"
              >
                <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200 [word-break:break-all] break-all select-all leading-relaxed max-w-full">
                  {shareUrl}
                </p>
              </div>

              {/* Action Buttons in Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-full shadow-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} />
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-full py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <HugeiconsIcon icon={QrCodeIcon} size={14} />
                  <span>View QR Code</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Share QR Code"
        subtitle="Scan this QR code on any device to view or import this note."
        value={shareUrl}
      />
    </>
  );
};
