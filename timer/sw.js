self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("timer-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "../assets/susmit.png"
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
