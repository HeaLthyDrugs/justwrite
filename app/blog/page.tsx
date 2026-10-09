import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { BlogList } from "@/components/blog-list";
import { blogPosts } from "@/lib/blog";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Blog & Guides",
  description:
    "Guides, insights, and deep dives on privacy, local-first apps, distraction-free writing, and Markdown productivity.",
  path: "/blog",
  keywords: [
    "writing blog",
    "privacy guides",
    "local-first software",
    "markdown tutorials",
    "distraction-free writing tips",
  ],
});

export default function BlogListPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="w-full max-w-3xl text-left space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Guides, insights, and notes on privacy, writing, and local-first tools.
          </p>
        </div>

        <BlogList posts={blogPosts} />

        <AdBanner className="my-6" />

        <div className="pt-2">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-500 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to Editor
          </Link>
        </div>
      </div>
    </main>
  );
}
