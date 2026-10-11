// Diamondweb Leads · service worker
// 1) l'app si apre anche senza rete: con la rete prende sempre la versione più aggiornata di index.html, senza rete usa l'ultima copia salvata
// 2) «Condividi → DW Leads»: riceve il file di Keyword Planner e lo passa all'app (index.html?kp=1)
// I dati restano nel telefono come sempre: qui si salvano solo l'app, i font e il file condiviso.
const C='dw-shell-v2',KEEP=[C,'dw-share'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>!KEEP.includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method==='POST'&&u.origin===self.location.origin&&/\/share-kp$/.test(u.pathname)){
  e.respondWith((async()=>{try{const f=await r.formData(),file=f.get('file'),tx=f.get('text')||f.get('title')||'',c=await caches.open('dw-share');
   if(file&&file.size)await c.put('./shared-kp',new Response(file));else if(tx)await c.put('./shared-kp',new Response(new Blob([tx],{type:'text/plain'})))}catch(err){}
   return Response.redirect(new URL('./index.html?kp=1',self.registration.scope).href,303)})());return}
 if(r.method!=='GET')return;
 if(u.origin===self.location.origin){const nav=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname),key='./index.html';
  const net=nav?fetch(u.origin+u.pathname,{cache:'no-cache',credentials:'same-origin'}):fetch(r);
  e.respondWith(net.then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(nav?key:r,cp)).catch(()=>{})}return res})
   .catch(()=>caches.match(nav?key:r,{ignoreSearch:true}).then(m=>m||caches.match(key)).then(m=>m||Response.error())));return}
 if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res})));
});
