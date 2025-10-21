// ===============================
// AEProp Service Worker (v4)
// ===============================

const CACHE_NAME = "aepro-cache-v4";

// Daftar file yang akan dicache
const urlsToCache = [
  "/monitorplts/aeproplts.html",
  "/monitorplts/manifest.json",
  "/monitorplts/icon-192.png",
  "/monitorplts/icon-512.png"
  // Tambah file lain kalau perlu (CSS, JS, gambar, dll)
];

// Install service worker & cache file
self.addEventListener("install", event => {
  console.log("🛠 [SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log("📦 [SW] Safe caching files...");
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log("✅ Cached:", url);
        } catch (err) {
          console.warn("⚠️ Failed to cache:", url, err);
        }
      }
      self.skipWaiting();
    })
  );
});

// Activate service worker & hapus cache lama
self.addEventListener("activate", event => {
  console.log("⚡ [SW] Activated!");
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("🧹 [SW] Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim()) // langsung kendalikan semua tab
  );
});

// Intercept semua fetch request
self.addEventListener("fetch", event => {
  // Skip untuk request ke chrome-extension (biar nggak error di devtools)
  if (event.request.url.startsWith("chrome-extension")) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("✅ [SW] Serve from cache:", event.request.url);
        return response;
      }
      console.log("🌐 [SW] Fetch from network:", event.request.url);
      return fetch(event.request).then(networkResponse => {
        // Simpan salinan ke cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(err => {
        console.warn("🚫 [SW] Fetch failed:", err);
      });
    })
  );
});
