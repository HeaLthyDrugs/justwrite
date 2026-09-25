import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Justwrite",
  description: "Guides, insights, and deep dives on privacy, writing, and building local-first tools.",
};

export default function BlogListPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Guides, insights, and deep dives on privacy, writing, and building local-first tools.
          </p>
        </div>

        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="block group overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdBanner className="my-6" />

        <div className="pt-4">
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
