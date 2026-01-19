/* =============================================
   ECHO_OFF PWA - SERVICE WORKER
   Version: 2.9.0 - Security & Simplicity
   Purpose: Enable offline functionality and PWA installation
   ============================================= */

const CACHE_NAME = 'echo-off-v2.9.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-app.png'
];

/* =============================================
   INSTALL EVENT - Cache Assets
   ============================================= */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install event - Version:', CACHE_NAME);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] All assets cached');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

/* =============================================
   ACTIVATE EVENT - Clean Old Caches
   ============================================= */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate event');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim(); // Take control immediately
        })
    );
});

/* =============================================
   FETCH EVENT - Serve from Cache, Fallback to Network
   ============================================= */
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip PeerJS server requests and external CDNs
    const url = new URL(event.request.url);
    if (
        url.hostname.includes('peerjs') ||
        url.hostname.includes('unpkg.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('gstatic.com')
    ) {
        // Let these requests go directly to network
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Cache the fetched response for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch failed:', error);
                        
                        // If offline and HTML request, could return a custom offline page
                        if (event.request.headers.get('accept').includes('text/html')) {
                            // Return cached index.html as fallback
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

/* =============================================
   MESSAGE EVENT - Handle messages from clients
   ============================================= */
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('[Service Worker] Cache cleared');
            event.ports[0].postMessage({ success: true });
        });
    }
});

/* =============================================
   ZERO-TRACE PROTOCOL
   Note: Service Worker caches are automatically cleared when:
   - User clears browser data
   - Cache is updated with new version
   - Browser storage quota is exceeded
   ============================================= */

console.log('[Service Worker] Shadow-Chat Service Worker loaded - Zero-trace protocol active');
