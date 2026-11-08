// Network first, so updates arrive immediately; the cache is only the offline fallback.
// GIFs never change, so they are served from the cache first to save data at the gym.
const CACHE = 'academia-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const store = (request, response) => {
  if (response.ok) {
    const copy = response.clone();
    void caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  if (request.url.endsWith('.gif')) {
    event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request).then((response) => store(request, response))));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => store(request, response))
      .catch(() => caches.match(request).then((hit) => hit ?? caches.match(self.registration.scope))),
  );
});
