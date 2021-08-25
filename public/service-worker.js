const FILES_TO_CATCH = [
    '/',
    '/index.html',
    '/manifest.json',
    '/animaldb.js',
    '/index.js',
    '/style.css',
    '/icons/icon-512x512.png',
    "/icons/icon_192x192.png",
    "/icons/icon_128x128.png",
    "/icons/icon_96x96.png",
    "/icons/icon_72x72.png"
];

const CACHE_NAME = 'AnimalBudget';
const VERSION = "aBud_v01"

//INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, VERSION];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(VERSION).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });