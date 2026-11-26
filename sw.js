// BLCK MRKT: salva i giochi nel telefono per giocare anche senza internet.
// Ad ogni aggiornamento cambia VERSIONE: il telefono scarica i file nuovi la prima volta che è online.
const VERSIONE = 'bm-2026-11-26-nuovo';
const FILE = ['./', './index.html', './classico.html', './nuovo.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {   // le pagine: prima prova internet (per gli aggiornamenti), senza rete usa quella salvata
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(VERSIONE).then(x => x.put(r, c)); return res; })
      .catch(() => caches.match(r, { ignoreSearch:true }).then(m => m || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
