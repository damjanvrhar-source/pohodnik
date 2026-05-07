import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ZACETNI_POGLED = [46.3792, 13.8367]
const ZACETNI_ZOOM = 10
const ZELENA = '#2D7A2D'
const ZELENA_T = '#1F5C1F'

function parseGPX(vsebina) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(vsebina, 'application/xml')
  const tocke = []
  doc.querySelectorAll('trkpt, rtept, wpt').forEach(el => {
    const lat = parseFloat(el.getAttribute('lat'))
    const lon = parseFloat(el.getAttribute('lon'))
    const ele = el.querySelector('ele')
    if (!isNaN(lat) && !isNaN(lon)) {
      tocke.push({ lat, lon, ele: ele ? parseFloat(ele.textContent) : null })
    }
  })
  return tocke
}

function ProfilVisine({ tocke, dolzina, onZapri }) {
  if (!tocke || tocke.length === 0) return null
  const visine = tocke.map(t => t.ele).filter(e => e !== null)
  if (visine.length === 0) return null
  const min = Math.min(...visine)
  const max = Math.max(...visine)
  const razpon = max - min || 1
  const w = 340, h = 65, pad = 8
  const points = visine.map((v, i) => {
    const x = pad + (i / (visine.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / razpon) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`
  const vzpon = visine.reduce((acc, v, i) => i > 0 && v > visine[i-1] ? acc + (v - visine[i-1]) : acc, 0)

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: `2px solid ${ZELENA}`,
      zIndex: 1000, padding: '8px 12px 6px',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: ZELENA }}>Profil višine</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>▲ {Math.round(vzpon)} m</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{Math.round(min)}–{Math.round(max)} m</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{dolzina} km</span>
          <button onClick={onZapri} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 65 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="profilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ZELENA} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={ZELENA} stopOpacity="0.03"/>
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#profilGrad)" />
        <polyline points={points} fill="none" stroke={ZELENA} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

export default function Zemljevid({ izbranaPot }) {
  const mapRef = useRef(null)
  const mapInstanca = useRef(null)
  const gpsMarker = useRef(null)
  const gpsKrog = useRef(null)
  const potLinija = useRef(null)
  const watchId = useRef(null)
  const gpxInput = useRef(null)
  const aktivniSloj = useRef(null)
  const napisiSlojRef = useRef(null)

  const [visina, setVisina] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('izklopljen')
  const [sledenje, setSledenje] = useState(false)
  const [potIme, setPotIme] = useState(null)
  const [potDolzina, setPotDolzina] = useState(null)
  const [gpxTocke, setGpxTocke] = useState([])
  const [prikazProfila, setPrikazProfila] = useState(false)
  const [jeTopoPogled, setJeTopoPogled] = useState(true)

  function preklopi() {
    const map = mapInstanca.current
    if (!map) return
    map.removeLayer(aktivniSloj.current)
    if (napisiSlojRef.current) { map.removeLayer(napisiSlojRef.current); napisiSlojRef.current = null }
    if (jeTopoPogled) {
      const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 19 })
      sat.addTo(map)
      aktivniSloj.current = sat
      const napisi = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { attribution: '', maxZoom: 19, opacity: 0.9 })
      napisi.addTo(map)
      napisiSlojRef.current = napisi
    } else {
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap', maxZoom: 17 })
      topo.addTo(map)
      aktivniSloj.current = topo
    }
    setJeTopoPogled(!jeTopoPogled)
  }

  useEffect(() => {
    if (mapInstanca.current) return
    const map = L.map(mapRef.current, { center: ZACETNI_POGLED, zoom: ZACETNI_ZOOM, zoomControl: false })
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap · © OpenStreetMap', maxZoom: 17 })
    topo.addTo(map)
    aktivniSloj.current = topo
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanca.current = map

    if (izbranaPot?.lat && izbranaPot?.lon) {
      map.setView([izbranaPot.lat, izbranaPot.lon], 13)
      const ikona = L.divIcon({
        className: '',
        html: `<div style="background:${ZELENA};color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏔 ${izbranaPot.ime}</div>`,
        iconAnchor: [0, 0],
      })
      L.marker([izbranaPot.lat, izbranaPot.lon], { icon: ikona }).addTo(map)
    } else {
      // Avtomatsko centriraj na uporabnikovo lokacijo
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 13)
        }, () => {})
      }
    }

    return () => {
      map.remove()
      mapInstanca.current = null
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [])

  function zageniGPS() {
    if (!navigator.geolocation) { setGpsStatus('ni podprt'); return }
    setGpsStatus('iskanje...')
    setSledenje(true)
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, altitude, accuracy } = pos.coords
        setGpsStatus('aktiven ✓')
        if (altitude) setVisina(Math.round(altitude))
        const map = mapInstanca.current
        if (!map) return
        if (!gpsMarker.current) {
          const ikona = L.divIcon({
            className: '',
            html: `<div style="width:16px;height:16px;border-radius:50%;background:${ZELENA};border:3px solid white;box-shadow:0 0 0 4px rgba(45,122,45,0.3);"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8],
          })
          gpsMarker.current = L.marker([latitude, longitude], { icon: ikona }).addTo(map)
          gpsKrog.current = L.circle([latitude, longitude], { radius: accuracy, color: ZELENA, fillColor: ZELENA, fillOpacity: 0.08, weight: 1 }).addTo(map)
          map.setView([latitude, longitude], 15)
        } else {
          gpsMarker.current.setLatLng([latitude, longitude])
          gpsKrog.current.setLatLng([latitude, longitude])
          gpsKrog.current.setRadius(accuracy)
          map.setView([latitude, longitude])
        }
      },
      () => { setGpsStatus('napaka — dovoli GPS'); setSledenje(false) },
      { enableHighAccuracy: true, maximumAge: 3000 }
    )
  }

  function ustavi() {
    if (watchId.current) { navigator.geolocation.clearWatch(watchId.current); watchId.current = null }
    setSledenje(false)
    setGpsStatus('izklopljen')
  }

  function nalozGPX(e) {
    const datoteka = e.target.files[0]
    if (!datoteka) return
    const bralnik = new FileReader()
    bralnik.onload = (ev) => {
      const tocke = parseGPX(ev.target.result)
      if (tocke.length === 0) { alert('GPX datoteka ne vsebuje točk.'); return }
      const map = mapInstanca.current
      if (!map) return
      if (potLinija.current) map.removeLayer(potLinija.current)
      const koordinate = tocke.map(t => [t.lat, t.lon])
      potLinija.current = L.polyline(koordinate, { color: ZELENA, weight: 5, opacity: 0.9 }).addTo(map)

      // Start marker
      const startIkona = L.divIcon({ className: '', html: `<div style="background:#16a34a;color:white;padding:3px 7px;border-radius:6px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3)">▶ Start</div>`, iconAnchor: [0, 0] })
      L.marker(koordinate[0], { icon: startIkona }).addTo(map)

      // End marker
      const endIkona = L.divIcon({ className: '', html: `<div style="background:#dc2626;color:white;padding:3px 7px;border-radius:6px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3)">⬛ Cilj</div>`, iconAnchor: [0, 0] })
      L.marker(koordinate[koordinate.length - 1], { icon: endIkona }).addTo(map)

      map.fitBounds(potLinija.current.getBounds(), { padding: [30, 30] })
      let dolzina = 0
      for (let i = 1; i < koordinate.length; i++) dolzina += map.distance(koordinate[i - 1], koordinate[i])
      setPotIme(datoteka.name.replace('.gpx', ''))
      setPotDolzina((dolzina / 1000).toFixed(1))
      setGpxTocke(tocke)
      setPrikazProfila(true)
    }
    bralnik.readAsText(datoteka)
  }

  function sosKlic() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
        window.open(`tel:112`)
      })
    } else {
      window.open('tel:112')
    }
  }

  const spodajOffset = prikazProfila ? 155 : 0

  const btnStil = {
    background: 'white', color: '#1A1A2E',
    border: '1px solid #D1D5DB', borderRadius: 12,
    padding: '11px 16px', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', zIndex: 1000,
    boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', gap: 7,
    minWidth: 80, justifyContent: 'center',
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* HUD — zgoraj levo */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', flexDirection: 'column', gap: 6,
        zIndex: 1000, pointerEvents: 'none',
      }}>
        <div style={{
          background: 'white', borderRadius: 10, padding: '8px 12px',
          fontSize: 12, fontWeight: 700, border: '1px solid #E5E7EB',
          color: gpsStatus === 'aktiven ✓' ? ZELENA : '#6B7280',
          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: gpsStatus === 'aktiven ✓' ? ZELENA : '#D1D5DB' }} />
          GPS {gpsStatus}
        </div>
        {visina && (
          <div style={{ background: 'white', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, border: '0.5px solid #E5E7EB', color: '#1A1A2E', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            ▲ {visina} m n.m.
          </div>
        )}
        {potIme && (
          <div
            onClick={() => setPrikazProfila(p => !p)}
            style={{ background: ZELENA, borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: 'white', pointerEvents: 'auto', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            🗺 {potIme} · {potDolzina} km {prikazProfila ? '▼' : '▲'}
          </div>
        )}
      </div>

      {/* Preklop pogled — zgoraj desno */}
      <button onClick={preklopi} style={{ ...btnStil, position: 'absolute', top: 12, right: 12, padding: '9px 14px' }}>
        {jeTopoPogled ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Satelit</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg> Topo</>
        )}
      </button>

      {/* Gumbi desno */}
      <input ref={gpxInput} type="file" accept=".gpx" style={{ display: 'none' }} onChange={nalozGPX} />

      <button onClick={() => gpxInput.current.click()} style={{ ...btnStil, position: 'absolute', bottom: 16 + spodajOffset + 124, right: 12 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        GPX
      </button>

      <button onClick={sledenje ? ustavi : zageniGPS} style={{
        ...btnStil,
        position: 'absolute', bottom: 16 + spodajOffset + 62, right: 12,
        background: sledenje ? ZELENA : 'white',
        color: sledenje ? 'white' : ZELENA,
        border: `1.5px solid ${ZELENA}`,
      }}>
        {sledenje ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg> Ustavi</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> GPS</>
        )}
      </button>

      <button onClick={sosKlic} style={{
        position: 'absolute', bottom: 16 + spodajOffset, right: 12,
        background: '#DC2626', color: 'white', border: 'none',
        borderRadius: 12, padding: '11px 16px', fontSize: 14,
        fontWeight: 800, cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 4px 14px rgba(220,38,38,0.5)',
        display: 'flex', alignItems: 'center', gap: 7,
        minWidth: 80, justifyContent: 'center',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.62 4.38 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        112
      </button>

      {/* Profil višine */}
      {prikazProfila && <ProfilVisine tocke={gpxTocke} dolzina={potDolzina} onZapri={() => setPrikazProfila(false)} />}
    </div>
  )
}
