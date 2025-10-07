// Service Worker with stale-while-revalidate and offline fallback

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `ai-tools-${CACHE_VERSION}`;
const OFFLINE_CACHE = `ai-tools-offline-${CACHE_VERSION}`;
const MAX_TOOLS_CACHE = 50;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('ai-tools-') && name !== CACHE_NAME && name !== OFFLINE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip dev server and chrome extensions
  if (url.hostname === 'localhost' || url.protocol === 'chrome-extension:') return;

  // API requests: stale-while-revalidate with timeout
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      staleWhileRevalidate(request, OFFLINE_CACHE, 10000) // 10s timeout
    );
    return;
  }

  // Static assets: cache first
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset)) || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|webp)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // HTML pages: network first with offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline.html');
          });
        })
    );
  }
});

// Stale-while-revalidate with timeout
async function staleWhileRevalidate(request, cacheName, timeout = 10000) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Race between cache and network with timeout
  const fetchPromise = Promise.race([
    fetch(request).then(async (response) => {
      if (response.ok) {
        // Limit cache size for tool data
        if (request.url.includes('ai_tools')) {
          const keys = await cache.keys();
          if (keys.length > MAX_TOOLS_CACHE) {
            await cache.delete(keys[0]);
          }
        }
        cache.put(request, response.clone());
      }
      return response;
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    ),
  ]);

  // Return cached immediately, update in background
  if (cached) {
    fetchPromise.catch(() => {}); // Silent background update
    return cached;
  }

  // No cache: wait for network or timeout
  try {
    return await fetchPromise;
  } catch {
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'AI Tools List';
  const options = {
    body: data.body || 'New AI tools available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.url || '/',
    tag: data.tag || 'default',
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
