// Service worker: le pagine si scaricano SEMPRE fresche dalla rete (niente copie vecchie);
// la copia salvata serve solo per aprire l'app quando manca il campo.
const C='dw-app-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==C&&k!=='dw-share').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const q=e.request,u=new URL(q.url);
 // file condiviso da un'altra app (es. CSV di Keyword Planner) → lo passo all'app
 if(q.method==='POST'&&u.pathname.endsWith('/share-kp')){e.respondWith((async()=>{try{const f=await q.formData(),file=f.get('file'),txt=f.get('text');const c=await caches.open('dw-share');
  await c.put('./shared-kp',file&&file.size?new Response(file):new Response(txt||''))}catch(_){}return Response.redirect('./index.html?kp=1',303)})());return}
 if(q.method!=='GET'||u.origin!==self.location.origin)return;
 const page=q.mode==='navigate'||/\.html$|\/$/.test(u.pathname);
 e.respondWith(fetch(q,page?{cache:'no-store'}:{}).then(r=>{
   // salva solo pagine vere dell'app (mai il README o pagine d'errore)
   if(r&&r.ok&&(!page||/\/(index|calcolatore)\.html$|\/$/.test(u.pathname))){const c=r.clone();c.text&&page?c.text().then(t=>{if(/Diamondweb/.test(t))caches.open(C).then(x=>x.put(q,new Response(t,{headers:{'Content-Type':'text/html; charset=utf-8'}})))}):caches.open(C).then(x=>x.put(q,c))}
   return r})
  .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))))});
