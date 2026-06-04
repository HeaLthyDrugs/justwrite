const CACHE_VERSION = "justwrite-v8";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const STATIC_ASSET_CACHE = `static-assets-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  "/",
  "/about",
  "/changelog",
  "/cookie-policy",
  "/disclaimer",
  "/privacy-policy",
  "/shortcuts",
  "/terms-of-service",
  "/offline.html",
  "/manifest.webmanifest",
];

const STATIC_ASSET_URLS = [
  "/favicon.ico",
  "/icon0.svg",
  "/icon1.png",
  "/apple-icon.png",
  "/logo/justwrite-logo.svg",
  "/logo/justwrite-logo-light.svg",
  "/logo/justwrite-logo-dark.svg",
  "/logo/justwrite-app-192.png",
  "/logo/justwrite-app-512.png",
  "/screenshots/justwrite-desktop-install.png",
  "/screenshots/justwrite-mobile-install.png",
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
  "/backgrounds/4.jpg",
];

async function precache() {
  const shellCache = await caches.open(APP_SHELL_CACHE);
  await shellCache.addAll(APP_SHELL_URLS);

  const staticCache = await caches.open(STATIC_ASSET_CACHE);
  await staticCache.addAll(STATIC_ASSET_URLS);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              ![APP_SHELL_CACHE, STATIC_ASSET_CACHE, RUNTIME_CACHE].includes(key)
          )
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

function isCacheFirstAsset(url, request) {
  const destination = request.destination;

  return (
    destination === "audio" ||
    destination === "image" ||
    url.pathname.startsWith("/logo/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/sounds/") ||
    url.pathname.startsWith("/backgrounds/") ||
    url.pathname.startsWith("/screenshots/") ||
    url.pathname === "/manifest.webmanifest"
  );
}

async function networkFirstPage(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await caches.match(request)) ||
      (await caches.match("/offline.html"))
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_ASSET_CACHE);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok && response.type === "basic") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (isCacheFirstAsset(url, request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
