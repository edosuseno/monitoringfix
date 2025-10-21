// Cache version
const CACHE_NAME = "aepro-cache-v3";

// File yang akan dicache
const urlsToCache = [
  "/monitorplts/aeproplts.html",
  "/monitorplts/manifest.json",
  "/monitorplts/icon-192.png",
  "/monitorplts/icon-512.png"
];

// Install SW dan cache file
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Service Worker: caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate dan hapus cache lama
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: clearing old cache");
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Ambil dari cache dulu, baru fetch kalau belum ada
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
