"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Old-school minimal search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles"
          className="w-full rounded-none border-b border-zinc-200 bg-transparent py-2 pl-7 pr-7 text-sm text-zinc-800 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 transition-colors"
        />
        <svg
          className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Old-school compact, minimal text list without separators */}
      {filteredPosts.length === 0 ? (
        <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 font-mono">
          No articles found matching &ldquo;{searchQuery}&rdquo;
        </div>
      ) : (
        <ul className="space-y-3 sm:space-y-3.5">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6"
              >
                <span className="text-sm sm:text-base font-medium text-zinc-900 group-hover:underline underline-offset-4 dark:text-zinc-100 transition-colors">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2 font-mono">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span>{post.readingTime}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
