import React, { useEffect, useState } from 'react'

function LogoSVG({ size = 120 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      background: 'linear-gradient(145deg, #3a9a3a, #1a5c1a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      border: '3px solid rgba(255,255,255,0.5)',
      position: 'relative', overflow: 'hidden',
    }}>
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100" fill="none">
        {/* Sonce / krog */}
        <circle cx="52" cy="38" r="26" stroke="rgba(180,255,140,0.5)" strokeWidth="1.5" fill="none"/>
        {/* Leva mala gora */}
        <polygon points="18,68 4,68 16,46" fill="rgba(255,255,255,0.6)"/>
        {/* Desna mala gora */}
        <polygon points="82,68 96,68 84,46" fill="rgba(255,255,255,0.6)"/>
        {/* Glavna gora */}
        <polygon points="50,14 76,68 24,68" fill="white"/>
        {/* Snežna kapa */}
        <polygon points="50,14 56,28 44,28" fill="rgba(210,245,210,0.5)"/>
        {/* Vijugasta pot */}
        <path d="M50 68 C46 75 54 80 50 87 C46 94 51 98 50 104" 
              stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
      </svg>
    </div>
  )
}

export default function SplashScreen({ onKonec }) {
  const [faza, setFaza] = useState('vstop')

  useEffect(() => {
    const t1 = setTimeout(() => setFaza('izhod'), 2800)
    const t2 = setTimeout(() => onKonec(), 3300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 28%, #2a6b2c 0%, #0f2410 55%, #060e07 100%)',
      opacity: faza === 'izhod' ? 0 : 1,
      transition: faza === 'izhod' ? 'opacity 0.5s ease' : 'none',
    }}>

      <div style={{
        animation: 'splashScaleIn 0.85s cubic-bezier(0.34,1.56,0.64,1) both',
        marginBottom: 24,
      }}>
        <LogoSVG size={120} />
      </div>

      <div style={{
        fontSize: 30, fontWeight: 800, color: '#fff',
        letterSpacing: '0.1em', lineHeight: 1,
        animation: 'splashFadeUp 0.9s 0.2s ease both', opacity: 0,
      }}>POHODNIK</div>

      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.38)',
        letterSpacing: '0.2em', marginTop: 8, fontWeight: 500,
        animation: 'splashFadeUp 0.9s 0.35s ease both', opacity: 0,
      }}>RAZIŠČI · ODKRIJ · DOŽIVI</div>

      <div style={{
        marginTop: 18, fontSize: 14,
        color: 'rgba(255,255,255,0.46)',
        fontStyle: 'italic', textAlign: 'center', lineHeight: 1.65,
        animation: 'splashFadeUp 0.9s 0.5s ease both', opacity: 0,
      }}>
        Tvoj najljubši sopotnik<br />v naravo.
      </div>

      <div style={{
        position: 'absolute', bottom: 52,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 10,
        animation: 'splashFadeIn 0.6s 1.2s ease both', opacity: 0,
      }}>
        <div style={{ width: 88, height: 1.5, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'rgba(255,255,255,0.4)', animation: 'splashLoadBar 1.8s 1.4s ease forwards', width: 0 }} />
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.16em' }}>NALAGANJE</div>
      </div>

      <style>{`
        @keyframes splashScaleIn { from { opacity:0; transform:scale(0.65); } to { opacity:1; transform:scale(1); } }
        @keyframes splashFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes splashFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes splashLoadBar { 0%{width:0} 65%{width:76%} 100%{width:100%} }
      `}</style>
    </div>
  )
}
