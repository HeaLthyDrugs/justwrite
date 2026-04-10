import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: toAbsoluteUrl("/"),
    lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
