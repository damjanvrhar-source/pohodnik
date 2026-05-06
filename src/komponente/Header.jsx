import React from 'react'

function LogoSVG() {
  return (
    <div style={{
      width: 38, height: 38,
      borderRadius: 9,
      background: 'linear-gradient(145deg, #3a9a3a, #1a5c1a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1.5px solid rgba(255,255,255,0.4)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      flexShrink: 0,
    }}>
      <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
        <circle cx="52" cy="38" r="26" stroke="rgba(180,255,140,0.5)" strokeWidth="2" fill="none"/>
        <polygon points="18,68 4,68 16,46" fill="rgba(255,255,255,0.6)"/>
        <polygon points="82,68 96,68 84,46" fill="rgba(255,255,255,0.6)"/>
        <polygon points="50,14 76,68 24,68" fill="white"/>
        <polygon points="50,14 56,28 44,28" fill="rgba(210,245,210,0.4)"/>
        <path d="M50 68 C46 75 54 80 50 87 C46 94 51 98 50 104" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9"/>
      </svg>
    </div>
  )
}

export default function Header() {
  return (
    <>
      <header style={{
        height: 'var(--header-h)',
        background: 'linear-gradient(135deg, #1F5C1F 0%, #2D7A2D 60%, #3A9A3A 100%)',
        display: 'flex', alignItems: 'center',
        padding: '0 14px', position: 'fixed',
        top: 0, left: 0, right: 0, zIndex: 100, gap: 11,
      }}>
        <LogoSVG />
        <div>
          <div style={{ color: 'white', fontSize: 19, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>Pohodnik</div>
          <div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 9, letterSpacing: '1.4px', textTransform: 'uppercase', marginTop: 2 }}>Razišči · Odkrij · Doživi</div>
        </div>
      </header>
      <div style={{ position: 'fixed', top: 'var(--header-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #A8D5A8 0%, #5DBF5D 50%, #A8D5A8 100%)', zIndex: 100 }} />
    </>
  )
}
