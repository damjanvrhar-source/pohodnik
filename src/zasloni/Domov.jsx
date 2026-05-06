import React, { useState, useEffect } from 'react'

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
        kraj, temp: Math.round(c.temperature_2m),
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
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h) - 3px - var(--nav-h))' }}>

      {/* Vremenski widget */}
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
              <div style={{ fontSize: 11, opacity: 0.7 }}>💧 {vreme?.vlaga}% · 💨 {vreme?.veter} km/h</div>
            </div>
            <div style={{ fontSize: 40 }}>{vremeIkona(vreme?.koda)}</div>
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
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

      {/* Gore + slogan kartica */}
      <div style={{
        background: 'linear-gradient(160deg, #0A3D0A 0%, #1A5C1A 45%, #2D7A2D 80%, #3A9A3A 100%)',
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        boxShadow: '0 6px 20px rgba(45,122,45,0.4)',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Zvezde */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${5 + (i * 37 % 90)}%`,
            top: `${3 + (i * 23 % 35)}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.55)',
          }}/>
        ))}

        {/* Gore SVG */}
        <svg style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          width: '100%', height: '75%', opacity: 0.25,
        }} viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice">
          <polygon points="0,160 70,60 140,160" fill="white"/>
          <polygon points="60,160 150,20 240,160" fill="white"/>
          <polygon points="160,160 240,55 320,160" fill="white"/>
          <polygon points="260,160 330,80 400,160" fill="white"/>
          <polygon points="130,20 150,0 170,20 162,32 138,32" fill="rgba(255,255,255,0.7)"/>
          <polygon points="62,60 70,44 78,60 74,70 66,70" fill="rgba(255,255,255,0.55)"/>
          <polygon points="230,55 240,38 250,55 246,65 234,65" fill="rgba(255,255,255,0.55)"/>
        </svg>

        {/* Krog za logo */}
        <div style={{
          position: 'absolute', top: 16, left: '50%',
          transform: 'translateX(-50%)',
          width: 70, height: 70,
          borderRadius: '50%',
          border: '2px solid rgba(180,255,180,0.5)',
          boxShadow: '0 0 30px rgba(180,255,180,0.15)',
        }}/>

        {/* Vsebina */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '28px 20px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🏔️</div>
          <div style={{
            fontSize: 36, fontWeight: 800, color: 'white',
            letterSpacing: '3px', textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            marginBottom: 6,
          }}>POHODNIK</div>
          <div style={{
            fontSize: 14, color: 'rgba(180,255,180,0.9)',
            letterSpacing: '2.5px', textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Razišči · Odkrij · Doživi
          </div>
          <div style={{
            marginTop: 14, fontSize: 15,
            color: 'rgba(255,255,255,0.6)',
            fontStyle: 'italic',
          }}>
            Tvoj najljubši sopotnik v naravo
          </div>
        </div>
      </div>

    </div>
  )
}
