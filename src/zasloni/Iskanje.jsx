import React, { useState } from 'react'

const VSE_POTI = [
  { ikona: '⛰️', ime: 'Triglav', regija: 'Julijske Alpe', tezavnost: 'tezka', oznaka: 'Zahtevna', km: 18, vzpon: 1700, bg: '#FEF3C7' },
  { ikona: '🌲', ime: 'Velika planina', regija: 'Kamniške Alpe', tezavnost: 'lahka', oznaka: 'Lahka', km: 6, vzpon: 380, bg: '#D1FAE5' },
  { ikona: '🏔️', ime: 'Stol', regija: 'Karavanke', tezavnost: 'srednja', oznaka: 'Srednja', km: 12, vzpon: 850, bg: '#EEF2FF' },
  { ikona: '🗻', ime: 'Mangart', regija: 'Julijske Alpe', tezavnost: 'tezka', oznaka: 'Zahtevna', km: 14, vzpon: 1200, bg: '#FEE2E2' },
  { ikona: '🌄', ime: 'Šmarna gora', regija: 'Posavsko hribovje', tezavnost: 'lahka', oznaka: 'Lahka', km: 4, vzpon: 250, bg: '#F0FDF4' },
  { ikona: '🌿', ime: 'Golica', regija: 'Karavanke', tezavnost: 'srednja', oznaka: 'Srednja', km: 10, vzpon: 700, bg: '#ECFDF5' },
]

const FILTRI = ['Vse', 'Julijske Alpe', 'Kamniške Alpe', 'Karavanke', 'Lahka', 'Srednja', 'Zahtevna']

export default function Iskanje() {
  const [filter, setFilter] = useState('Vse')
  const [iskanje, setIskanje] = useState('')

  const poti = VSE_POTI.filter(p => {
    const ujema = p.ime.toLowerCase().includes(iskanje.toLowerCase()) ||
                  p.regija.toLowerCase().includes(iskanje.toLowerCase())
    if (!ujema) return false
    if (filter === 'Vse') return true
    return p.regija === filter || p.oznaka === filter
  })

  return (
    <div style={{ padding: 16 }}>

      {/* Iskalno polje */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', border: '0.5px solid var(--rob)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 14
      }}>
        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={iskanje}
          onChange={e => setIskanje(e.target.value)}
          placeholder="Išči pot, vrh, kočo..."
          style={{
            border: 'none', outline: 'none', fontSize: 15,
            flex: 1, background: 'transparent', color: 'var(--besedilo)'
          }}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {FILTRI.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20,
              border: '0.5px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
              background: filter === f ? 'var(--modra)' : 'white',
              color: filter === f ? 'white' : 'var(--besedilo2)',
              borderColor: filter === f ? 'var(--modra)' : 'var(--rob)',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Seznam poti */}
      {poti.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--besedilo2)' }}>
          Ni rezultatov za "{iskanje}"
        </div>
      )}
      {poti.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'white', borderRadius: 10, padding: 12,
          marginBottom: 8, border: '0.5px solid var(--rob)', cursor: 'pointer'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8, background: p.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0
          }}>{p.ikona}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {p.ime} <span className={`tezavnost ${p.tezavnost}`}>{p.oznaka}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 3 }}>
              {p.regija} · {p.vzpon} m vzpona
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--modra)' }}>{p.km} km</div>
        </div>
      ))}

    </div>
  )
}
