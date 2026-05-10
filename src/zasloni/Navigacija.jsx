import React, { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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
  return `${(m / 1000).toFixed(2)} km`
}

export default function Navigacija({ izbranaPot, gpxTocke, avtomatskiStart, onGPSZacet }) {
  const [gps, setGps] = useState(null)
  const [aktivna, setAktivna] = useState(false)
  const [napaka, setNapaka] = useState(null)
  const [smerNaprave, setSmerNaprave] = useState(0)
  const [sledRazdalja, setSledRazdalja] = useState(0)
  const [sledCas, setSledCas] = useState(0)
  const watchId = useRef(null)
  const casTimer = useRef(null)
  const sledTocke = useRef([])
  const mapRef = useRef(null)
  const mapInstanca = useRef(null)
  const gpsMarker = useRef(null)
  const sledLinija = useRef(null)

  const cilj = gpxTocke?.length > 0
    ? gpxTocke[gpxTocke.length - 1]
    : izbranaPot ? { lat: izbranaPot.lat, lon: izbranaPot.lon } : null

  // Avtomatski start GPS
  useEffect(() => {
    if (avtomatskiStart && !aktivna) {
      zacniNavigacijo()
      if (onGPSZacet) onGPSZacet()
    }
  }, [avtomatskiStart])

  // Kompas
  useEffect(() => {
    function onOrientacija(e) {
      if (e.webkitCompassHeading !== undefined) setSmerNaprave(e.webkitCompassHeading)
      else if (e.alpha !== null) setSmerNaprave(360 - e.alpha)
    }
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(p => {
          if (p === 'granted') window.addEventListener('deviceorientation', onOrientacija)
        }).catch(() => {})
      } else {
        window.addEventListener('deviceorientation', onOrientacija)
      }
    }
    return () => window.removeEventListener('deviceorientation', onOrientacija)
  }, [])

  // Mini zemljevid
  useEffect(() => {
    if (mapInstanca.current) return
    if (!mapRef.current) return
    const map = L.map(mapRef.current, { center: [46.3792, 13.8367], zoom: 14, zoomControl: false, attributionControl: false })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(map)
    mapInstanca.current = map

    if (cilj?.lat) map.setView([cilj.lat, cilj.lon], 14)

    return () => { map.remove(); mapInstanca.current = null }
  }, [])

  function zacniNavigacijo() {
    if (!navigator.geolocation) { setNapaka('GPS ni podprt'); return }
    setAktivna(true)
    setNapaka(null)
    sledTocke.current = []
    setSledRazdalja(0)
    setSledCas(0)

    // Timer za čas hoje
    casTimer.current = setInterval(() => setSledCas(s => s + 1), 1000)

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lon, altitude, accuracy, speed } = pos.coords
        setGps({
          lat, lon,
          visina: altitude ? Math.round(altitude) : null,
          natancnost: Math.round(accuracy),
          hitrost: speed ? Math.round(speed * 3.6) : 0,
        })

        const map = mapInstanca.current
        if (!map) return

        // GPS marker
        if (!gpsMarker.current) {
          const ikona = L.divIcon({
            className: '',
            html: `<div style="width:14px;height:14px;border-radius:50%;background:#2D7A2D;border:3px solid white;box-shadow:0 0 0 3px rgba(45,122,45,0.4);"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7],
          })
          gpsMarker.current = L.marker([lat, lon], { icon: ikona }).addTo(map)
        } else {
          gpsMarker.current.setLatLng([lat, lon])
        }
        map.setView([lat, lon])

        // Dodaj točko sledi
        const prev = sledTocke.current[sledTocke.current.length - 1]
        if (prev) {
          const razd = izracunajRazdaljo(prev.lat, prev.lon, lat, lon)
          if (razd > 5) { // Samo če se je premaknil >5m
            setSledRazdalja(d => d + razd)
            sledTocke.current.push({ lat, lon })
          }
        } else {
          sledTocke.current.push({ lat, lon })
        }

        // Riši zeleno sled
        if (sledTocke.current.length > 1) {
          const koordinate = sledTocke.current.map(t => [t.lat, t.lon])
          if (sledLinija.current) map.removeLayer(sledLinija.current)
          sledLinija.current = L.polyline(koordinate, {
            color: '#2D7A2D', weight: 5, opacity: 0.85,
            lineCap: 'round', lineJoin: 'round',
          }).addTo(map)
        }
      },
      () => { setNapaka('Dovoli GPS v nastavitvah'); setAktivna(false) },
      { enableHighAccuracy: true, maximumAge: 3000 }
    )
  }

  function ustavi() {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    if (casTimer.current) clearInterval(casTimer.current)
    setAktivna(false)
    setGps(null)
  }

  const razdalja = gps && cilj ? izracunajRazdaljo(gps.lat, gps.lon, cilj.lat, cilj.lon) : null
  const smerDoCilja = gps && cilj ? izracunajSmer(gps.lat, gps.lon, cilj.lat, cilj.lon) : null
  const relativnaSmer = smerDoCilja !== null ? (smerDoCilja - smerNaprave + 360) % 360 : null
  const etaSekunde = razdalja ? (razdalja / 1000 / 3.5) * 3600 : null

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

      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Navigacija</div>
      <div style={{ fontSize: 13, color: 'var(--besedilo2)', marginBottom: 12 }}>
        {cilj ? `Cilj: ${izbranaPot?.ime || 'Konec GPX poti'}` : 'Izberi pot v zavihku Išči'}
      </div>

      {/* Mini zemljevid z zeleno sledjo */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', marginBottom: 12,
        border: '0.5px solid var(--rob)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        height: 200, position: 'relative',
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!aktivna && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 13, fontWeight: 600,
          }}>
            Začni navigacijo za GPS sled 🗺️
          </div>
        )}
      </div>

      {/* Statistike sledi */}
      {aktivna && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '12px 14px', border: '0.5px solid var(--rob)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 10, color: 'var(--besedilo2)', marginBottom: 2 }}>🦶 Prehojena pot</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--zelena)' }}>{formatRazdalja(sledRazdalja)}</div>
          </div>
          <div style={{ background: 'white', borderRadius: 12, padding: '12px 14px', border: '0.5px solid var(--rob)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 10, color: 'var(--besedilo2)', marginBottom: 2 }}>⏱ Čas hoje</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--zelena)' }}>{formatCas(sledCas)}</div>
          </div>
        </div>
      )}

      {/* Kompas */}
      {aktivna && gps && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 16,
          marginBottom: 12, border: '0.5px solid var(--rob)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(45,122,45,0.35)', position: 'relative',
          }}>
            {['S','J','Z','V'].map((s, i) => (
              <div key={s} style={{
                position: 'absolute',
                top: i===0?4:i===1?'auto':i===2?'50%':'50%',
                bottom: i===1?4:'auto',
                left: i===2?4:i===3?'auto':'50%',
                right: i===3?4:'auto',
                transform: i<2?'translateX(-50%)':'translateY(-50%)',
                fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
              }}>{s}</div>
            ))}
            <div style={{
              fontSize: 28,
              transform: `rotate(${relativnaSmer || 0}deg)`,
              transition: 'transform 0.4s ease',
            }}>🧭</div>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--zelena)', marginBottom: 4 }}>
              {besediloSmeri(relativnaSmer)}
            </div>
            {razdalja && <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>Do cilja: {formatRazdalja(razdalja)}</div>}
            {etaSekunde && <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>ETA: {formatCas(etaSekunde)}</div>}
          </div>
        </div>
      )}

      {/* HUD */}
      {aktivna && gps && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { v: gps.visina ? `${gps.visina} m` : '–', e: 'višina', i: '▲' },
            { v: `${gps.hitrost} km/h`, e: 'hitrost', i: '⚡' },
            { v: `±${gps.natancnost} m`, e: 'natančnost', i: '🎯' },
          ].map((h, i) => (
            <div key={i} style={{ background: 'linear-gradient(135deg, #1F5C1F, #2D7A2D)', borderRadius: 10, padding: '10px 8px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{h.i}</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{h.v}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>{h.e}</div>
            </div>
          ))}
        </div>
      )}

      {/* GPS iskanje */}
      {aktivna && !gps && (
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 12, border: '0.5px solid var(--rob)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Iščem GPS signal...</div>
          <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 4 }}>Pojdi na odprto</div>
        </div>
      )}

      {napaka && (
        <div style={{ background: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13, color: '#991B1B', fontWeight: 600 }}>⚠️ {napaka}</div>
      )}

      {!cilj && !aktivna && (
        <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '0.5px solid var(--rob)', textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ni izbranega cilja</div>
          <div style={{ fontSize: 13, color: 'var(--besedilo2)', lineHeight: 1.5 }}>
            Pojdi na <strong>Išči</strong> in izberi pot ali kočo.
          </div>
        </div>
      )}

      <button onClick={aktivna ? ustavi : zacniNavigacijo} style={{
        width: '100%', borderRadius: 12, padding: 16,
        fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none',
        background: aktivna ? '#DC2626' : 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
        color: 'white',
        boxShadow: aktivna ? '0 4px 12px rgba(220,38,38,0.4)' : '0 4px 12px rgba(45,122,45,0.4)',
        marginBottom: 10,
      }}>
        {aktivna ? '⏹ Ustavi navigacijo' : '🧭 Začni navigacijo'}
      </button>

      <button onClick={() => window.open('tel:112')} style={{
        width: '100%', background: '#DC2626', color: 'white',
        border: 'none', borderRadius: 12, padding: 14,
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.62 4.38 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        SOS — klic 112
      </button>

    </div>
  )
}
