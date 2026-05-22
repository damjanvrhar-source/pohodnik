import React, { useState } from 'react'

const zavihki = [
  {
    id: 'domov',
    ime: 'Domov',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5z"
          fill={aktiven ? 'white' : 'none'}
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth={aktiven ? 0 : 1.8}
          strokeLinejoin="round"/>
        <path d="M9 21V13h6v8"
          stroke={aktiven ? 'rgba(45,122,45,0.8)' : 'rgba(255,255,255,0.55)'}
          strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'isci',
    ime: 'Išči',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
        <circle cx="10.5" cy="10.5" r="6.5"
          fill={aktiven ? 'white' : 'none'}
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth={aktiven ? 0 : 1.8}/>
        {aktiven && <circle cx="10.5" cy="10.5" r="3.5" fill="rgba(45,122,45,0.5)"/>}
        <path d="M15.5 15.5L20 20"
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'zemljevid',
    ime: 'Zemljevid',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
        <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6z"
          fill={aktiven ? 'white' : 'none'}
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth={aktiven ? 0 : 1.8}/>
        <circle cx="12" cy="8" r="2.2"
          fill={aktiven ? 'rgba(45,122,45,0.7)' : 'rgba(255,255,255,0.55)'}/>
      </svg>
    )
  },
  {
    id: 'profil',
    ime: 'Profil',
    ikona: (aktiven) => (
      <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
        <circle cx="12" cy="7" r="4"
          fill={aktiven ? 'white' : 'none'}
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth={aktiven ? 0 : 1.8}/>
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          fill={aktiven ? 'white' : 'none'}
          stroke={aktiven ? 'white' : 'rgba(255,255,255,0.55)'}
          strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
]

export default function BottomNav({ aktiven, onPreklop }) {
  const [pritisnjeno, setPritisnjeno] = useState(null)

  const [bouncing, setBouncing] = useState(null)

  function klik(id) {
    setPritisnjeno(id)
    setBouncing(id)
    setTimeout(() => setPritisnjeno(null), 300)
    setTimeout(() => setBouncing(null), 400)
    onPreklop(id)
  }

  return (
    <nav style={{
      height: 'var(--nav-h)',
      background: 'linear-gradient(180deg, #1A5C1A 0%, #123D12 100%)',
      display: 'flex',
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 100,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
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
              gap: 4, border: 'none',
              background: jeAktiven
                ? 'rgba(255,255,255,0.15)'
                : 'transparent',
              cursor: 'pointer',
              color: jeAktiven ? 'white' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.2s ease',
              padding: '6px 0 8px',
              transform: jePritisnjeno ? 'scale(0.85)' : 'scale(1)',
              borderTop: jeAktiven ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 28,
              filter: jeAktiven ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' : 'none',
              animation: bouncing === z.id ? 'navBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}>
              {z.ikona(jeAktiven)}
            </div>
            <span style={{
              fontSize: 10, fontWeight: jeAktiven ? 700 : 400,
              letterSpacing: '0.3px', textTransform: 'uppercase',
              color: jeAktiven ? 'white' : 'rgba(255,255,255,0.5)',
            }}>{z.ime}</span>
          </button>
        )
      })}
    </nav>
  )
}
