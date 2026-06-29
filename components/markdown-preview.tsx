"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  body: string;
  fontSize: number;
  className?: string;
}

export function MarkdownPreview({
  body,
  fontSize,
  className,
}: MarkdownPreviewProps) {
  const hasContent = body.trim().length > 0;

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
    </article>
  );
}
