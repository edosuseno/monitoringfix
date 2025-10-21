// Service Worker minimalis - hanya supaya bisa Add to Home Screen
self.addEventListener("install", event => {
  console.log("🧩 SW installed (no cache)");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("⚡ SW activated (no cache)");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Tidak intercept apapun, biar realtime tetap jalan
});
