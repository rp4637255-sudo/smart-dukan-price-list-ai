const CACHE_NAME = "aparna-smart-ai-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("aparna-smart-ai-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );

  if (["document", "script", "style", "image"].includes(request.destination)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache =>
        fetch(request).then(response => {
          if (response.ok) cache.put(request, response.clone());
        }).catch(() => {})
      )
    );
  }
});
