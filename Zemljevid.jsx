import React, { useEffect, useRef } from 'react'
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

export default function Zemljevid() {
  const mapRef = useRef(null)
  const mapInstanca = useRef(null)

  useEffect(() => {
    if (mapInstanca.current) return

    const map = L.map(mapRef.current, {
      center: ZACETNI_POGLED,
      zoom: ZACETNI_ZOOM,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap · © OpenStreetMap',
      maxZoom: 17,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.marker([46.3792, 13.8367])
      .addTo(map)
      .bindPopup('<b>Triglav</b><br>2864 m n.m.')

    mapInstanca.current = map

    return () => {
      map.remove()
      mapInstanca.current = null
    }
  }, [])

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', gap: 8, zIndex: 1000,
        pointerEvents: 'none',
      }}>
        {[['📍', 'GPS aktiven'], ['↑', '1.240 m'], ['📶', 'offline']].map(([ik, txt], i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 8,
            padding: '6px 10px', fontSize: 12, fontWeight: 600,
            border: '0.5px solid #E5E7EB', color: '#1A1A2E',
          }}>{ik} {txt}</div>
        ))}
      </div>
      <button style={{
        position: 'absolute', bottom: 16, right: 16,
        background: '#D62718', color: 'white',
        border: 'none', borderRadius: 10,
        padding: '10px 16px', fontSize: 13,
        fontWeight: 700, cursor: 'pointer', zIndex: 1000,
      }}>🆘 SOS</button>
    </div>
  )
}
