import React from 'react'

const stilji = {
  header: {
    height: 'var(--header-h)',
    background: 'var(--modra)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  zlata: { color: '#FFD700' },
  sub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginLeft: 'auto',
  },
  proga: {
    position: 'fixed',
    top: 'var(--header-h)',
    left: 0,
    right: 0,
    height: 3,
    background: 'linear-gradient(90deg, var(--modra) 0%, var(--modra) 33.3%, white 33.3%, white 66.6%, var(--rdeca) 66.6%)',
    zIndex: 100,
  }
}

export default function Header() {
  return (
    <>
      <header style={stilji.header}>
        <div style={stilji.logo}>
          Pohodnik
        </div>
        <div style={stilji.sub}>pohodni portal</div>
      </header>
      <div style={stilji.proga} />
    </>
  )
}
