import React, { useState, useEffect } from 'react'

function formatCas(s) {
  if (!s || s === 0) return '0 h'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

function formatRazd(m) {
  if (!m || m === 0) return '0 m'
  if (m < 1000) return `${m} m`
  return `${(m / 1000).toFixed(1)} km`
}

function formatDatum(datum) {
  return datum
}

export default function Profil() {
  const [urejanje, setUrejanje] = useState(false)
  const [ime, setIme] = useState('')
  const [tempIme, setTempIme] = useState('')
  const [pohodi, setPohodi] = useState([])
  const [stats, setStats] = useState({ poti: 0, razdalja: 0, vzpon: 0, cas: 0 })

  useEffect(() => {
    const shranjeno = localStorage.getItem('pohodnik_ime')
    if (shranjeno) setIme(shranjeno)

    try {
      const p = JSON.parse(localStorage.getItem('pohodnik_pohodi') || '[]')
      setPohodi(p)
      const s = JSON.parse(localStorage.getItem('pohodnik_stats') || '{"poti":0,"razdalja":0,"vzpon":0,"cas":0}')
      setStats(s)
    } catch(e) {}
  }, [])

  function zacniUrejanje() { setTempIme(ime); setUrejanje(true) }

  function shrani() {
    setIme(tempIme)
    localStorage.setItem('pohodnik_ime', tempIme)
    setUrejanje(false)
  }

  function izbrisiPohode() {
    if (window.confirm('Izbriši vse pohode?')) {
      localStorage.removeItem('pohodnik_pohodi')
      localStorage.removeItem('pohodnik_stats')
      setPohodi([])
      setStats({ poti: 0, razdalja: 0, vzpon: 0, cas: 0 })
    }
  }

  return (
    <div style={{ padding: 16 }}>

      {/* Hero kartica */}
      <div style={{
        background: 'linear-gradient(135deg, #174617 0%, #2f8f2f 100%)',
        borderRadius: 20, padding: '28px 20px 22px',
        marginBottom: 16, textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        animation: 'fadeSlideUp 0.4s ease both',
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '3px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: ime ? 34 : 36, color: 'white', fontWeight: 900,
          margin: '0 auto 14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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
                borderRadius: 10, padding: '8px 14px',
                fontSize: 15, textAlign: 'center',
                outline: 'none', width: 200, color: 'white',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={shrani} style={{
                background: 'rgba(255,255,255,0.9)', color: '#1F5C1F',
                border: 'none', borderRadius: 10, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Shrani</button>
              <button onClick={() => setUrejanje(false)} style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10,
                padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}>Prekliči</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 23, fontWeight: 900, color: 'white', marginBottom: 4 }}>
              {ime || 'Neznani pohodnik'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
              🥾 {stats.poti} {stats.poti === 1 ? 'pohod' : stats.poti < 5 ? 'pohodi' : 'pohodov'}
            </div>
            <button onClick={zacniUrejanje} style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: 'white', borderRadius: 10,
              padding: '7px 18px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>✏️ Uredi profil</button>
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat delay-1">
          <div className="stat-st">{stats.poti}</div>
          <div className="stat-ime">poti</div>
        </div>
        <div className="stat delay-2">
          <div className="stat-st">{formatRazd(stats.razdalja)}</div>
          <div className="stat-ime">skupna razdalja</div>
        </div>
        <div className="stat delay-3">
          <div className="stat-st">{stats.vzpon > 0 ? `${stats.vzpon} m` : '0 m'}</div>
          <div className="stat-ime">skupni vzpon</div>
        </div>
        <div className="stat delay-4">
          <div className="stat-st">{formatCas(stats.cas)}</div>
          <div className="stat-ime">skupni čas</div>
        </div>
      </div>

      {/* Zgodovina pohodov */}
      <div style={{
        background: 'white', borderRadius: 18, padding: 16,
        border: '0.5px solid var(--rob)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        animation: 'fadeSlideUp 0.5s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--besedilo2)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Opravljeni pohodi
          </div>
          {pohodi.length > 0 && (
            <button onClick={izbrisiPohode} style={{
              fontSize: 11, color: '#991B1B', background: '#FEE2E2',
              border: 'none', borderRadius: 6, padding: '3px 8px',
              cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
            }}>Izbriši vse</button>
          )}
        </div>

        {pohodi.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🥾</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--besedilo)', marginBottom: 4 }}>
              Še ni opravljenih pohodov
            </div>
            <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>
              Začni pohod v zavihku Išči!
            </div>
          </div>
        ) : (
          <div>
            {pohodi.map((p, i) => (
              <div key={p.id} style={{
                padding: '12px 0',
                borderBottom: i < pohodi.length - 1 ? '0.5px solid var(--rob)' : 'none',
                animation: `fadeSlideUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3, color: 'var(--besedilo)' }}>
                      🏔 {p.ime}
                    </div>
                    {p.regija && (
                      <div style={{ fontSize: 11, color: 'var(--zelena)', fontWeight: 600, marginBottom: 4 }}>
                        {p.regija}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--besedilo2)' }}>📏 {formatRazd(p.razdalja)}</span>
                      <span style={{ fontSize: 11, color: 'var(--besedilo2)' }}>⏱ {formatCas(p.cas)}</span>
                      {p.vzpon > 0 && <span style={{ fontSize: 11, color: 'var(--besedilo2)' }}>▲ {p.vzpon} m</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--besedilo2)', fontWeight: 500, marginLeft: 8, flexShrink: 0 }}>
                    {p.datum}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
