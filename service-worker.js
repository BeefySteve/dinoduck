const BASE = "/dinoduck/";
const CACHE_NAME = "dinoduck-v4";
const urlsToCache = [
  BASE,
  BASE + "index.html",
  BASE + "style.css",
  BASE + "main.js",
  BASE + "games/maths.js",
  BASE + "games/letters.js",
  BASE + "games/counting.js",
  BASE + "games/dinosaur2.js",
  BASE + "games/dinosaur3.js",
  BASE + "games/duckduckduck.js",
  BASE + "manifest.json",
  BASE + "icon-192.png",
  BASE + "icon-512.png"
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