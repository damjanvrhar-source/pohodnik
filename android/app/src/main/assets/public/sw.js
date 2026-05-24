const CACHE_NAME = 'pohodnik-tiles-v1'
const MAX_TILES = 2000

// Instaliraj service worker
self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim())
})

// Interceptiraj zahteve za tile-e
self.addEventListener('fetch', e => {
  const url = e.request.url

  // Cachiraj samo map tile-e
  if (
    url.includes('basemaps.cartocdn.com') ||
    url.includes('tile.openstreetmap.org') ||
    url.includes('arcgisonline.com')
  ) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(e.request)
        if (cached) return cached

        try {
          const response = await fetch(e.request)
          if (response.ok) {
            // Preveri velikost cache-a
            const keys = await cache.keys()
            if (keys.length > MAX_TILES) {
              // Odstrani najstarejše tile-e
              await cache.delete(keys[0])
            }
            cache.put(e.request, response.clone())
          }
          return response
        } catch {
          // Offline — vrni cached verzijo ali prazno
          return cached || new Response('', { status: 503 })
        }
      })
    )
  }
})

// Poslušaj sporočila za prenos območja
self.addEventListener('message', async e => {
  if (e.data.tip === 'prenesi-obmocje') {
    const { tiles } = e.data
    const cache = await caches.open(CACHE_NAME)
    let preneseno = 0

    for (const url of tiles) {
      try {
        const cached = await cache.match(url)
        if (!cached) {
          const resp = await fetch(url)
          if (resp.ok) {
            await cache.put(url, resp)
            preneseno++
          }
        } else {
          preneseno++
        }
        // Pošlji napredek
        self.clients.matchAll().then(clients => {
          clients.forEach(c => c.postMessage({
            tip: 'napredek',
            preneseno,
            skupaj: tiles.length
          }))
        })
      } catch {}
    }

    self.clients.matchAll().then(clients => {
      clients.forEach(c => c.postMessage({ tip: 'koncano', preneseno }))
    })
  }

  if (e.data.tip === 'izbrisi-cache') {
    await caches.delete(CACHE_NAME)
    self.clients.matchAll().then(clients => {
      clients.forEach(c => c.postMessage({ tip: 'cache-izbrisan' }))
    })
  }
})
