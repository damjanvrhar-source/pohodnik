import React, { useState } from 'react'

const zavihki = [
  {
    id: 'domov',
    ime: 'Domov',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={aktiven ? 'rgba(255,255,255,0.3)' : 'none'}/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 'isci',
    ime: 'Išči',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}>
        <circle cx="11" cy="11" r="8" fill={aktiven ? 'rgba(255,255,255,0.2)' : 'none'}/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    )
  },
  {
    id: 'zemljevid',
    ime: 'Zemljevid',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={aktiven ? 'rgba(255,255,255,0.3)' : 'none'}/>
        <circle cx="12" cy="9" r="2.5" fill={aktiven ? 'white' : 'none'}/>
      </svg>
    )
  },
  {
    id: 'profil',
    ime: 'Profil',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4" fill={aktiven ? 'rgba(255,255,255,0.3)' : 'none'}/>
      </svg>
    )
  },
]

export default function BottomNav({ aktiven, onPreklop }) {
  const [pritisnjeno, setPritisnjeno] = useState(null)

  function klik(id) {
    setPritisnjeno(id)
    setTimeout(() => setPritisnjeno(null), 300)
    onPreklop(id)
  }

  return (
    <nav style={{
      height: 'var(--nav-h)',
      background: 'linear-gradient(180deg, #1A5C1A 0%, #145214 100%)',
      display: 'flex',
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 100,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
    }}>
      {zavihki.map(z => {
        const jeAktiven = aktiven === z.id
        const jePritisnjeno = pritisnjeno === z.id
        return (
          <button
            key={z.id}
            onClick={() => klik(z.id)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, border: 'none',
              background: jeAktiven
                ? 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)'
                : 'transparent',
              cursor: 'pointer',
              color: jeAktiven ? 'white' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.2s ease',
              padding: '6px 0',
              transform: jePritisnjeno ? 'scale(0.88)' : jeAktiven ? 'scale(1.05)' : 'scale(1)',
              borderTop: jeAktiven ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
              filter: jeAktiven ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
            }}
          >
            {z.ikona(jeAktiven)}
            <span style={{
              fontSize: 9, fontWeight: jeAktiven ? 700 : 400,
              letterSpacing: '0.4px', textTransform: 'uppercase',
            }}>{z.ime}</span>
          </button>
        )
      })}
    </nav>
  )
}
