import React from 'react'

const hudPodatki = [
  { st: '3,2', enota: 'km', ime: 'preostalo' },
  { st: '47',  enota: 'min', ime: 'ETA' },
  { st: '1.847', enota: 'm', ime: 'nadm. višina' },
]

export default function Navigacija() {
  return (
    <div style={{ padding: 16 }}>

      {/* HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {hudPodatki.map((h, i) => (
          <div key={i} style={{
            background: 'var(--modra)', borderRadius: 10,
            padding: 10, textAlign: 'center', color: 'white'
          }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{h.st}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>{h.enota}</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{h.ime}</div>
          </div>
        ))}
      </div>

      {/* Profil višine */}
      <div className="kartica">
        <div className="kartica-naslov">Profil višine</div>
        <svg viewBox="0 0 340 80" style={{ width: '100%', height: 80 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#003DA5" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#003DA5" stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          <path
            d="M0,75 L20,70 L50,60 L80,45 L110,30 L130,20 L150,15 L170,18 L200,25 L230,35 L260,30 L290,20 L320,10 L340,8 L340,80 L0,80 Z"
            fill="url(#visGrad)"
          />
          <path
            d="M0,75 L20,70 L50,60 L80,45 L110,30 L130,20 L150,15 L170,18 L200,25 L230,35 L260,30 L290,20 L320,10 L340,8"
            fill="none" stroke="#003DA5" strokeWidth={2} strokeLinecap="round"
          />
          {/* Trenutna pozicija */}
          <circle cx="200" cy="25" r="4" fill="#003DA5"/>
          <line x1="200" y1="0" x2="200" y2="80" stroke="#003DA5" strokeWidth={1} strokeDasharray="3,3" opacity={0.4}/>
        </svg>
      </div>

      {/* Naslednja točka */}
      <div className="kartica" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28 }}>🏠</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Triglavski dom na Kredarici</div>
          <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginTop: 2 }}>580 m · ~25 min hoje</div>
        </div>
      </div>

      {/* ARSO opozorilo */}
      <div style={{
        background: '#FFF9C4', borderRadius: 12, padding: 14,
        border: '0.5px solid #F59E0B', marginBottom: 12
      }}>
        <div style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>⚠️ Vremensko opozorilo</div>
        <div style={{ fontSize: 12, color: '#92400E', marginTop: 4 }}>
          ARSO: možne nevihte po 16:00. Priporočen zgodnejši sestop.
        </div>
      </div>

      {/* SOS */}
      <button style={{
        width: '100%', background: 'var(--rdeca)', color: 'white',
        border: 'none', borderRadius: 10, padding: 14,
        fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px'
      }}>
        🆘 SOS — klic za pomoč
      </button>

    </div>
  )
}
