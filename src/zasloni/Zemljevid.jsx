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
const ZACETNI_ZOOM = 12

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

function ProfilVisine({ tocke, dolzina }) {
  if (!tocke || tocke.length === 0) return null
  const visine = tocke.map(t => t.ele).filter(e => e !== null)
  if (visine.length === 0) return null
  const min = Math.min(...visine)
  const max = Math.max(...visine)
  const razpon = max - min || 1
  const w = 340, h = 70, pad = 8
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
      background: 'white', borderTop: '2px solid #003DA5',
      zIndex: 1000, padding: '8px 12px 6px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#003DA5' }}>Profil višine</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>↑ {Math.round(vzpon)} m</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{min}–{max} m n.m.</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{dolzina} km</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 70 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="profilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003DA5" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#003DA5" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#profilGrad)" />
        <polyline points={points} fill="none" stroke="#003DA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    if (napisiSlojRef.current) {
      map.removeLayer(napisiSlojRef.current)
      napisiSlojRef.current = null
    }
    if (jeTopoPogled) {
      // Satelit + napisi + meje
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri', maxZoom: 19 }
      )
      sat.addTo(map)
      aktivniSloj.current = sat
      const napisi = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { attribution: '', maxZoom: 19, opacity: 0.9 }
      )
      napisi.addTo(map)
      napisiSlojRef.current = napisi
    } else {
      // Topo
      const topo = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenTopoMap', maxZoom: 17 }
      )
      topo.addTo(map)
      aktivniSloj.current = topo
    }
    setJeTopoPogled(!jeTopoPogled)
  }

  useEffect(() => {
    if (mapInstanca.current) return
    const map = L.map(mapRef.current, {
      center: ZACETNI_POGLED, zoom: ZACETNI_ZOOM, zoomControl: false,
    })
    const topo = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenTopoMap · © OpenStreetMap', maxZoom: 17 }
    )
    topo.addTo(map)
    aktivniSloj.current = topo
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanca.current = map

    if (izbranaPot?.lat && izbranaPot?.lon) {
      map.setView([izbranaPot.lat, izbranaPot.lon], 13)
      L.marker([izbranaPot.lat, izbranaPot.lon])
        .addTo(map)
        .bindPopup(`<b>${izbranaPot.ime}</b><br>${izbranaPot.regija}`)
        .openPopup()
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
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#003DA5;border:3px solid white;box-shadow:0 0 0 4px rgba(0,61,165,0.3);"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8],
          })
          gpsMarker.current = L.marker([latitude, longitude], { icon: ikona }).addTo(map)
          gpsKrog.current = L.circle([latitude, longitude], {
            radius: accuracy, color: '#003DA5', fillColor: '#003DA5', fillOpacity: 0.1, weight: 1,
          }).addTo(map)
          map.setView([latitude, longitude], 15)
        } else {
          gpsMarker.current.setLatLng([latitude, longitude])
          gpsKrog.current.setLatLng([latitude, longitude])
          gpsKrog.current.setRadius(accuracy)
        }
      },
      () => { setGpsStatus('napaka — dovoli GPS'); setSledenje(false) },
      { enableHighAccuracy: true, maximumAge: 5000 }
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
      potLinija.current = L.polyline(koordinate, { color: '#D62718', weight: 4, opacity: 0.85 }).addTo(map)
      L.marker(koordinate[0]).addTo(map).bindPopup('🟢 Začetek poti').openPopup()
      L.marker(koordinate[koordinate.length - 1]).addTo(map).bindPopup('🏁 Konec poti')
      map.fitBounds(potLinija.current.getBounds(), { padding: [30, 30] })
      let dolzina = 0
      for (let i = 1; i < koordinate.length; i++) {
        dolzina += map.distance(koordinate[i - 1], koordinate[i])
      }
      setPotIme(datoteka.name.replace('.gpx', ''))
      setPotDolzina((dolzina / 1000).toFixed(1))
      setGpxTocke(tocke)
      setPrikazProfila(true)
    }
    bralnik.readAsText(datoteka)
  }

  const spodajOffset = prikazProfila ? 160 : 0

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', gap: 8, zIndex: 1000, flexWrap: 'wrap',
        pointerEvents: 'none', maxWidth: 'calc(100% - 120px)',
      }}>
        <div style={{
          background: 'white', borderRadius: 8, padding: '6px 10px',
          fontSize: 12, fontWeight: 600, border: '0.5px solid #E5E7EB',
          color: gpsStatus === 'aktiven ✓' ? '#003DA5' : '#6B7280',
        }}>📍 GPS {gpsStatus}</div>
        {visina && (
          <div style={{ background: 'white', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, border: '0.5px solid #E5E7EB', color: '#1A1A2E' }}>↑ {visina} m</div>
        )}
        {potIme && (
          <div style={{ background: '#D62718', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, color: 'white', pointerEvents: 'auto', cursor: 'pointer' }}
            onClick={() => setPrikazProfila(p => !p)}>
            🗺 {potIme} · {potDolzina} km {prikazProfila ? '▼' : '▲'}
          </div>
        )}
      </div>

      {/* Preklop pogled */}
      <button onClick={preklopi} style={{
        position: 'absolute', top: 12, right: 12,
        background: 'white', color: '#1A1A2E',
        border: '0.5px solid #E5E7EB', borderRadius: 8,
        padding: '6px 10px', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', zIndex: 1000,
      }}>
        {jeTopoPogled ? '🛰 Satelit' : '🗺 Topo'}
      </button>

      {/* GPX gumb */}
      <input ref={gpxInput} type="file" accept=".gpx" style={{ display: 'none' }} onChange={nalozGPX} />
      <button onClick={() => gpxInput.current.click()} style={{
        position: 'absolute', bottom: 16 + spodajOffset + 108, right: 16,
        background: 'white', color: '#1A1A2E', border: '2px solid #E5E7EB',
        borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', zIndex: 1000,
      }}>📂 Uvozi GPX</button>

      {/* GPS sledenje */}
      <button onClick={sledenje ? ustavi : zageniGPS} style={{
        position: 'absolute', bottom: 16 + spodajOffset + 54, right: 16,
        background: sledenje ? '#003DA5' : 'white',
        color: sledenje ? 'white' : '#003DA5',
        border: '2px solid #003DA5', borderRadius: 10, padding: '10px 16px',
        fontSize: 13, fontWeight: 700, cursor: 'pointer', zIndex: 1000,
      }}>{sledenje ? '⏹ Ustavi GPS' : '📍 Začni sledenje'}</button>

      {/* SOS */}
      <button style={{
        position: 'absolute', bottom: 16 + spodajOffset, right: 16,
        background: '#D62718', color: 'white', border: 'none',
        borderRadius: 10, padding: '10px 16px', fontSize: 13,
        fontWeight: 700, cursor: 'pointer', zIndex: 1000,
      }}>🆘 SOS</button>

      {/* Profil višine */}
      {prikazProfila && <ProfilVisine tocke={gpxTocke} dolzina={potDolzina} />}
    </div>
  )
}
