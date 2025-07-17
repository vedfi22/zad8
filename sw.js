const CACHE_NAME = 'it-project-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/todo.html',
  '/css/style.css',
  '/js/todo.js',
  '/images/web_tech.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});