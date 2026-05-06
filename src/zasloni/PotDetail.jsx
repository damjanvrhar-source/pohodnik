import React from 'react'

function izracunajCas(km, vzpon) {
  const ure = (parseFloat(km) / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

// Izhodišča za vsako pot
const IZHODISCA = {
  1: [ // Triglav standardna
    { ime: 'Mojstrana — Aljažev dom', opis: 'Najpogostejša pot. Parkirišče pri Aljaževem domu v Vratih.', km: '18', vzpon: 1700, lat: 46.4167, lon: 13.8500, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Bohinj — Savica', opis: 'Najdaljša pot skozi Triglavska jezera. Parkirišče pri Savici.', km: '22', vzpon: 2000, lat: 46.2833, lon: 13.8667, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Trenta — Soška dolina', opis: 'Zahtevna pot iz Trente. Parkirišče v Trenti.', km: '20', vzpon: 1900, lat: 46.3833, lon: 13.6667, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Kranjska Gora — Vrata', opis: 'Klasična pot skozi dolino Vrata.', km: '19', vzpon: 1800, lat: 46.4833, lon: 13.9167, tezavnost: 'demanding_mountain_hiking' },
  ],
  2: [ // Triglav Bambergova
    { ime: 'Mojstrana — Aljažev dom', opis: 'Bambergova pot — zahtevna alpinska pot.', km: '20', vzpon: 1800, lat: 46.4167, lon: 13.8500, tezavnost: 'demanding_mountain_hiking' },
  ],
  3: [ // Mangart
    { ime: 'Sedlo Mangart', opis: 'Najkrajša pot. Parkirišče na sedlu Mangart (cesta zaračunana).', km: '3', vzpon: 400, lat: 46.4333, lon: 13.6333, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Log pod Mangartom', opis: 'Daljša pot iz doline. Parkirišče v Logu.', km: '14', vzpon: 1200, lat: 46.3833, lon: 13.6000, tezavnost: 'demanding_mountain_hiking' },
  ],
  21: [ // Velika planina
    { ime: 'Kamnik — Preskar', opis: 'Peš pot iz Kamnika. Parkirišče pri Preskarju.', km: '6', vzpon: 800, lat: 46.2167, lon: 14.6167, tezavnost: 'hiking' },
    { ime: 'Gondola — Velika planina', opis: 'Z gondolo navzgor, kratek sprehod po planini.', km: '3', vzpon: 100, lat: 46.3000, lon: 14.6167, tezavnost: 'hiking' },
  ],
  41: [ // Stol
    { ime: 'Zelenica', opis: 'Najpogostejša pot. Parkirišče na Zelenici.', km: '5', vzpon: 600, lat: 46.4500, lon: 14.0833, tezavnost: 'mountain_hiking' },
    { ime: 'Jesenice', opis: 'Daljša pot iz Jesenic.', km: '12', vzpon: 1050, lat: 46.4333, lon: 14.0500, tezavnost: 'mountain_hiking' },
  ],
  42: [ // Golica
    { ime: 'Planina pod Golico', opis: 'Klasična pot. Parkirišče na Planini pod Golico.', km: '4', vzpon: 500, lat: 46.4500, lon: 14.0167, tezavnost: 'mountain_hiking' },
    { ime: 'Jesenice — Koroška Bela', opis: 'Daljša pot iz Jesenic.', km: '10', vzpon: 900, lat: 46.4333, lon: 14.0333, tezavnost: 'mountain_hiking' },
  ],
  56: [ // Goška ravan
    { ime: 'Kropa', opis: 'Parkirišče v Kropi, pot skozi gozd.', km: '8', vzpon: 440, lat: 46.2917, lon: 14.2000, tezavnost: 'hiking' },
    { ime: 'Kamna Gorica', opis: 'Parkirišče v Kamni Gorici.', km: '7', vzpon: 380, lat: 46.2833, lon: 14.2167, tezavnost: 'hiking' },
  ],
  60: [ // Šmarna gora
    { ime: 'Tacen', opis: 'Najpogostejša pot. Parkirišče pri Tacnu.', km: '4', vzpon: 250, lat: 46.1000, lon: 14.4333, tezavnost: 'hiking' },
    { ime: 'Vikrče', opis: 'Pot iz Vikrč — malo daljša.', km: '5', vzpon: 300, lat: 46.1333, lon: 14.3833, tezavnost: 'hiking' },
  ],
}

function tezavnostBadge(t) {
  if (!t) return null
  const s = t.toLowerCase()
  if (s.includes('demanding')) return { razred: 'tezka', ime: 'Zahtevna' }
  if (s.includes('mountain')) return { razred: 'srednja', ime: 'Srednja' }
  return { razred: 'lahka', ime: 'Lahka' }
}

export default function PotDetail({ pot, onIzberiIzhodisce, onNazaj }) {
  const izhodisca = IZHODISCA[pot.id] || [
    {
      ime: pot.ime,
      opis: 'Standardno izhodišče.',
      km: pot.dolzina,
      vzpon: pot.vzpon,
      lat: pot.lat,
      lon: pot.lon,
      tezavnost: pot.tezavnost,
    }
  ]

  return (
    <div style={{ padding: 16 }}>

      {/* Nazaj gumb */}
      <button onClick={onNazaj} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--zelena)', fontSize: 14, fontWeight: 600,
        padding: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 6
      }}>
        🏠 Domov
      </button>

      {/* Naslov poti */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{pot.ime}</div>
        <div style={{ fontSize: 14, color: 'var(--besedilo2)', marginTop: 4 }}>{pot.regija}</div>
      </div>

      {/* Izhodišča */}
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--besedilo2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
        Izberi izhodišče
      </div>

      {izhodisca.map((iz, i) => {
        const badge = tezavnostBadge(iz.tezavnost)
        const cas = izracunajCas(iz.km, iz.vzpon)
        return (
          <div key={i} style={{
            background: 'white', borderRadius: 12, padding: 14,
            marginBottom: 10, border: '0.5px solid var(--rob)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                📍 {iz.ime}
              </div>
              {badge && <span className={`tezavnost ${badge.razred}`}>{badge.ime}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginBottom: 8 }}>
              {iz.opis}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>📏 {iz.km} km</div>
              <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>↑ {iz.vzpon} m</div>
              <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>⏱ {cas}</div>
            </div>
            <button
              onClick={() => onIzberiIzhodisce({ ...pot, ...iz })}
              style={{
                width: '100%', background: 'var(--modra)', color: 'white',
                border: 'none', borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}>
              🥾 Začni pohod od tukaj
            </button>
          </div>
        )
      })}
    </div>
  )
}
