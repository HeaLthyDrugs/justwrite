export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  readingTime: string; // e.g. "5 min read"
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-local-first-apps-matter",
    title: "Why Local-First Apps Matter for Your Privacy",
    description: "Understanding why keeping your data on your device is more important than ever, and how local-first architecture protects your privacy.",
    date: "2026-09-20",
    readingTime: "6 min read",
    tags: ["privacy", "local-first", "web apps"],
  },
  {
    slug: "distraction-free-writing-guide",
    title: "The Complete Guide to Distraction-Free Writing",
    description: "Practical techniques, tools, and habits to help you focus on writing without interruptions.",
    date: "2026-09-15",
    readingTime: "7 min read",
    tags: ["writing", "productivity", "focus"],
  },
  {
    slug: "understanding-end-to-end-encryption",
    title: "Understanding End-to-End Encryption in Web Apps",
    description: "A practical guide to how end-to-end encryption works in modern web applications, with real examples from browser-based tools.",
    date: "2026-09-10",
    readingTime: "8 min read",
    tags: ["encryption", "security", "web crypto"],
  },
  {
    slug: "markdown-writing-guide",
    title: "Markdown for Writers: A Practical Guide",
    description: "Learn Markdown formatting from scratch — headings, lists, links, code blocks, and more — to write faster and cleaner.",
    date: "2026-09-05",
    readingTime: "6 min read",
    tags: ["markdown", "writing", "formatting"],
  },
  {
    slug: "offline-first-web-apps",
    title: "How Offline-First Web Apps Work",
    description: "A deep dive into service workers, caching strategies, and localStorage that power web apps working without internet.",
    date: "2026-08-30",
    readingTime: "7 min read",
    tags: ["pwa", "offline", "service workers"],
  },
];
