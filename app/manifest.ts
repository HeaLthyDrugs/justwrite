import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Justwrite",
    short_name: "Justwrite",
    description:
      "A local-first notes app for fast, private, distraction-free writing.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f3ff",
    theme_color: "#f8fafc",
    categories: ["productivity", "utilities", "writing"],
    icons: [
      {
        src: "/logo/justwrite-app-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/justwrite-app-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/justwrite-app-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo/justwrite-app-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/justwrite-desktop-install.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop writing workspace with notes, export controls, and ambient mode.",
      },
      {
        src: "/screenshots/justwrite-mobile-install.png",
        sizes: "750x1334",
        type: "image/png",
        label: "Mobile writing workspace with the editor and quick actions.",
      },
    ],
  };
}
