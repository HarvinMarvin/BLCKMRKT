// Black Market: salva il gioco nel telefono per giocare anche senza internet.
// Ad ogni aggiornamento cambia VERSIONE: il telefono scarica il gioco nuovo la prima volta che è online.
const VERSIONE = 'bm-2026-11-24h';
const FILE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {   // la pagina del gioco: prima prova internet (per gli aggiornamenti), senza rete usa quella salvata
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(VERSIONE).then(x => x.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
