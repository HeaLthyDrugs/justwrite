import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/how-it-works", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/shortcuts", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/changelog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/cookie-policy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/terms-of-service", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/disclaimer", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const staticRoutes = routes.map((route) => ({
    url: toAbsoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicRoutes = blogPosts.map((post) => ({
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
