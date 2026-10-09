// Service worker minimo: serve solo a installare l'app. Non salva nulla in cache, così ogni aggiornamento di index.html arriva subito.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request)));
