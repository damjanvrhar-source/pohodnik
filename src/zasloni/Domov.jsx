import React, { useState, useEffect } from 'react'

const poti = [
  { ikona: '⛰️', ime: 'Triglav — standardna pot', tezavnost: 'tezka', oznaka: 'Zahtevna', km: 18, vzpon: 1700, cas: '7–9 ur' },
  { ikona: '🌲', ime: 'Velika planina', tezavnost: 'lahka', oznaka: 'Lahka', km: 6, vzpon: 380, cas: '2–3 ure' },
  { ikona: '🏔️', ime: 'Stol — Karavanke', tezavnost: 'srednja', oznaka: 'Srednja', km: 12, vzpon: 850, cas: '4–5 ur' },
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
      // Open-Meteo — brezplačen, brez CORS težav, slovensko vreme
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FBerlin&language=sl`
      const r = await fetch(url)
      if (!r.ok) throw new Error()
      const data = await r.json()
      const c = data.current

      const opisi = {
        0: 'Jasno', 1: 'Pretežno jasno', 2: 'Delno oblačno', 3: 'Oblačno',
        45: 'Megla', 48: 'Ivje', 51: 'Rahel dež', 53: 'Zmeren dež', 55: 'Močan dež',
        61: 'Dež', 63: 'Zmeren dež', 65: 'Močan dež',
        71: 'Sneženje', 73: 'Zmerno sneženje', 75: 'Močno sneženje',
        80: 'Plohe', 81: 'Zmerne plohe', 82: 'Močne plohe',
        95: 'Nevihta', 96: 'Nevihta s točo', 99: 'Nevihta s točo',
      }

      // Pridobi ime kraja
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
        opozorilo: c.weather_code >= 95 ? '⚠️ Nevihte v bližini! Priporočen sestop.' : null,
      })
    } catch {
      setVreme({
        kraj: 'Slovenija',
        temp: '–',
        opis: 'Brez povezave',
        opozorilo: null,
        koda: 2,
      })
    } finally {
      setNalaganje(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>

      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Dober dan! 👋</div>
      <div style={{ fontSize: 14, color: 'var(--besedilo2)', marginBottom: 16 }}>Kje bo danes tvoja pot?</div>

      {/* Vremenski widget */}
      <div style={{
        background: 'var(--modra)', borderRadius: 12, padding: 16,
        marginBottom: 12, color: 'white',
      }}>
        {nalaganje ? (
          <div style={{ textAlign: 'center', padding: '12px 0', opacity: 0.7 }}>
            🌤 Nalagam vreme...
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>📍 {vreme?.kraj}</div>
                <div style={{ fontSize: 36, fontWeight: 300 }}>{vreme?.temp}°C</div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>{vreme?.opis}</div>
                {vreme?.vlaga && (
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                    💧 {vreme.vlaga}% · 💨 {vreme.veter} km/h
                  </div>
                )}
              </div>
              <div style={{ fontSize: 52 }}>{vremeIkona(vreme?.koda)}</div>
            </div>
            {vreme?.opozorilo && (
              <div style={{
                marginTop: 10, background: 'rgba(214,39,24,0.85)',
                borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600,
              }}>
                {vreme.opozorilo}
              </div>
            )}
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid">
        <div className="stat"><div className="stat-st">0</div><div className="stat-ime">opravljene poti</div></div>
        <div className="stat"><div className="stat-st">0 km</div><div className="stat-ime">skupna razdalja</div></div>
        <div className="stat"><div className="stat-st">0 m</div><div className="stat-ime">skupni vzpon</div></div>
        <div className="stat"><div className="stat-st">0</div><div className="stat-ime">pridobljene značke</div></div>
      </div>

      {/* Priporočene poti */}
      <div className="kartica">
        <div className="kartica-naslov">Priporočene poti</div>
        {poti.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0',
            borderBottom: i < poti.length - 1 ? '0.5px solid var(--rob)' : 'none'
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8, background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0
            }}>{p.ikona}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {p.ime}
                <span className={`tezavnost ${p.tezavnost}`}>{p.oznaka}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 2 }}>
                {p.km} km · {p.vzpon} m vzpona · {p.cas}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
