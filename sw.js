const CACHE = "echoreport-v6-2-1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        cache.addAll([
          "./",
          "./index.html",
          "./manifest.json"
        ])
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/*
  Pour les pages HTML :
  priorité au réseau afin d'éviter
  de rester bloqué sur une ancienne version.
*/
self.addEventListener("fetch", event => {

  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE)
            .then(cache =>
              cache.put("./index.html", copy)
            );

          return response;
        })
        .catch(() =>
          caches.match("./index.html")
        )
    );

    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response =>
        response || fetch(event.request)
      )
  );
});
