// Service worker: prima la rete (gli aggiornamenti arrivano subito), copia di riserva per aprire l'app anche senza campo.
const C='dw-app-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const q=e.request,u=new URL(q.url);
 if(q.method!=='GET'||u.origin!==self.location.origin)return;
 e.respondWith(fetch(q).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(C).then(x=>x.put(q,c)).catch(()=>{})}return r})
  .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match('./index.html')||caches.match('./'))))});
