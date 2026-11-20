"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { attachmentIdFromPath, attachmentUrlMap, revokeAttachmentUrls } from "@/lib/note-attachments";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface MarkdownPreviewProps {
  body: string;
  fontSize: number;
  className?: string;
  noteId?: string;
  attachmentUrls?: Record<string, string>;
}

export function MarkdownPreview({
  body,
  fontSize,
  className,
  noteId,
  attachmentUrls: providedAttachmentUrls,
}: MarkdownPreviewProps) {
  const hasContent = body.trim().length > 0;
  const attachmentRefsKey = Array.from(
    body.matchAll(/(?:^|[(/"'\s])attachments\/([a-zA-Z0-9_-]+)\.[a-zA-Z0-9]+(?=$|[?#)\s"'])/g),
    (match) => match[1]
  ).join("|");
  const [storedAttachmentUrls, setStoredAttachmentUrls] = useState<Record<string, string>>({});
  const [openedImage, setOpenedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!noteId || providedAttachmentUrls) return;
    let cancelled = false;
    let urls: Record<string, string> = {};
    if (!attachmentRefsKey) {
      setStoredAttachmentUrls({});
      return;
    }
    void attachmentUrlMap(noteId).then((loaded) => {
      if (cancelled) {
        revokeAttachmentUrls(loaded);
        return;
      }
      urls = loaded;
      setStoredAttachmentUrls(loaded);
    }).catch(() => {
      if (!cancelled) setStoredAttachmentUrls({});
    });
    return () => {
      cancelled = true;
      revokeAttachmentUrls(urls);
      setStoredAttachmentUrls({});
    };
  }, [noteId, providedAttachmentUrls, attachmentRefsKey]);

  const resolvedAttachmentUrls = providedAttachmentUrls ?? storedAttachmentUrls;

  return (
    <article
      aria-label="Markdown preview"
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
      className={cn(
        "h-full w-full overflow-y-auto px-8 py-8 pb-24 text-zinc-800 outline-none dark:text-zinc-100 md:px-12 md:py-10 md:pb-14 lg:px-16 lg:py-12 lg:pb-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {hasContent ? (
        <div className="max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:font-medium [&_a]:text-zinc-900 [&_a]:underline [&_a]:decoration-zinc-400 [&_a]:underline-offset-4 hover:[&_a]:decoration-zinc-700 dark:[&_a]:text-zinc-100 dark:[&_a]:decoration-zinc-500 dark:hover:[&_a]:decoration-zinc-200 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600 dark:[&_blockquote]:border-zinc-600 dark:[&_blockquote]:text-zinc-300 [&_code]:rounded-md [&_code]:bg-black/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] dark:[&_code]:bg-white/10 [&_h1]:mb-4 [&_h1]:mt-7 [&_h1]:text-[1.65em] [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-[1.35em] [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-[1.15em] [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:font-semibold [&_hr]:my-7 [&_hr]:border-zinc-200 dark:[&_hr]:border-zinc-700 [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-zinc-950/[0.06] [&_pre]:p-4 dark:[&_pre]:bg-white/10 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_table]:my-5 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-zinc-700 [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-black/[0.04] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold dark:[&_th]:border-zinc-700 dark:[&_th]:bg-white/10 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 [&_ul.contains-task-list]:list-none [&_ul.contains-task-list]:pl-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              a: ({ href, children, ...props }) => {
                const isExternal =
                  href?.startsWith("http://") || href?.startsWith("https://");

                return (
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              img: ({ src, alt }) => {
                const source = typeof src === "string" ? src : "";
                const attachmentId = attachmentIdFromPath(source);
                const resolvedSrc = attachmentId
                  ? resolvedAttachmentUrls[attachmentId]
                  : source;
                if (!resolvedSrc) {
                  return attachmentId ? (
                    <span className="my-4 inline-flex rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700">
                      Image unavailable
                    </span>
                  ) : null;
                }
                return (
                  <button
                    type="button"
                    className="my-4 block max-w-full cursor-zoom-in rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                    onClick={() => setOpenedImage({ src: resolvedSrc, alt: alt ?? "Note image" })}
                    aria-label={`Open image full screen: ${alt || "Note image"}`}
                  >
                    {/* Markdown image URLs may be remote, so use a native image element. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolvedSrc}
                      alt={alt ?? ""}
                      loading="lazy"
                      className="max-h-[70vh] max-w-full rounded-xl object-contain"
                    />
                  </button>
                );
              },
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="flex h-full min-h-[240px] items-center justify-center text-center text-sm font-medium text-zinc-400 dark:text-zinc-500">
          Nothing to preview yet.
        </div>
      )}
      <Dialog open={openedImage !== null} onOpenChange={(open) => !open && setOpenedImage(null)}>
        <DialogContent
          showCloseButton
          aria-describedby={undefined}
          className="flex h-[min(94dvh,1000px)] w-[min(96vw,1400px)] max-w-none items-center justify-center border-0 bg-black/95 p-3 shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">{openedImage?.alt || "Full-screen image"}</DialogTitle>
          {openedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={openedImage.src}
              alt={openedImage.alt}
              className="max-h-full max-w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </article>
  );
}
