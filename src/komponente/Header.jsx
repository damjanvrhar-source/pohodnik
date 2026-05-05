import React from 'react'

const stilji = {
  header: {
    height: 'var(--header-h)',
    background: 'linear-gradient(135deg, #1F5C1F 0%, #2D7A2D 60%, #3A9A3A 100%)',
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
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 9,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  proga: {
    position: 'fixed',
    top: 'var(--header-h)',
    left: 0,
    right: 0,
    height: 3,
    background: 'linear-gradient(90deg, #A8D5A8 0%, #5DBF5D 50%, #A8D5A8 100%)',
    zIndex: 100,
  }
}

export default function Header() {
  return (
    <>
      <header style={stilji.header}>
        <div>
          <div style={stilji.logo}>Pohodnik</div>
          <div style={stilji.tagline}>Razišči · Odkrij · Doživi</div>
        </div>
      </header>
      <div style={stilji.proga} />
    </>
  )
}
