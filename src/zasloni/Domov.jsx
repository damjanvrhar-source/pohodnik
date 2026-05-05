import React, { useState, useEffect } from 'react'

const poti = [
  { ikona: '⛰️', ime: 'Triglav — standardna pot', tezavnost: 'tezka', oznaka: 'Zahtevna', km: 18, vzpon: 1700, cas: '7–9 ur' },
  { ikona: '🌲', ime: 'Velika planina', tezavnost: 'lahka', oznaka: 'Lahka', km: 6, vzpon: 380, cas: '2–3 ure' },
  { ikona: '🏔️', ime: 'Stol — Karavanke', tezavnost: 'srednja', oznaka: 'Srednja', km: 12, vzpon: 850, cas: '4–5 ur' },
  { ikona: '🗻', ime: 'Mangart', tezavnost: 'tezka', oznaka: 'Zahtevna', km: 14, vzpon: 1200, cas: '5–7 ur' },
  { ikona: '🌄', ime: 'Šmarna gora', tezavnost: 'lahka', oznaka: 'Lahka', km: 4, vzpon: 250, cas: '1–2 uri' },
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

export default function Domov() {
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

      {/* Vremenski widget — manjši */}
      <div style={{
        background: 'linear-gradient(135deg, #1F5C1F 0%, #2D7A2D 60%, #3A9A3A 100%)',
        borderRadius: 14, padding: '12px 16px', marginBottom: 14, color: 'white',
        boxShadow: '0 4px 12px rgba(45,122,45,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {nalaganje ? (
          <div style={{ opacity: 0.7, fontSize: 13 }}>🌤 Nalagam vreme...</div>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>📍 {vreme?.kraj}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '2px 0' }}>
                <div style={{ fontSize: 30, fontWeight: 300 }}>{vreme?.temp}°C</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>{vreme?.opis}</div>
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                💧 {vreme?.vlaga}% · 💨 {vreme?.veter} km/h
              </div>
            </div>
            <div style={{ fontSize: 40 }}>{vremeIkona(vreme?.koda)}</div>
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

      {/* Priporočene poti — večje kartice */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--besedilo2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
        Priporočene poti
      </div>

      {poti.map((p, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: 12, padding: '14px 16px',
          marginBottom: 10, border: '0.5px solid var(--rob)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, background: 'var(--zelena-sv)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
            boxShadow: '0 2px 6px rgba(45,122,45,0.15)',
          }}>{p.ikona}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
              {p.ime}
              <span className={`tezavnost ${p.tezavnost}`}>{p.oznaka}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>
              {p.km} km · ↑{p.vzpon} m · ⏱ {p.cas}
            </div>
          </div>
          <div style={{ color: 'var(--zelena)', fontSize: 18 }}>›</div>
        </div>
      ))}

    </div>
  )
}
