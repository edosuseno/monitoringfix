// Nama cache (ganti versinya kalau update file baru)
const CACHE_NAME = "aepro-cache-v1";

// Daftar file yang akan disimpan di cache
const urlsToCache = [
  "/monitorplts/aeproplts.html",
  "/monitorplts/manifest.json",
  "/monitorplts/icon-192.png",
  "/monitorplts/icon-512.png"
  // tambahkan file JS, CSS, atau gambar lain kalau perlu
];

// Proses instalasi service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Service Worker: caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivasi — hapus cache lama kalau ada versi baru
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch — ambil dari cache dulu, kalau tidak ada baru dari network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
