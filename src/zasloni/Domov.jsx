import React, { useState, useEffect } from 'react'

const poti = [
  { id: 1,  ikona: '⛰️', ime: 'Triglav — standardna pot', tezavnost: 'demanding_mountain_hiking', razred: 'tezka', oznaka: 'Zahtevna', dolzina: '18', vzpon: 1700, cas: '7–9 ur', regija: 'Julijske Alpe', lat: 46.3792, lon: 13.8367 },
  { id: 21, ikona: '🌲', ime: 'Velika planina',            tezavnost: 'hiking',                   razred: 'lahka', oznaka: 'Lahka',    dolzina: '6',  vzpon: 380,  cas: '2–3 ure', regija: 'Kamniške Alpe', lat: 46.3167, lon: 14.6333 },
  { id: 35, ikona: '🏔️', ime: 'Stol — Karavanke',          tezavnost: 'mountain_hiking',          razred: 'srednja', oznaka: 'Srednja', dolzina: '12', vzpon: 850, cas: '4–5 ur', regija: 'Karavanke', lat: 46.4833, lon: 14.1167 },
  { id: 3,  ikona: '🗻', ime: 'Mangart',                   tezavnost: 'demanding_mountain_hiking', razred: 'tezka', oznaka: 'Zahtevna', dolzina: '14', vzpon: 1200, cas: '5–7 ur', regija: 'Julijske Alpe', lat: 46.4333, lon: 13.6500 },
  { id: 47, ikona: '🌄', ime: 'Šmarna gora',               tezavnost: 'hiking',                   razred: 'lahka', oznaka: 'Lahka',    dolzina: '4',  vzpon: 250,  cas: '1–2 uri', regija: 'Posavsko hribovje', lat: 46.1872, lon: 14.4630 },
]

function vremeIkona(koda) {
  if (!koda) return '⛅'
  if (koda <= 1) return '☀️'
  if (koda <= 3) return '🌤'
  if (koda <= 5) return '☁️'
  if (koda <= 9) return '🌧'
  if (koda <= 12) return '⛈'
  if (koda <= 16) return '❄️'
  return '🌫'
}

function TezavnostPike({ razred }) {
  const barva = razred === 'tezka' ? '#991B1B' : razred === 'srednja' ? '#92400E' : '#065F46'
  const ozadje = razred === 'tezka' ? '#FEE2E2' : razred === 'srednja' ? '#FEF3C7' : '#D1FAE5'
  const filled = razred === 'tezka' ? 3 : razred === 'srednja' ? 2 : 1
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= filled ? barva : ozadje,
          border: `1px solid ${i <= filled ? barva : barva + '40'}`,
        }} />
      ))}
    </div>
  )
}

export default function Domov({ onOdpriPot }) {
  const [vreme, setVreme] = useState(null)
  const [nalaganje, setNalaganje] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => naloziVreme(pos.coords.latitude, pos.coords.longitude),
        () => naloziVreme(46.37, 13.84)
      )
    } else {
      naloziVreme(46.37, 13.84)
    }
  }, [])

  async function naloziVreme(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FBerlin`
      const r = await fetch(url)
      const data = await r.json()
      const c = data.current
      const opisi = {
        0: 'Jasno', 1: 'Pretežno jasno', 2: 'Delno oblačno', 3: 'Oblačno',
        45: 'Megla', 51: 'Rahel dež', 53: 'Zmeren dež', 61: 'Dež',
        71: 'Sneženje', 80: 'Plohe', 95: 'Nevihta',
      }
      let kraj = 'Moja lokacija'
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=sl`)
        const geoData = await geo.json()
        kraj = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Slovenija'
      } catch {}
      setVreme({
        kraj,
        temp: Math.round(c.temperature_2m),
        opis: opisi[c.weather_code] || 'Delno oblačno',
        vlaga: Math.round(c.relative_humidity_2m),
        veter: Math.round(c.wind_speed_10m),
        koda: c.weather_code,
        opozorilo: c.weather_code >= 95 ? '⚠️ Nevihte v bližini!' : null,
      })
    } catch {
      setVreme({ kraj: 'Slovenija', temp: '–', opis: 'Brez povezave', koda: 2 })
    } finally {
      setNalaganje(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>

      {/* Vremenski widget */}
      <div style={{
        background: 'linear-gradient(135deg, #174617 0%, #216b21 55%, #2f8f2f 100%)',
        borderRadius: 20, padding: '16px 18px', marginBottom: 16,
        color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {nalaganje ? (
          <div style={{ fontSize: 13, opacity: 0.85 }}>🌤 Nalagam vreme...</div>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>📍 {vreme?.kraj}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{vreme?.temp}°C</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{vreme?.opis}</div>
              </div>
              <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
                💧 {vreme?.vlaga}% · 💨 {vreme?.veter} km/h
              </div>
              {vreme?.opozorilo && (
                <div style={{ fontSize: 11, marginTop: 6, background: 'rgba(255,200,0,0.2)', borderRadius: 6, padding: '3px 8px', display: 'inline-block' }}>
                  {vreme.opozorilo}
                </div>
              )}
            </div>
            <div style={{ fontSize: 36 }}>{vremeIkona(vreme?.koda)}</div>
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid">
        <div className="stat" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="stat-st">0</div><div className="stat-ime">opravljene poti</div>
        </div>
        <div className="stat" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="stat-st">0 km</div><div className="stat-ime">skupna razdalja</div>
        </div>
        <div className="stat" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="stat-st">0 m</div><div className="stat-ime">skupni vzpon</div>
        </div>
        <div className="stat" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="stat-st">0</div><div className="stat-ime">pridobljene značke</div>
        </div>
      </div>

      {/* Naslov */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--besedilo2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
        Priporočene poti
      </div>

      {/* Kartice poti */}
      {poti.map((p, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: 14, padding: '13px 14px',
          marginBottom: 10, border: '0.5px solid var(--rob)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
        }}>
          {/* Zgornji del — ikona + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10, background: 'var(--zelena-sv)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>{p.ikona}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {p.ime}
                <span className={`tezavnost ${p.razred}`} style={{ marginLeft: 6 }}>{p.oznaka}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--besedilo2)' }}>
                {p.dolzina} km · ↑{p.vzpon} m · ⏱ {p.cas}
              </div>
            </div>
          </div>

          {/* Spodnji del — težavnost pike + gumb */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '0.5px solid var(--rob)', paddingTop: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--besedilo2)' }}>Težavnost</span>
              <TezavnostPike razred={p.razred} />
            </div>
            <button
              onClick={() => onOdpriPot && onOdpriPot(p)}
              style={{
                background: 'var(--zelena)', color: 'white',
                border: 'none', borderRadius: 8,
                padding: '7px 14px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Odpri pot
            </button>
          </div>
        </div>
      ))}

    </div>
  )
}
