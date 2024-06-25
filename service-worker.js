// service-worker.js
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
  '/',
  '/home-grocery.html',
  '/shop-catalog-grocery.html',
  '/shop-product-grocery.html',
  '/404-grocery.html',
  '/checkout-v2-cart.html',
  '/checkout-v2-delivery.html',
  '/checkout-v2-pickup.html',
  '/checkout-v2-thankyou.html',
  '/assets/css/theme.min.css',
  '/assets/js/theme-switcher.js',
  '/assets/vendor/swiper/swiper-bundle.min.css',
  '/assets/vendor/swiper/swiper-bundle.min.js',
  '/assets/js/theme.min.js'
  // Añade aquí más URLs de recursos que quieras cachear
];

self.addEventListener('install', (event) => {
  // Realiza la instalación: carga los archivos en la caché.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cachéados');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Limpia la caché antigua.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Caché antigua eliminada');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // La respuesta fue encontrada en la caché, así que la retornamos.
        if (response) {
          return response;
        }
        // No está en la caché, así que hacemos una petición a la red.
        return fetch(event.request);
      }
    )
  );
});


// Escucha para el evento push y muestra una notificación.
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación.',
    icon: 'icon.png', // Asegúrate de tener un icono en la carpeta pública.
    badge: 'badge.png' // Asegúrate de tener una insignia en la carpeta pública.
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Escucha para el evento de clic en la notificación.
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Cierra la notificación.
  // Maneja el clic en la notificación.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la respuesta está en la caché, la retornamos.
        if (response) {
          return response;
        }
        // Intentamos la petición a la red.
        return fetch(event.request).catch(() => {
          // Si falla la petición de red y el recurso no está en caché, mostramos la página 404.
          return caches.match('/404.html'); // Asegúrate de tener una página 404.html en tu caché.
        });
      })
  );
});