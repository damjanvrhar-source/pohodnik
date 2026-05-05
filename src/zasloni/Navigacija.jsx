import React, { useState, useEffect, useRef } from 'react'

function izracunajRazdaljo(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function izracunajSmer(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180)
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
    Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

function formatCas(sekunde) {
  if (sekunde < 60) return `${Math.round(sekunde)}s`
  const min = Math.floor(sekunde / 60)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

function formatRazdalja(m) {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

export default function Navigacija({ izbranaPot, gpxTocke }) {
  const [gps, setGps] = useState(null)
  const [aktivna, setAktivna] = useState(false)
  const [napaka, setNapaka] = useState(null)
  const [smerNaprave, setSmerNaprave] = useState(0)
  const watchId = useRef(null)

  // Cilj — iz izbrane poti ali zadnja GPX točka
  const cilj = gpxTocke?.length > 0
    ? gpxTocke[gpxTocke.length - 1]
    : izbranaPot
      ? { lat: izbranaPot.lat, lon: izbranaPot.lon }
      : null

  // Kompas
  useEffect(() => {
    function onOrientacija(e) {
      if (e.webkitCompassHeading !== undefined) {
        setSmerNaprave(e.webkitCompassHeading)
      } else if (e.alpha !== null) {
        setSmerNaprave(360 - e.alpha)
      }
    }
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(perm => {
          if (perm === 'granted') window.addEventListener('deviceorientation', onOrientacija)
        }).catch(() => {})
      } else {
        window.addEventListener('deviceorientation', onOrientacija)
      }
    }
    return () => window.removeEventListener('deviceorientation', onOrientacija)
  }, [])

  function zacniNavigacijo() {
    if (!navigator.geolocation) { setNapaka('GPS ni podprt'); return }
    setAktivna(true)
    setNapaka(null)
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          visina: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
          natancnost: Math.round(pos.coords.accuracy),
          hitrost: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0,
        })
      },
      (err) => { setNapaka('Dovoli GPS v nastavitvah'); setAktivna(false) },
      { enableHighAccuracy: true, maximumAge: 3000 }
    )
  }

  function ustavi() {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    setAktivna(false)
    setGps(null)
  }

  // Izračuni
  const razdalja = gps && cilj ? izracunajRazdaljo(gps.lat, gps.lon, cilj.lat, cilj.lon) : null
  const smerDoCilja = gps && cilj ? izracunajSmer(gps.lat, gps.lon, cilj.lat, cilj.lon) : null
  const relativnaSmer = smerDoCilja !== null ? (smerDoCilja - smerNaprave + 360) % 360 : null
  const etaSekunde = razdalja ? (razdalja / 1000 / 3.5) * 3600 : null

  // Besedilo smeri
  function besediloSmeri(kot) {
    if (kot === null) return '–'
    if (kot < 22.5 || kot >= 337.5) return 'Naprej ↑'
    if (kot < 67.5) return 'Desno-naprej ↗'
    if (kot < 112.5) return 'Desno →'
    if (kot < 157.5) return 'Desno-nazaj ↘'
    if (kot < 202.5) return 'Obrnite se ↓'
    if (kot < 247.5) return 'Levo-nazaj ↙'
    if (kot < 292.5) return 'Levo ←'
    return 'Levo-naprej ↖'
  }

  return (
    <div style={{ padding: 16 }}>

      {/* Naslov */}
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Navigacija 🧭</div>
      <div style={{ fontSize: 13, color: 'var(--besedilo2)', marginBottom: 16 }}>
        {cilj
          ? `Cilj: ${izbranaPot?.ime || 'Konec GPX poti'}`
          : 'Izberi pot v zavihku Iskanje ali Koče'}
      </div>

      {/* Kompas */}
      {aktivna && gps && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          marginBottom: 12, border: '0.5px solid var(--rob)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Puščica kompasa */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12, boxShadow: '0 4px 20px rgba(45,122,45,0.4)',
            position: 'relative',
          }}>
            {/* Kompas krog */}
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
            }}>S</div>
            <div style={{
              position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
            }}>J</div>
            <div style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
            }}>Z</div>
            <div style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
            }}>V</div>

            {/* Puščica do cilja */}
            <div style={{
              fontSize: 40,
              transform: `rotate(${relativnaSmer || 0}deg)`,
              transition: 'transform 0.5s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}>🧭</div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--zelena)', marginBottom: 4 }}>
            {besediloSmeri(relativnaSmer)}
          </div>
          {razdalja && (
            <div style={{ fontSize: 13, color: 'var(--besedilo2)' }}>
              Do cilja: {formatRazdalja(razdalja)}
            </div>
          )}
        </div>
      )}

      {/* HUD podatki */}
      {aktivna && gps && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { vrednost: razdalja ? formatRazdalja(razdalja) : '–', enota: 'do cilja', ikona: '📍' },
            { vrednost: etaSekunde ? formatCas(etaSekunde) : '–', enota: 'ETA', ikona: '⏱' },
            { vrednost: gps.visina ? `${gps.visina} m` : '–', enota: 'višina', ikona: '↑' },
            { vrednost: `${gps.hitrost} km/h`, enota: 'hitrost', ikona: '⚡' },
            { vrednost: `±${gps.natancnost} m`, enota: 'natančnost', ikona: '🎯' },
            { vrednost: smerDoCilja ? `${Math.round(smerDoCilja)}°` : '–', enota: 'smer', ikona: '🧭' },
          ].map((h, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #1F5C1F, #2D7A2D)',
              borderRadius: 10, padding: '10px 8px', textAlign: 'center', color: 'white',
            }}>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{h.ikona}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{h.vrednost}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>{h.enota}</div>
            </div>
          ))}
        </div>
      )}

      {/* Stanje GPS */}
      {aktivna && !gps && (
        <div style={{
          background: 'white', borderRadius: 12, padding: 20,
          textAlign: 'center', marginBottom: 12, border: '0.5px solid var(--rob)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Iščem GPS signal...</div>
          <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 4 }}>Pojdi na odprto</div>
        </div>
      )}

      {/* Napaka */}
      {napaka && (
        <div style={{
          background: '#FEE2E2', borderRadius: 10, padding: 12,
          marginBottom: 12, fontSize: 13, color: '#991B1B', fontWeight: 600,
        }}>⚠️ {napaka}</div>
      )}

      {/* Brez cilja */}
      {!cilj && !aktivna && (
        <div style={{
          background: 'white', borderRadius: 12, padding: 24,
          border: '0.5px solid var(--rob)', textAlign: 'center', marginBottom: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ni izbranega cilja</div>
          <div style={{ fontSize: 13, color: 'var(--besedilo2)', lineHeight: 1.5 }}>
            Pojdi na <strong>Iskanje</strong> ali <strong>Koče</strong> in izberi cilj.
          </div>
        </div>
      )}

      {/* Start/Stop gumb */}
      <button
        onClick={aktivna ? ustavi : zacniNavigacijo}
        style={{
          width: '100%', borderRadius: 12, padding: 16,
          fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none',
          background: aktivna
            ? '#DC2626'
            : 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
          color: 'white',
          boxShadow: aktivna
            ? '0 4px 12px rgba(220,38,38,0.4)'
            : '0 4px 12px rgba(45,122,45,0.4)',
          marginBottom: 10,
        }}>
        {aktivna ? '⏹ Ustavi navigacijo' : '🧭 Začni navigacijo'}
      </button>

      {/* SOS */}
      <button style={{
        width: '100%', background: '#DC2626', color: 'white',
        border: 'none', borderRadius: 12, padding: 14,
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
      }}>
        🆘 SOS — klic za pomoč
      </button>

    </div>
  )
}
