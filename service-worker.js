const CACHE_NAME = "dinoduck-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/games/maths.js",
  "/games/letters.js",
  "/games/counting.js",
  "/games/dinosaur2.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
}); 