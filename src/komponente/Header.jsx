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
        gap: 10,
      }}>
        {/* Logo ikona — samo gorska silhueta iz slike */}
        <div style={{
          width: 40, height: 40,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.12)',
        }}>
          <img
            src="/logo.png"
            alt="Pohodnik"
            style={{
              width: 40, height: 40,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Besedilo */}
        <div>
          <div style={{
            color: 'white', fontSize: 20, fontWeight: 800,
            letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1,
          }}>Pohodnik</div>
          <div style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 9,
            letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2,
          }}>Razišči · Odkrij · Doživi</div>
        </div>
      </header>

      {/* Zelena proga */}
      <div style={{
        position: 'fixed', top: 'var(--header-h)',
        left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #A8D5A8 0%, #5DBF5D 50%, #A8D5A8 100%)',
        zIndex: 100,
      }} />
    </>
  )
}
