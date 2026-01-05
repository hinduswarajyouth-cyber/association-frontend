/* =========================
   🔄 FORCE UPDATE HANDLER
========================= */
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* =========================
   📦 CACHE CONFIG
========================= */
const CACHE_NAME = "association-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
];

/* =========================
   📥 INSTALL
========================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(URLS_TO_CACHE)
    )
  );
});

/* =========================
   🌐 FETCH
========================= */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
