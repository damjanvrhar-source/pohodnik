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


function formatCas(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}min`
}

function formatRazd(m) {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m/1000).toFixed(2)} km`
}

function izracunajRazd(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2-lat1)*Math.PI/180
  const dLon = (lon2-lon1)*Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
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
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `2px solid ${ZELENA}`, zIndex: 1000, padding: '8px 12px 6px', boxShadow: '0 -4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: ZELENA }}>Profil višine</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>▲ {Math.round(vzpon)} m</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{Math.round(min)}–{Math.round(max)} m</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{dolzina} km</span>
          <button onClick={onZapri} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16, padding: 0 }}>✕</button>
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

export default function Zemljevid({ izbranaPot, avtomatskiStart, onGPSZacet }) {
  const mapRef = useRef(null)
  const mapInstanca = useRef(null)
  const gpsMarker = useRef(null)
  const gpsKrog = useRef(null)
  const potLinija = useRef(null)
  const watchId = useRef(null)
  const gpxInput = useRef(null)
  const aktivniSloj = useRef(null)
  const napisiSlojRef = useRef(null)
  const sledLinija = useRef(null)
  const sledTocke = useRef([])
  const snopLayer = useRef(null)
  const gpsLokacija = useRef(null)

  const [visina, setVisina] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('izklopljen')
  const [sledenje, setSledenje] = useState(false)
  const [potIme, setPotIme] = useState(null)
  const [potDolzina, setPotDolzina] = useState(null)
  const [gpxTocke, setGpxTocke] = useState([])
  const [prikazProfila, setPrikazProfila] = useState(false)
  const [jeTopoPogled, setJeTopoPogled] = useState(false)
  const [pohod, setPohod] = useState(false)
  const [sledRazdalja, setSledRazdalja] = useState(0)
  const [sledCas, setSledCas] = useState(0)
  const [hitrost, setHitrost] = useState(0)
  const casTimer = useRef(null)
  const smerRef = useRef(0)

  // Avtomatski GPS start
  useEffect(() => {
    if (avtomatskiStart) {
      setTimeout(() => {
        zageniGPS()
        setPohod(true)
        if (onGPSZacet) onGPSZacet()
      }, 800)
    }
  }, [avtomatskiStart])

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
      const osm = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© CartoDB', subdomains: 'abcd', maxZoom: 19 })
      osm.addTo(map)
      aktivniSloj.current = osm
    }
    setJeTopoPogled(!jeTopoPogled)
  }

  useEffect(() => {
    if (mapInstanca.current) return
    const map = L.map(mapRef.current, { center: ZACETNI_POGLED, zoom: ZACETNI_ZOOM, zoomControl: false })
    const osm = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · © CartoDB', subdomains: 'abcd', maxZoom: 19,
    })
    osm.addTo(map)
    aktivniSloj.current = osm
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanca.current = map

    if (izbranaPot?.lat && izbranaPot?.lon) {
      map.setView([izbranaPot.lat, izbranaPot.lon], 13)
      const ciljIkona = L.divIcon({
        className: '',
        html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;">
          <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(220,38,38,0.15);animation:ciljPulse 1.5s ease-out infinite;"></div>
          <div style="position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(220,38,38,0.25);animation:ciljPulse 1.5s ease-out infinite 0.4s;"></div>
          <div style="width:14px;height:14px;border-radius:50%;background:#DC2626;border:3px solid white;box-shadow:0 2px 8px rgba(220,38,38,0.7);position:relative;z-index:2;"></div>
        </div>`,
        iconSize: [40, 40], iconAnchor: [20, 20],
      })
      L.marker([izbranaPot.lat, izbranaPot.lon], { icon: ciljIkona }).addTo(map)
        .bindPopup(`<div style="font-weight:700;color:#DC2626;font-size:13px">🏔 ${izbranaPot.ime}</div><div style="font-size:11px;color:#6B7280">${izbranaPot.regija || ''}</div>`)
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 13)
        }, () => {})
      }
    }

    // Kompas — poskusi z DeviceOrientationEvent
    function onOrientacija(e) {
      let smer = 0
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        smer = e.webkitCompassHeading
      } else if (e.absolute && e.alpha !== null) {
        smer = 360 - e.alpha
      } else {
        return // Ni veljavnih podatkov
      }
      smerRef.current = smer
      const lokacija = gpsLokacija.current
      if (lokacija && map) {
        if (snopMarker.current) map.removeLayer(snopMarker.current)
        snopMarker.current = L.marker(lokacija, { icon: ustvariSnopIkono(smer), zIndexOffset: -100 }).addTo(map)
      }
    }

    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceOrientationEvent.requestPermission()
          .then(p => {
            if (p === 'granted') {
              window.addEventListener('deviceorientationabsolute', onOrientacija, true)
              window.addEventListener('deviceorientation', onOrientacija, true)
            }
          }).catch(() => {})
      } else {
        window.addEventListener('deviceorientationabsolute', onOrientacija, true)
        window.addEventListener('deviceorientation', onOrientacija, true)
      }
    }

    return () => {
      map.remove()
      mapInstanca.current = null
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
      if (casTimer.current) clearInterval(casTimer.current)
      sprostiWakeLock()
      window.removeEventListener('deviceorientation', onOrientacija, true)
      window.removeEventListener('deviceorientationabsolute', onOrientacija, true)
    }
  }, [])

  function ustvariGPSIkono() {
    return L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${ZELENA};border:3px solid white;box-shadow:0 0 0 4px rgba(45,122,45,0.3);"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
  }

  function ustvariGPSPika() {
    return L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${ZELENA};border:3px solid white;box-shadow:0 0 0 4px rgba(45,122,45,0.3);"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
  }

  function posodobiSnop(lat, lon, smer) {
    const map = mapInstanca.current
    if (!map) return
    if (snopLayer.current) { map.removeLayer(snopLayer.current); snopLayer.current = null }
    // Sever = 0, Vzhod = 90, Jug = 180, Zahod = 270
    const deg = smer || 0
    const d = 0.002  // ~220m - dovolj velik da je viden
    const kot = 35 * Math.PI / 180
    const sRad = deg * Math.PI / 180
    // 3 točke: pike levo, desno od snopa + konica
    const latKos = Math.cos(lat * Math.PI / 180)
    const p1lat = lat + d * Math.cos(sRad - kot)
    const p1lon = lon + d * Math.sin(sRad - kot) / latKos
    const p2lat = lat + d * Math.cos(sRad + kot)
    const p2lon = lon + d * Math.sin(sRad + kot) / latKos
    snopLayer.current = L.polygon(
      [[lat, lon], [p1lat, p1lon], [p2lat, p2lon]],
      { color: '#2D7A2D', fillColor: '#2D7A2D', fillOpacity: 0.45, weight: 2, opacity: 0.8, interactive: false }
    ).addTo(map)
  }

  const wakeLock = useRef(null)

  async function zageniWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen')
      }
    } catch (e) {}
  }

  function sprostiWakeLock() {
    if (wakeLock.current) { wakeLock.current.release(); wakeLock.current = null }
  }

  function zageniGPS() {
    if (!navigator.geolocation) { setGpsStatus('ni podprt'); return }
    setGpsStatus('iskanje...')
    setSledenje(true)
    setSledRazdalja(0)
    setSledCas(0)
    zageniWakeLock()
    casTimer.current = setInterval(() => setSledCas(s => s + 1), 1000)
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, altitude, accuracy } = pos.coords
        if (gpsStatus !== 'aktiven ✓')
        setGpsStatus('aktiven ✓')
        if (altitude) setVisina(Math.round(altitude))
        if (pos.coords.speed) setHitrost(Math.round(pos.coords.speed * 3.6))
        // GPS heading - posodobi snop med gibanjem
        if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
          smerRef.current = pos.coords.heading
          const lok = gpsLokacija.current
          if (lok) posodobiSnop(lok[0], lok[1], pos.coords.heading)
        }
        const map = mapInstanca.current
        if (!map) return
        if (!gpsMarker.current) {
          gpsLokacija.current = [latitude, longitude]
          gpsMarker.current = L.marker([latitude, longitude], { icon: ustvariGPSPika(), zIndexOffset: 100 }).addTo(map)
          gpsKrog.current = L.circle([latitude, longitude], { radius: accuracy, color: ZELENA, fillColor: ZELENA, fillOpacity: 0.08, weight: 1 }).addTo(map)
          map.setView([latitude, longitude], 15)
          posodobiSnop(latitude, longitude, smerRef.current)
        } else {
          gpsLokacija.current = [latitude, longitude]
          gpsMarker.current.setLatLng([latitude, longitude])
          posodobiSnop(latitude, longitude, smerRef.current)
          gpsKrog.current.setLatLng([latitude, longitude])
          gpsKrog.current.setRadius(accuracy)
          map.setView([latitude, longitude])
        }

        // Dodaj točko sledi in riši zeleno črto
        const prev = sledTocke.current[sledTocke.current.length - 1]
        if (!prev || Math.abs(prev[0] - latitude) > 0.00008 || Math.abs(prev[1] - longitude) > 0.00008) {
          if (sledTocke.current.length > 0) {
            const prej = sledTocke.current[sledTocke.current.length - 1]
            const R = 6371000
            const dLat = (latitude - prej[0]) * Math.PI / 180
            const dLon = (longitude - prej[1]) * Math.PI / 180
            const a = Math.sin(dLat/2)**2 + Math.cos(prej[0]*Math.PI/180)*Math.cos(latitude*Math.PI/180)*Math.sin(dLon/2)**2
            const razd = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
            if (razd > 8) setSledRazdalja(d => d + razd)
          }
          sledTocke.current.push([latitude, longitude])
          if (sledTocke.current.length > 1) {
            if (sledLinija.current) map.removeLayer(sledLinija.current)
            sledLinija.current = L.polyline(sledTocke.current, {
              color: ZELENA, weight: 5, opacity: 0.85,
              lineCap: 'round', lineJoin: 'round',
            }).addTo(map)
          }
        }
      },
      () => { setGpsStatus('napaka — dovoli GPS'); setSledenje(false) },
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 15000, distanceFilter: 5 }
    )
  }

  function ustavi() {
    if (watchId.current) { navigator.geolocation.clearWatch(watchId.current); watchId.current = null }
    if (casTimer.current) { clearInterval(casTimer.current); casTimer.current = null }
    sprostiWakeLock()
    setSledenje(false)
    setGpsStatus('izklopljen')
    sledTocke.current = []
    const map = mapInstanca.current
    if (map && sledLinija.current) { map.removeLayer(sledLinija.current); sledLinija.current = null }
    if (map && snopLayer.current) { map.removeLayer(snopLayer.current); snopLayer.current = null }

  }

  function shranijPohod() {
    if (sledRazdalja < 50) return // Ne shrani če < 50m
    const pohod = {
      id: Date.now(),
      ime: izbranaPot?.ime || 'Prosti pohod',
      datum: new Date().toLocaleDateString('sl-SI'),
      cas: sledCas,
      razdalja: Math.round(sledRazdalja),
      vzpon: visina || 0,
      regija: izbranaPot?.regija || '',
    }
    try {
      const obstojechi = JSON.parse(localStorage.getItem('pohodnik_pohodi') || '[]')
      obstojechi.unshift(pohod)
      localStorage.setItem('pohodnik_pohodi', JSON.stringify(obstojechi.slice(0, 50)))
      // Posodobi statistike
      const stats = JSON.parse(localStorage.getItem('pohodnik_stats') || '{"poti":0,"razdalja":0,"vzpon":0,"cas":0}')
      stats.poti += 1
      stats.razdalja += Math.round(sledRazdalja)
      stats.vzpon += visina || 0
      stats.cas += sledCas
      localStorage.setItem('pohodnik_stats', JSON.stringify(stats))
    } catch(e) {}
  }

  function prekiniPot() {
    shranijPohod()
    ustavi()
    setPohod(false)
    const map = mapInstanca.current
    if (!map) return
    if (gpsMarker.current) { map.removeLayer(gpsMarker.current); gpsMarker.current = null }
    if (gpsKrog.current) { map.removeLayer(gpsKrog.current); gpsKrog.current = null }
    if (potLinija.current) { map.removeLayer(potLinija.current); potLinija.current = null }
    if (sledLinija.current) { map.removeLayer(sledLinija.current); sledLinija.current = null }
    sledTocke.current = []
    setPotIme(null); setPotDolzina(null); setGpxTocke([]); setPrikazProfila(false); setVisina(null)
    setSledRazdalja(0); setSledCas(0)
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
      const startIkona = L.divIcon({ className: '', html: `<div style="background:#16a34a;color:white;padding:3px 7px;border-radius:6px;font-size:11px;font-weight:700;">▶ Start</div>`, iconAnchor: [0, 0] })
      L.marker(koordinate[0], { icon: startIkona }).addTo(map)
      const endIkona = L.divIcon({ className: '', html: `<div style="background:#dc2626;color:white;padding:3px 7px;border-radius:6px;font-size:11px;font-weight:700;">⬛ Cilj</div>`, iconAnchor: [0, 0] })
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
    setTimeout(() => window.open('tel:112'), 500)
  }

  const spodajOffset = prikazProfila ? 155 : 0
  const jeAktiven = sledenje || pohod

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
      <style>{`
        @keyframes ciljPulse {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes prekiniPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(220,38,38,0.5); }
          50% { box-shadow: 0 4px 24px rgba(220,38,38,0.9), 0 0 0 4px rgba(220,38,38,0.2); }
        }
      `}</style>

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* HUD — zgoraj levo */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1000, pointerEvents: 'none' }}>
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
          <div onClick={() => setPrikazProfila(p => !p)} style={{ background: ZELENA, borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: 'white', pointerEvents: 'auto', cursor: 'pointer' }}>
            🗺 {potIme} · {potDolzina} km {prikazProfila ? '▼' : '▲'}
          </div>
        )}
        <button
          onClick={() => {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission().then(p => {
                if (p === 'granted') {
                  window.addEventListener('deviceorientation', (e) => {
                    const smer = e.webkitCompassHeading ?? (360 - (e.alpha || 0))
                    smerRef.current = smer
                    const lok = gpsLokacija.current
                    const map = mapInstanca.current
                    if (lok && map) {
                      const lok2 = gpsLokacija.current
                      if (lok2) posodobiSnop(lok2[0], lok2[1], smer)
                    }
                  }, true)
                }
              }).catch(() => {})
            }
          }}
          style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
        >
          🧭 Kompas
        </button>
      </div>

      {/* Preklop pogled */}
      <button onClick={preklopi} style={{ ...btnStil, position: 'absolute', top: 12, right: 12, padding: '9px 14px' }}>
        {jeTopoPogled ? '🛰 Satelit' : '🗺 Zemljevid'}
      </button>

      {/* GPX */}
      <input ref={gpxInput} type="file" accept=".gpx" style={{ display: 'none' }} onChange={nalozGPX} />
      <button onClick={() => gpxInput.current.click()} style={{ ...btnStil, position: 'absolute', bottom: 16 + spodajOffset + 124, right: 12 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        GPX
      </button>

      {/* GPS gumb */}
      <button onClick={sledenje ? ustavi : () => {
 zageniGPS() }} style={{
        ...btnStil, position: 'absolute', bottom: 16 + spodajOffset + 62, right: 12,
        background: sledenje ? ZELENA : 'white', color: sledenje ? 'white' : ZELENA, border: `1.5px solid ${ZELENA}`,
      }}>
        {sledenje ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg> Ustavi</> : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> GPS</>}
      </button>

      {/* SOS */}
      <button onClick={sosKlic} style={{
        position: 'absolute', bottom: 16 + spodajOffset, right: 12,
        background: '#DC2626', color: 'white', border: 'none', borderRadius: 12,
        padding: '11px 16px', fontSize: 14, fontWeight: 800, cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 4px 14px rgba(220,38,38,0.5)', display: 'flex', alignItems: 'center', gap: 7, minWidth: 80, justifyContent: 'center',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.62 4.38 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        112
      </button>

      {/* STATS PANEL — med aktivnim pohodom */}
      {sledenje && (
        <div style={{
          position: 'absolute', bottom: 16 + spodajOffset + 62, left: 12,
          background: 'white', borderRadius: 14, padding: '10px 12px',
          zIndex: 1000, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          border: '1px solid #E5E7EB', minWidth: 200,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { i: '📏', v: formatRazd(sledRazdalja), l: 'prehojena' },
              { i: '⏱', v: formatCas(sledCas), l: 'čas hoje' },
              { i: '⚡', v: `${hitrost} km/h`, l: 'hitrost' },
              { i: '▲', v: visina ? `${visina} m` : '–', l: 'višina' },
              izbranaPot?.lat ? { i: '📍', v: (() => { const gpsEl = gpsMarker.current; if (!gpsEl) return '–'; const pos = gpsEl.getLatLng(); return formatRazd(izracunajRazd(pos.lat, pos.lng, izbranaPot.lat, izbranaPot.lon)) })(), l: 'do cilja' } : null,
              { i: '🕐', v: sledCas > 0 && sledRazdalja > 0 ? (() => { const eta = ((izbranaPot?.lat && gpsMarker.current) ? izracunajRazd(gpsMarker.current.getLatLng().lat, gpsMarker.current.getLatLng().lng, izbranaPot.lat, izbranaPot.lon) : 0) / (sledRazdalja / sledCas); return eta > 0 ? formatCas(Math.round(eta)) : '–' })() : '–', l: 'ETA' },
            ].filter(Boolean).map((h, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 1 }}>{h.i} {h.l}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: ZELENA }}>{h.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREKINI POT — prikaže se ko GPS teče */}}
      {sledenje && (
        <button onClick={prekiniPot} style={{
          position: 'absolute', bottom: 16 + spodajOffset, left: 12,
          background: '#DC2626', color: 'white', border: 'none',
          borderRadius: 12, padding: '12px 22px', fontSize: 14,
          fontWeight: 800, cursor: 'pointer', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'prekiniPulse 2s ease infinite',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>
          Prekini pot
        </button>
      )}

      {prikazProfila && <ProfilVisine tocke={gpxTocke} dolzina={potDolzina} onZapri={() => setPrikazProfila(false)} />}
    </div>
  )
}
