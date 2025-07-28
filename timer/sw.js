self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("timer-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./android-chrome-512x512.png",
        "./android-chrome-192x192.png",
        "./manifest.json",
        "./sw.js"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
