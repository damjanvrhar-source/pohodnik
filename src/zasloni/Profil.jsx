import React, { useState } from 'react'

const ZNACKE = [
  { ikona: '🏔️', ime: 'Triglavec', opis: 'Osvoji Triglav', zaklenjena: true },
  { ikona: '❄️', ime: 'Zimski osvajalec', opis: 'Pohod pozimi', zaklenjena: true },
  { ikona: '⚡', ime: 'Hitri pohodnik', opis: 'Pod 3h na 10km', zaklenjena: true },
  { ikona: '🌄', ime: 'Zgodnji ptič', opis: 'Pohod pred 6:00', zaklenjena: true },
  { ikona: '🧭', ime: 'Nav. maestro', opis: 'Uvozi GPX pot', zaklenjena: true },
  { ikona: '🦅', ime: 'Alpinist', opis: '10 zahtevnih poti', zaklenjena: true },
  { ikona: '🌙', ime: 'Nočni pohod', opis: 'Pohod ponoči', zaklenjena: true },
  { ikona: '💯', ime: '100 poti', opis: 'Opravi 100 pohodov', zaklenjena: true },
]

export default function Profil() {
  const [urejanje, setUrejanje] = useState(false)
  const [ime, setIme] = useState('')
  const [tempIme, setTempIme] = useState('')

  function zacniUrejanje() {
    setTempIme(ime)
    setUrejanje(true)
  }

  function shrani() {
    setIme(tempIme)
    setUrejanje(false)
  }

  return (
    <div style={{ padding: 16 }}>

      {/* Glava profila */}
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: ime ? 'var(--modra)' : '#E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: ime ? 28 : 32, color: 'white', fontWeight: 700,
          margin: '0 auto 10px'
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
                border: '1.5px solid var(--modra)', borderRadius: 8,
                padding: '8px 14px', fontSize: 15, textAlign: 'center',
                outline: 'none', width: 200
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={shrani} style={{
                background: 'var(--modra)', color: 'white',
                border: 'none', borderRadius: 8, padding: '8px 20px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>Shrani</button>
              <button onClick={() => setUrejanje(false)} style={{
                background: 'white', color: 'var(--besedilo2)',
                border: '0.5px solid var(--rob)', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, cursor: 'pointer'
              }}>Prekliči</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {ime || 'Neznani pohodnik'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--besedilo2)', marginTop: 2 }}>
              🥾 Začetnik · Nivo 1
            </div>
            <button onClick={zacniUrejanje} style={{
              marginTop: 10, background: 'white', color: 'var(--modra)',
              border: '1px solid var(--modra)', borderRadius: 8,
              padding: '6px 16px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer'
            }}>✏️ Uredi profil</button>
          </>
        )}
      </div>

      {/* Statistike */}
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <div className="stat"><div className="stat-st">0</div><div className="stat-ime">poti</div></div>
        <div className="stat"><div className="stat-st">0 km</div><div className="stat-ime">razdalja</div></div>
        <div className="stat"><div className="stat-st">0 m</div><div className="stat-ime">vzpon</div></div>
        <div className="stat"><div className="stat-st">0 h</div><div className="stat-ime">v naravi</div></div>
      </div>

      {/* Značke */}
      <div className="kartica">
        <div className="kartica-naslov">Značke — opravi pohode da jih odkleneš</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {ZNACKE.map((z, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 10, padding: '10px 6px',
              textAlign: 'center', border: '0.5px solid var(--rob)',
              opacity: 0.3
            }}>
              <div style={{ fontSize: 24 }}>{z.ikona}</div>
              <div style={{ fontSize: 9, color: 'var(--besedilo2)', marginTop: 4, lineHeight: 1.2 }}>{z.ime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Zgodovina */}
      <div className="kartica">
        <div className="kartica-naslov">Zadnje poti</div>
        <div style={{
          textAlign: 'center', padding: '20px 0',
          color: 'var(--besedilo2)', fontSize: 13
        }}>
          Še ni opravljenih pohodov. 🥾<br/>
          <span style={{ fontSize: 12 }}>Začni pohod v zavihku Iskanje!</span>
        </div>
      </div>

    </div>
  )
}
