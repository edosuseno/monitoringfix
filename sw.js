self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('aepro-cache-v1').then(function(cache) {
      return cache.addAll([
        '/monitoring/aeproplts.html',
        '/monitoring/manifest.json',
        '/monitoring/icon-192.png',
        '/monitoring/icon-512.png'
        // tambah file lain yang penting (CSS, JS, asset) jika kamu mau
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
