const CACHE_NAME = "scorefootball v1";
const urlsToCache = [
   "/",
   "/index.html",
   "/manifest.json",
   "/css/style.css",
   "/css/materialize.min.css",
   "/images/logo192x192.png",
   "/images/logo512x512.png",
   "/images/logo180x180.png",
   "/images/logo310x310.png",
   "/images/logo150x150.png",
   "/images/logo70x70.png",
   "/images/icons/in.png",
   "/images/icons/ln.png",
   "/images/favicon-32x32.png",
   "/images/favicon-180x180.png",
   "/images/ab_me/ab2.jpg",
   "/images/ab_me/ab3.jpg",
   "/images/ab_me/ab4.jpg",
   "/images/news/picture1.jpg",
   "/images/news/picture2.jpg",
   "/images/news/picture3.jpg",
   "/images/news/picture4.jpg",
   "/js/main.js",
   "/js/match.js",
   "/js/materialize.min.js",
   "/js/registration.js",
   "/js/data/api.js",
   "/js/data/idb.js",
   "/js/data/db.js",
   "/pages/favorites.html",
   "/pages/home.html",
   "/pages/match.html",
   "/pages/nav.html",
   "/pages/standings.html",
   "/pages/aboutme.html",
   "/pages/news.html",
   "https://fonts.googleapis.com/icon?family=Material+Icons",
   "https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

self.addEventListener("install", function(event) {
   event.waitUntil(
      caches.open(CACHE_NAME)
      .then(cache => {
         console.log(`${CACHE_NAME} berhasil terinstal`);
         return cache.addAll(urlsToCache);
      })
   );
});

self.addEventListener("fetch", event => {
   const base_url = 'https://api.football-data.org/v2';

   if(event.request.url.indexOf(base_url) > -1){
      event.respondWith(
         caches.open(CACHE_NAME)
         .then(cache => {
            return fetch(event.request)
            .then(response => {
               cache.put(event.request.url, response.clone());
               return response;
            })
         })
      );
   } else {
      event.respondWith(
         caches.match(event.request, {ignoreSearch: true})
         .then(response => {
            return response || fetch(event.request);
         })
      );
   }
});

self.addEventListener("fetch", event => {
   console.log(`Memproses request...`);
   event.respondWith(
      caches
      .match(event.request, {cacheName: CACHE_NAME})
      .then(response => {
         if(response){
            console.log(`ServiceWorker: Gunakan dari cache: ${response.url}`);
            return response;
         }

         console.log(`ServiceWorker: Memuat aset dari server: ${event.request.url}`);
         return fetch(event.request);
      })
   );
});


self.addEventListener("activate", event => {
   event.waitUntil(
      caches.keys()
      .then(cacheNames => {
         return Promise.all(
            cacheNames.map(cacheName => {
               if(cacheName != CACHE_NAME){
                  console.log(`ServiceWorker: cache ${cacheName} dihapus.`);
                  return caches.delete(cacheName);
               }
            })
         );
      })
   );
});

self.addEventListener('push', event => {
   let body;
   if(event.data){
      body = event.data.text();
   } else {
      body = 'Push message no Payload';
   }

   const options = {
      body: body,
      vibrate: [100, 50, 100],
      data: {
         dataOfArival: Date.now(),
         primaryKey: 1
      }
   };

   event.waitUntil(
      self.registration.showNotification('Push Notifitacion', options)
   );
});