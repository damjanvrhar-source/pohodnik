import React from 'react'

export default function Header() {
  return (
    <>
      <header style={{
        height: 'var(--header-h)',
        background: 'linear-gradient(135deg, #1F5C1F 0%, #2D7A2D 60%, #3A9A3A 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        gap: 11,
      }}>
        <img
          src="/ikona-192.png"
          alt="Pohodnik"
          style={{
            width: 38, height: 38,
            borderRadius: 10,
            objectFit: 'cover',
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        />
        <div>
          <div style={{
            color: 'white', fontSize: 19, fontWeight: 800,
            letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1,
          }}>Pohodnik</div>
          <div style={{
            color: 'rgba(255,255,255,0.58)', fontSize: 9,
            letterSpacing: '1.4px', textTransform: 'uppercase', marginTop: 2,
          }}>Razišči · Odkrij · Doživi</div>
        </div>
      </header>
      <div style={{
        position: 'fixed', top: 'var(--header-h)',
        left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #A8D5A8 0%, #5DBF5D 50%, #A8D5A8 100%)',
        zIndex: 100,
      }} />
    </>
  )
}
