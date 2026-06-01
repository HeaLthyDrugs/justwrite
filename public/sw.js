const CACHE_VERSION = "justwrite-v6";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/favicon/favicon-16x16.png",
  "/favicon/favicon-32x32.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/android-chrome-192x192.png",
  "/favicon/android-chrome-512x512.png",
  "/logo/justwrite-logo.svg",
  "/logo/justwrite-logo-light.svg",
  "/logo/justwrite-logo-dark.svg",
  "/sounds/keystorkes.mp3",
  "/sounds/spacebar.mp3",
  "/sounds/typing/classic/key.mp3",
  "/sounds/typing/classic/space.mp3",
  "/sounds/typing/crisp/key.mp3",
  "/sounds/typing/crisp/space.mp3",
  "/sounds/typing/typewriter/key.mp3",
  "/sounds/typing/typewriter/space.mp3",
  "/sounds/typing/soft/key.mp3",
  "/sounds/typing/soft/space.mp3",
  "/sounds/ambient/rain.mp3",
  "/sounds/ambient/cafe.mp3",
  "/sounds/ambient/library.mp3",
  "/sounds/ambient/night.mp3",
  "/sounds/ambient/forest.mp3",
  "/sounds/ambient/lofi-room.mp3",
  "/icons/ambient/mode.svg",
  "/icons/ambient/rain.svg",
  "/icons/ambient/cafe.svg",
  "/icons/ambient/library.svg",
  "/icons/ambient/night.svg",
  "/icons/ambient/forest.svg",
  "/icons/ambient/lofi-room.svg",
  "/backgrounds/1.jpg",
  "/backgrounds/2.jpg",
  "/backgrounds/3.jpg",
  "/backgrounds/4.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/favicon/") ||
    url.pathname.startsWith("/logo/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/sounds/") ||
    url.pathname.startsWith("/videos/") ||
    url.pathname.startsWith("/backgrounds/") ||
    url.pathname === "/manifest.json"
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cachedPage) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.ok && response.type === "basic") {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cachedPage || caches.match("/offline.html"));

        return cachedPage || networkFetch;
      })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.ok && response.type === "basic") {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
