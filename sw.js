const CACHE = "echoreport-v7-0-0";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./apple-touch-icon.png"
];


/* =========================================================
   INSTALLATION
========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE)

        .then(
          cache =>
            cache.addAll(ASSETS)
        )

        .then(
          () =>
            self.skipWaiting()
        )

    );

  }
);


/* =========================================================
   ACTIVATION
========================================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()

        .then(
          keys =>

            Promise.all(

              keys

                .filter(
                  key =>
                    key !== CACHE
                )

                .map(
                  key =>
                    caches.delete(key)
                )

            )

        )

        .then(
          () =>
            self.clients.claim()
        )

    );

  }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  event => {

    /* Page principale */

    if(
      event.request.mode ===
      "navigate"
    ){

      event.respondWith(

        fetch(
          event.request
        )

        .then(
          response => {

            const copy =
              response.clone();


            caches
              .open(CACHE)

              .then(
                cache =>
                  cache.put(
                    "./index.html",
                    copy
                  )
              );


            return response;

          }
        )

        .catch(
          () =>
            caches.match(
              "./index.html"
            )
        )

      );

      return;

    }


    /* Autres fichiers */

    event.respondWith(

      caches
        .match(
          event.request
        )

        .then(
          response =>
            response ||
            fetch(
              event.request
            )
        )

    );

  }
);
