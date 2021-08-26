const FILES_TO_CACHE = [
    './',
    '/index.html',
    '/manifest.json',
    '/animaldb.js',
    '/index.js',
    '/styles.css',
    '/icons/icon-512x512.png',
    "/icons/icon-192x192.png",
    "/icons/icon-128x128.png",
    "/icons/icon-96x96.png",
    "/icons/icon-72x72.png"
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
    
      caches
        .keys()
        .then(keyList => {
          return Promise.all(keyList.map( key => {
            if (key !== CACHE_NAME && key !== VERSION) {
              return caches.delete(key);
            }
          }));
        })
        .then(() => self.clients.claim())
      }
  )

  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(VERSION).then(cache => {
          return fetch(event.request).then(res => {
          if (res.status === 200) {
            cache.put(event.request.url, res.clone())
            return res;
          }})

          .catch(error => {return cache.match(event.request)});
        })

        .catch(error => console.log(error))
      
      );
        
          return 
        };

        event.respondWith(
        caches.match(event.request).then(function(res) {
        return res || fetch(event.request);
      })
    );

  });
