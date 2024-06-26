// service-worker.js
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
  '/',
  '/home-grocery.html',
  '/shop-catalog-grocery.html',
  '/shop-product-grocery.html',
  '/404-grocery.html',
  '/assets/img/404/grocery-bg-1.png',
  '/assets/img/404/grocery-bg-2.png',
  '/assets/img/404/grocery.png',
  '/checkout-v2-cart.html',
  '/checkout-v2-delivery.html',
  '/checkout-v2-pickup.html',
  '/checkout-v2-thankyou.html',
  '/assets/css/theme.min.css',
  '/assets/js/theme-switcher.js',
  '/assets/vendor/swiper/swiper-bundle.min.css',
  '/assets/vendor/swiper/swiper-bundle.min.js',
  '/assets/img/home/grocery/featured/01.png',
  '/assets/img/home/grocery/featured/02.png',
  '/assets/img/home/grocery/featured/03.png',
  '/assets/img/home/grocery/hero-slider/01.jpg',
  '/assets/img/home/grocery/hero-slider/02.jpg',
  '/assets/img/home/grocery/hero-slider/03.jpg',
  '/assets/img/home/grocery/recipes/01.jpg',
  '/assets/img/home/grocery/recipes/02.jpg',
  '/assets/img/home/grocery/recipes/03.jpg',
  '/assets/img/home/grocery/recipes/book-cover.jpg',
  '/assets/img/home/grocery/banner01.png',
  '/assets/img/home/grocery/banner02.png',
  '/assets/icons/cartzilla-icons.woff2',
  '/assets/icons/cartzilla-icons.min.css',
  '/assets/img/mega-menu/grocery/th01.png',
  '/assets/img/mega-menu/grocery/th02.png',
  '/assets/img/mega-menu/grocery/th03.png',
  '/assets/img/mega-menu/grocery/th04.png',
  '/assets/img/mega-menu/grocery/th05.png',
  '/assets/img/mega-menu/grocery/th06.png',
  '/assets/img/shop/grocery/categories/01.png',
  '/assets/img/shop/grocery/categories/02.png',
  '/assets/img/shop/grocery/categories/03.png',
  '/assets/img/shop/grocery/categories/04.png',
  '/assets/img/shop/grocery/categories/05.png',
  '/assets/img/shop/grocery/categories/06.png',
  '/assets/img/shop/grocery/categories/07.png',
  '/assets/img/shop/grocery/categories/08.png',
  '/assets/img/shop/grocery/categories/09.png',
  '/assets/img/shop/grocery/categories/10.png',
  '/assets/img/shop/grocery/categories/11.png',
  '/assets/js/theme.min.js'
];


// Instalación del Service Worker y caché de los recursos iniciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cachéados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
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

// Interceptación de solicitudes para manejar respuestas de la caché o de la red
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
          return caches.match('/404-grocery.html'); // Asegúrate de tener una página 404.html en tu caché.
        });
      })
  );
});

