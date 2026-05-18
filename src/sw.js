import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Workbox sustituye esto a la hora de hacer build por la lista real de ficheros.
precacheAndRoute(self.__WB_MANIFEST);

// Por ejemplo, cachear los ficheros .geojson, usando la estrategia StaleWhileRevalidate
registerRoute(({ url }) =>
     url.pathname.endsWith(".geojson"),
     new StaleWhileRevalidate({
        cacheName: "datos-app",
   })
)

// Registrar los tiles del mapa, usando CacheFirst, con fecha de expiración a los 7 días
registerRoute(({ url }) =>
    url.hostname.includes("cartocdn.com"),
    new CacheFirst({
      cacheName: "map-tiles",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
  })
);