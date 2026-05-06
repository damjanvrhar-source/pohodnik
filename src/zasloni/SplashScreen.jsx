import React, { useEffect, useState } from 'react'

const LOGO_B64 = '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'

export default function SplashScreen({ onKonec }) {
  const [faza, setFaza] = useState('vstop') // vstop | nalaganje | izhod

  useEffect(() => {
    // Po 2.8s začni izhod
    const t1 = setTimeout(() => setFaza('izhod'), 2800)
    // Po 3.3s pokliči onKonec
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

      {/* Logo ikona */}
      <img
        src={`data:image/jpeg;base64,${LOGO_B64}`}
        alt="Pohodnik"
        style={{
          width: 120, height: 120, borderRadius: 24,
          objectFit: 'cover', marginBottom: 24,
          animation: 'splashScaleIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      />

      {/* Ime */}
      <div style={{
        fontSize: 30, fontWeight: 800, color: '#fff',
        letterSpacing: '0.1em', lineHeight: 1,
        animation: 'splashFadeUp 0.8s 0.2s ease both',
        opacity: 0,
      }}>
        POHODNIK
      </div>

      {/* Podnapis */}
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.38)',
        letterSpacing: '0.2em', marginTop: 8, fontWeight: 500,
        animation: 'splashFadeUp 0.8s 0.35s ease both',
        opacity: 0,
      }}>
        RAZIŠČI · ODKRIJ · DOŽIVI
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 18, fontSize: 14,
        color: 'rgba(255,255,255,0.45)',
        fontStyle: 'italic', textAlign: 'center', lineHeight: 1.65,
        animation: 'splashFadeUp 0.8s 0.5s ease both',
        opacity: 0,
      }}>
        Tvoj najljubši sopotnik<br />v naravo.
      </div>

      {/* Nalagalna vrstica */}
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

      {/* CSS animacije */}
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
