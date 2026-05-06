import React, { useState, useEffect } from 'react'

const FILTRI = ['Vse', 'Lahka', 'Srednja', 'Zahtevna']

function tezavnostBadge(t) {
  if (!t) return null
  const s = t.toLowerCase()
  if (s.includes('demanding') || s.includes('zahtev') || s.includes('alpine')) return { razred: 'tezka', ime: 'Zahtevna' }
  if (s.includes('mountain') || s.includes('srednja')) return { razred: 'srednja', ime: 'Srednja' }
  if (s.includes('hiking') || s.includes('lahk')) return { razred: 'lahka', ime: 'Lahka' }
  return null
}

function izracunajCas(km, vzpon) {
  const ure = (parseFloat(km) / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

const BAZA_POTI = [
  { id: 1,  ime: 'Triglav — standardna pot', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '18', vzpon: 1700, lat: 46.3792, lon: 13.8367 },
  { id: 2,  ime: 'Triglav — Bambergova pot', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '20', vzpon: 1800, lat: 46.3792, lon: 13.8367 },
  { id: 3,  ime: 'Mangart', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1200, lat: 46.4333, lon: 13.6500 },
  { id: 4,  ime: 'Jalovec', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.4167, lon: 13.7000 },
  { id: 5,  ime: 'Razor', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1400, lat: 46.3833, lon: 13.8167 },
  { id: 6,  ime: 'Škrlatica', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '17', vzpon: 1600, lat: 46.3833, lon: 13.8667 },
  { id: 7,  ime: 'Prisojnik', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1300, lat: 46.3833, lon: 13.8500 },
  { id: 8,  ime: 'Špik', regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 13.8000 },
  { id: 9,  ime: 'Kanjavec', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '13', vzpon: 1000, lat: 46.3500, lon: 13.8167 },
  { id: 10, ime: 'Bogatin', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 900, lat: 46.2833, lon: 13.8333 },
  { id: 11, ime: 'Krn', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.2333, lon: 13.7167 },
  { id: 12, ime: 'Matajur', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 850, lat: 46.1833, lon: 13.5833 },
  { id: 13, ime: 'Rombon', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '9', vzpon: 800, lat: 46.3167, lon: 13.5667 },
  { id: 14, ime: 'Polovnik', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '8', vzpon: 700, lat: 46.1667, lon: 13.6333 },
  { id: 15, ime: 'Slemenova špica', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '7', vzpon: 600, lat: 46.4000, lon: 13.9000 },
  { id: 16, ime: 'Vodnikov dom — Triglav', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 900, lat: 46.3667, lon: 13.8500 },
  { id: 17, ime: 'Soška pot', regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '25', vzpon: 300, lat: 46.2500, lon: 13.6833 },
  { id: 18, ime: 'Dolina Triglavskih jezer', regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '20', vzpon: 1000, lat: 46.3333, lon: 13.8000 },
  { id: 19, ime: 'Bohinjsko jezero — Savica', regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '6', vzpon: 200, lat: 46.2833, lon: 13.8667 },
  { id: 20, ime: 'Vogel', regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '5', vzpon: 350, lat: 46.2667, lon: 13.8333 },
  { id: 21, ime: 'Velika planina', regija: 'Kamniške Alpe', tezavnost: 'hiking', dolzina: '6', vzpon: 380, lat: 46.3167, lon: 14.6333 },
  { id: 22, ime: 'Grintovec', regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3667, lon: 14.5333 },
  { id: 23, ime: 'Kočna', regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1400, lat: 46.3833, lon: 14.5167 },
  { id: 24, ime: 'Skuta', regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1600, lat: 46.3500, lon: 14.5500 },
  { id: 25, ime: 'Ojstrica', regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1200, lat: 46.3333, lon: 14.5667 },
  { id: 26, ime: 'Planjava', regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1000, lat: 46.3167, lon: 14.5833 },
  { id: 27, ime: 'Brana', regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 950, lat: 46.3333, lon: 14.5333 },
  { id: 28, ime: 'Turska gora', regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1050, lat: 46.3500, lon: 14.5167 },
  { id: 29, ime: 'Kamniško sedlo', regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '9', vzpon: 850, lat: 46.3667, lon: 14.5667 },
  { id: 30, ime: 'Storžič', regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4000, lon: 14.4667 },
  { id: 31, ime: 'Logarska dolina', regija: 'Kamniške Alpe', tezavnost: 'hiking', dolzina: '8', vzpon: 250, lat: 46.3833, lon: 14.6333 },
  { id: 32, ime: 'Okrešelj', regija: 'Kamniške Alpe', tezavnost: 'hiking', dolzina: '7', vzpon: 400, lat: 46.3500, lon: 14.5833 },
  { id: 33, ime: 'Krvavec', regija: 'Kamniške Alpe', tezavnost: 'hiking', dolzina: '5', vzpon: 300, lat: 46.3000, lon: 14.5333 },
  { id: 34, ime: 'Menina planina', regija: 'Kamniške Alpe', tezavnost: 'hiking', dolzina: '9', vzpon: 500, lat: 46.2500, lon: 14.7833 },
  { id: 35, ime: 'Stol', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1050, lat: 46.4833, lon: 14.1167 },
  { id: 36, ime: 'Golica', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 900, lat: 46.4667, lon: 14.0333 },
  { id: 37, ime: 'Begunjščica', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1000, lat: 46.4333, lon: 14.2167 },
  { id: 38, ime: 'Košuta', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '13', vzpon: 1100, lat: 46.4500, lon: 14.3333 },
  { id: 39, ime: 'Kepa', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '9', vzpon: 800, lat: 46.5000, lon: 13.9500 },
  { id: 40, ime: 'Uršlja gora', regija: 'Karavanke', tezavnost: 'hiking', dolzina: '8', vzpon: 550, lat: 46.5167, lon: 14.7833 },
  { id: 41, ime: 'Peca', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 950, lat: 46.5000, lon: 14.8833 },
  { id: 42, ime: 'Raduha', regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1000, lat: 46.4167, lon: 14.7333 },
  { id: 43, ime: 'Jezerska Kočna', regija: 'Karavanke', tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1300, lat: 46.4167, lon: 14.5000 },
  { id: 44, ime: 'Goška ravan', regija: 'Škofjeloško hribovje', tezavnost: 'hiking', dolzina: '8', vzpon: 440, lat: 46.3166, lon: 14.1328 },
  { id: 45, ime: 'Ratitovec', regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 850, lat: 46.2333, lon: 14.0667 },
  { id: 46, ime: 'Blegoš', regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking', dolzina: '9', vzpon: 700, lat: 46.1833, lon: 14.0167 },
  { id: 47, ime: 'Šmarna gora', regija: 'Posavsko hribovje', tezavnost: 'hiking', dolzina: '4', vzpon: 250, lat: 46.1872, lon: 14.4630 },
  { id: 48, ime: 'Kum', regija: 'Posavsko hribovje', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 800, lat: 46.0833, lon: 15.0667 },
  { id: 49, ime: 'Nanos', regija: 'Primorska', tezavnost: 'hiking', dolzina: '7', vzpon: 450, lat: 45.7667, lon: 14.0333 },
  { id: 50, ime: 'Snežnik', regija: 'Primorska', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 900, lat: 45.5833, lon: 14.4500 },
  { id: 51, ime: 'Slavnik', regija: 'Primorska', tezavnost: 'hiking', dolzina: '8', vzpon: 500, lat: 45.5333, lon: 13.9667 },
  { id: 52, ime: 'Rogla', regija: 'Pohorje', tezavnost: 'hiking', dolzina: '6', vzpon: 300, lat: 46.4500, lon: 15.3333 },
]

export default function Iskanje({ onZacniPohod }) {
  const [iskanje, setIskanje] = useState('')
  const [filter, setFilter] = useState('Vse')
  const [poti, setPoti] = useState(BAZA_POTI)

  useEffect(() => {
    if (iskanje.length < 2) { setPoti(BAZA_POTI); return }
    const timer = setTimeout(() => {
      setPoti(BAZA_POTI.filter(p =>
        p.ime.toLowerCase().includes(iskanje.toLowerCase()) ||
        p.regija.toLowerCase().includes(iskanje.toLowerCase())
      ))
    }, 300)
    return () => clearTimeout(timer)
  }, [iskanje])

  const prikazanePoti = poti.filter(p => {
    if (filter === 'Vse') return true
    const badge = tezavnostBadge(p.tezavnost)
    return badge?.ime === filter
  })

  return (
    <div style={{ padding: 16 }}>

      {/* Iskalno polje */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', border: '0.5px solid var(--rob)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={iskanje}
          onChange={e => setIskanje(e.target.value)}
          placeholder="Išči pot, vrh, kočo..."
          style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, background: 'transparent', color: 'var(--besedilo)' }}
        />
        {iskanje && (
          <button onClick={() => setIskanje('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--besedilo2)', fontSize: 16, padding: 0 }}>✕</button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {FILTRI.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 20,
            border: '0.5px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: filter === f ? 'var(--zelena)' : 'white',
            color: filter === f ? 'white' : 'var(--besedilo2)',
            borderColor: filter === f ? 'var(--zelena)' : 'var(--rob)',
          }}>{f}</button>
        ))}
      </div>

      {/* Število */}
      <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginBottom: 10 }}>
        {prikazanePoti.length} poti · {BAZA_POTI.length} skupaj v bazi
      </div>

      {/* Seznam poti */}
      {prikazanePoti.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--besedilo2)' }}>
          Ni rezultatov za "{iskanje}"
        </div>
      )}

      {prikazanePoti.map((p, i) => {
        const badge = tezavnostBadge(p.tezavnost)
        const cas = izracunajCas(p.dolzina, p.vzpon)
        return (
          <div key={p.id || i} style={{
            background: 'white', borderRadius: 12, padding: '14px',
            marginBottom: 10, border: '0.5px solid var(--rob)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
          }}>
            {/* Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--zelena-sv)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>⛰️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {p.ime}
                  {badge && <span className={`tezavnost ${badge.razred}`}>{badge.ime}</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 3 }}>
                  {p.regija} · {p.dolzina} km · ↑{p.vzpon} m · ⏱ {cas}
                </div>
              </div>
            </div>

            {/* Gumb */}
            <button
              onClick={() => onZacniPohod(p)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
                color: 'white', border: 'none', borderRadius: 8,
                padding: '10px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', textAlign: 'center',
                boxShadow: '0 3px 10px rgba(45,122,45,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(45,122,45,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(45,122,45,0.4)' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              🥾 Začni pohod →
            </button>
          </div>
        )
      })}
    </div>
  )
}
