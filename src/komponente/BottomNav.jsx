import React from 'react'

const zavihki = [
  {
    id: 'domov',
    ime: 'Domov',
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 'iskanje',
    ime: 'Iskanje',
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    )
  },
  {
    id: 'zemljevid',
    ime: 'Zemljevid',
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    )
  },
  {
    id: 'navigacija',
    ime: 'Navigacija',
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    )
  },
  {
    id: 'profil',
    ime: 'Profil',
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
]

const stilji = {
  nav: {
    height: 'var(--nav-h)',
    background: 'var(--modra)',
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderTop: '2px solid var(--rdeca)',
  },
  gumb: (aktiven) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: aktiven ? 'white' : 'rgba(255,255,255,0.45)',
    transition: 'color 0.15s',
    padding: 0,
  }),
  oznaka: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.3px',
  }
}

export default function BottomNav({ aktiven, onPreklop }) {
  return (
    <nav style={stilji.nav}>
      {zavihki.map(z => (
        <button
          key={z.id}
          style={stilji.gumb(aktiven === z.id)}
          onClick={() => onPreklop(z.id)}
        >
          {z.ikona}
          <span style={stilji.oznaka}>{z.ime}</span>
        </button>
      ))}
    </nav>
  )
}
