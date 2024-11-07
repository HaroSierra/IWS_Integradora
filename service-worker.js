const CACHE_NAME = 'image-cache-v1';
const IMAGE_URLS = [
    '/public/exp1.svg', // Ruta de las imágenes que quieres cachear
    '/public/b5.svg',
    '/public/b1.svg'
];

// Precargar las imágenes cuando se instala el service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(IMAGE_URLS);
        })
    );
});

// Interceptar las solicitudes para buscar en el caché
self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Limpiar el caché obsoleto
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                .filter((cacheName) => cacheName !== CACHE_NAME)
                .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});