import React, { useEffect, useState } from 'react'

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

      <img
        src="/logo.png"
        alt="Pohodnik"
        style={{
          width: 120, height: 120,
          borderRadius: 26,
          objectFit: 'cover',
          marginBottom: 24,
          animation: 'splashScaleIn 0.85s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      />

      <div style={{
        fontSize: 30, fontWeight: 800, color: '#fff',
        letterSpacing: '0.1em', lineHeight: 1,
        animation: 'splashFadeUp 0.9s 0.2s ease both',
        opacity: 0,
      }}>
        POHODNIK
      </div>

      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.38)',
        letterSpacing: '0.2em', marginTop: 8, fontWeight: 500,
        animation: 'splashFadeUp 0.9s 0.35s ease both',
        opacity: 0,
      }}>
        RAZIŠČI · ODKRIJ · DOŽIVI
      </div>

      <div style={{
        marginTop: 18, fontSize: 14,
        color: 'rgba(255,255,255,0.46)',
        fontStyle: 'italic', textAlign: 'center', lineHeight: 1.65,
        animation: 'splashFadeUp 0.9s 0.5s ease both',
        opacity: 0,
      }}>
        Tvoj najljubši sopotnik<br />v naravo.
      </div>

      <div style={{
        position: 'absolute', bottom: 52,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 10,
        animation: 'splashFadeIn 0.6s 1.2s ease both',
        opacity: 0,
      }}>
        <div style={{
          width: 88, height: 1.5,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: 'rgba(255,255,255,0.4)',
            animation: 'splashLoadBar 1.8s 1.4s ease forwards',
            width: 0,
          }} />
        </div>
        <div style={{
          fontSize: 9, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.16em',
        }}>
          NALAGANJE
        </div>
      </div>

      <style>{`
        @keyframes splashScaleIn {
          from { opacity: 0; transform: scale(0.65); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes splashLoadBar {
          0%   { width: 0; }
          65%  { width: 76%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
