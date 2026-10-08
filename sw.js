const CACHE = "echoreport-v6-3-0";

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE)
      .then(cache =>

        cache.addAll([
          "./",
          "./index.html",
          "./manifest.json",
          "./apple-touch-icon.png"
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


self.addEventListener("fetch", event => {


  /* Pour les pages HTML :
     priorité au réseau afin d'éviter
     les anciennes versions */

  if(event.request.mode === "navigate"){

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


  /* Pour les autres fichiers */

  event.respondWith(

    caches.match(event.request)
      .then(response =>
        response || fetch(event.request)
      )

  );

});
