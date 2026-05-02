import React from 'react'

const znacke = [
  { ikona: '🏔️', ime: 'Triglavec', odklenjena: true },
  { ikona: '❄️', ime: 'Zimski osvajalec', odklenjena: true },
  { ikona: '⚡', ime: 'Hitri pohodnik', odklenjena: true },
  { ikona: '🌄', ime: 'Zgodnji ptič', odklenjena: true },
  { ikona: '🧭', ime: 'Nav. maestro', odklenjena: true },
  { ikona: '🦅', ime: 'Alpinist', odklenjena: false },
  { ikona: '🌙', ime: 'Nočni pohod', odklenjena: false },
  { ikona: '💯', ime: '100 poti', odklenjena: false },
]

const zgodovina = [
  { datum: '28. apr', ime: 'Šmarna gora', km: 4 },
  { datum: '20. apr', ime: 'Velika planina', km: 6 },
  { datum: '12. apr', ime: 'Stol — Karavanke', km: 12 },
  { datum: '1. apr',  ime: 'Triglav', km: 18 },
]

export default function Profil() {
  return (
    <div style={{ padding: 16 }}>

      {/* Glava profila */}
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--modra)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: 'white', fontWeight: 700,
          margin: '0 auto 10px'
        }}>A</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Andrej P.</div>
        <div style={{ fontSize: 13, color: 'var(--besedilo2)', marginTop: 2 }}>
          🥾 Izkušen pohodnik · Nivo 4
        </div>
      </div>

      {/* Statistike */}
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <div className="stat"><div className="stat-st">24</div><div className="stat-ime">poti</div></div>
        <div className="stat"><div className="stat-st">312 km</div><div className="stat-ime">razdalja</div></div>
        <div className="stat"><div className="stat-st">18.400 m</div><div className="stat-ime">vzpon</div></div>
        <div className="stat"><div className="stat-st">142 h</div><div className="stat-ime">v naravi</div></div>
      </div>

      {/* Značke */}
      <div className="kartica">
        <div className="kartica-naslov">Značke</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {znacke.map((z, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 10, padding: '10px 6px',
              textAlign: 'center', border: '0.5px solid var(--rob)',
              opacity: z.odklenjena ? 1 : 0.35
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
        {zgodovina.map((z, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0',
            borderBottom: i < zgodovina.length - 1 ? '0.5px solid var(--rob)' : 'none'
          }}>
            <div style={{ fontSize: 11, color: 'var(--besedilo2)', width: 50, flexShrink: 0 }}>{z.datum}</div>
            <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{z.ime}</div>
            <div style={{ fontSize: 12, color: 'var(--modra)', fontWeight: 600 }}>{z.km} km</div>
          </div>
        ))}
      </div>

    </div>
  )
}
