const cacheName = "watermark"; // cache名, 在控制台Application的CaChe下可以看到

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(["/", "/index.html", "/manifest.json"]);
    }),
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", event => {
  event.respondWith(
    caches
      .open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      }),
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})