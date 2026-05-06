import React, { useEffect, useState } from 'react'

export default function Uvod({ onKonec }) {
  const [faza, setFaza] = useState(0)

  useEffect(() => {
    // Faza 1 — logotip se pojavi
    const t1 = setTimeout(() => setFaza(1), 300)
    // Faza 2 — slogan
    const t2 = setTimeout(() => setFaza(2), 900)
    // Faza 3 — fade out
    const t3 = setTimeout(() => setFaza(3), 2400)
    // Konec
    const t4 = setTimeout(() => onKonec(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg, #0A3D0A 0%, #1A5C1A 40%, #2D7A2D 75%, #3A9A3A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: faza === 3 ? 0 : 1,
      transition: faza === 3 ? 'opacity 0.5s ease' : 'none',
    }}>

      {/* Gore SVG ozadje */}
      <svg style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        width: '100%', height: '55%', opacity: 0.18,
      }} viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
        <polygon points="0,220 80,80 160,220" fill="white"/>
        <polygon points="60,220 160,40 260,220" fill="white"/>
        <polygon points="150,220 240,70 330,220" fill="white"/>
        <polygon points="240,220 320,100 400,220" fill="white"/>
        <polygon points="300,220 370,130 440,220" fill="white"/>
        {/* Sneg */}
        <polygon points="140,40 160,10 180,40 170,55 150,55" fill="rgba(255,255,255,0.6)"/>
        <polygon points="70,80 80,58 90,80 85,90 75,90" fill="rgba(255,255,255,0.5)"/>
        <polygon points="230,70 240,48 250,70 246,80 234,80" fill="rgba(255,255,255,0.5)"/>
      </svg>

      {/* Zvezde */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 45}%`,
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? 3 : 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          animation: `utrip ${1.5 + Math.random() * 2}s infinite alternate`,
        }}/>
      ))}

      {/* Logotip */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transform: faza >= 1 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)',
        opacity: faza >= 1 ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 1,
      }}>
        {/* Ikona */}
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, marginBottom: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          🏔️
        </div>

        {/* Ime */}
        <div style={{
          fontSize: 42, fontWeight: 800, color: 'white',
          letterSpacing: '3px', textTransform: 'uppercase',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          POHODNIK
        </div>
      </div>

      {/* Slogan */}
      <div style={{
        marginTop: 16, zIndex: 1,
        opacity: faza >= 2 ? 1 : 0,
        transform: faza >= 2 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,0.8)',
          letterSpacing: '3px', textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Razišči · Odkrij · Doživi
        </div>
      </div>

      {/* Loading dots */}
      <div style={{
        position: 'absolute', bottom: 60,
        display: 'flex', gap: 8,
        opacity: faza >= 2 ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            animation: `bounce 1s infinite ${i * 0.2}s`,
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes utrip {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
