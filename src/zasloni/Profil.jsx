import React, { useState, useEffect } from 'react'

export default function Profil() {
  const [urejanje, setUrejanje] = useState(false)
  const [ime, setIme] = useState('')
  const [tempIme, setTempIme] = useState('')

  useEffect(() => {
    const shranjeno = localStorage.getItem('pohodnik_ime')
    if (shranjeno) setIme(shranjeno)
  }, [])

  function zacniUrejanje() { setTempIme(ime); setUrejanje(true) }

  function shrani() {
    setIme(tempIme)
    localStorage.setItem('pohodnik_ime', tempIme)
    setUrejanje(false)
  }

  return (
    <div style={{ padding: 16 }}>

      {/* Hero kartica */}
      <div style={{
        background: 'linear-gradient(135deg, #174617 0%, #2f8f2f 100%)',
        borderRadius: 18, padding: '28px 20px 22px',
        marginBottom: 16, textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '3px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: ime ? 32 : 34, color: 'white', fontWeight: 800,
          margin: '0 auto 14px',
        }}>
          {ime ? ime.charAt(0).toUpperCase() : '👤'}
        </div>

        {urejanje ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <input
              value={tempIme}
              onChange={e => setTempIme(e.target.value)}
              placeholder="Vpiši svoje ime..."
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.5)',
                borderRadius: 8, padding: '8px 14px',
                fontSize: 15, textAlign: 'center',
                outline: 'none', width: 200, color: 'white',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={shrani} style={{
                background: 'rgba(255,255,255,0.9)', color: '#1F5C1F',
                border: 'none', borderRadius: 8, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>Shrani</button>
              <button onClick={() => setUrejanje(false)} style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, cursor: 'pointer',
              }}>Prekliči</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              {ime || 'Neznani pohodnik'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
              🥾 Pohodnik · Slovenija
            </div>
            <button onClick={zacniUrejanje} style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: 'white', borderRadius: 8,
              padding: '7px 18px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}>✏️ Uredi profil</button>
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat"><div className="stat-st">0</div><div className="stat-ime">poti</div></div>
        <div className="stat"><div className="stat-st">0 km</div><div className="stat-ime">razdalja</div></div>
        <div className="stat"><div className="stat-st">0 m</div><div className="stat-ime">vzpon</div></div>
        <div className="stat"><div className="stat-st">0 h</div><div className="stat-ime">v naravi</div></div>
      </div>

      {/* Zgodovina */}
      <div style={{
        background: 'white', borderRadius: 14, padding: 14,
        border: '0.5px solid var(--rob)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--besedilo2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
          Zadnje poti
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🥾</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--besedilo)', marginBottom: 4 }}>
            Še ni opravljenih pohodov
          </div>
          <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>
            Začni pohod v zavihku Iskanje!
          </div>
        </div>
      </div>

    </div>
  )
}
