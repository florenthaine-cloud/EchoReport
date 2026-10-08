const CACHE = "echoreport-v6-4-0";

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE)

      .then(cache => {

        return cache.addAll([
          "./",
          "./index.html",
          "./manifest.json",
          "./apple-touch-icon.png"
        ]);

      })

      .then(() => self.skipWaiting())

  );

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()

      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))

        );

      })

      .then(() => self.clients.claim())

  );

});


self.addEventListener("fetch", event => {

  if(event.request.mode === "navigate"){

    event.respondWith(

      fetch(event.request)

        .then(response => {

          const copy =
            response.clone();

          caches.open(CACHE)
            .then(cache => {

              cache.put(
                "./index.html",
                copy
              );

            });

          return response;

        })

        .catch(() => {

          return caches.match(
            "./index.html"
          );

        })

    );

    return;
  }


  event.respondWith(

    caches.match(event.request)

      .then(response => {

        return response ||
               fetch(event.request);

      })

  );

});
