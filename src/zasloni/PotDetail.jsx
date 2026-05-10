import React from 'react'

function izracunajCas(km, vzpon) {
  const ure = (parseFloat(km) / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

const IZHODISCA = {
  1: [
    { ime: 'Mojstrana — Aljažev dom', opis: 'Najpogostejša pot. Parkirišče pri Aljaževem domu v Vratih.', km: '18', vzpon: 1700, lat: 46.4181, lon: 13.8467, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Bohinj — Savica', opis: 'Najdaljša pot skozi Triglavska jezera. Parkirišče pri Savici.', km: '22', vzpon: 2000, lat: 46.2997, lon: 13.8681, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Trenta — Soška dolina', opis: 'Zahtevna pot iz Trente. Parkirišče v Trenti.', km: '20', vzpon: 1900, lat: 46.3833, lon: 13.6667, tezavnost: 'demanding_mountain_hiking' },
  ],
  2: [
    { ime: 'Mojstrana — Bambergova pot', opis: 'Bambergova pot — zahtevna alpinska pot skozi Triglavsko severno steno.', km: '20', vzpon: 1800, lat: 46.4181, lon: 13.8467, tezavnost: 'demanding_mountain_hiking' },
  ],
  3: [
    { ime: 'Sedlo Mangart', opis: 'Najkrajša pot. Parkirišče na sedlu Mangart.', km: '3', vzpon: 400, lat: 46.4333, lon: 13.6333, tezavnost: 'demanding_mountain_hiking' },
    { ime: 'Log pod Mangartom', opis: 'Daljša pot iz doline.', km: '14', vzpon: 1200, lat: 46.3833, lon: 13.6000, tezavnost: 'demanding_mountain_hiking' },
  ],
  4: [
    { ime: 'Dom v Tamarju', opis: 'Izhodišče pri Domu v Tamarju.', km: '16', vzpon: 1500, lat: 46.4694, lon: 13.7819, tezavnost: 'demanding_mountain_hiking' },
  ],
  5: [
    { ime: 'Kranjska Gora — Pristava', opis: 'Pot iz Kranjske Gore.', km: '15', vzpon: 1400, lat: 46.4833, lon: 13.9167, tezavnost: 'demanding_mountain_hiking' },
  ],
  38: [
    { ime: 'Kamnik — Preskar', opis: 'Peš pot iz Kamnika.', km: '6', vzpon: 800, lat: 46.2167, lon: 14.6167, tezavnost: 'hiking' },
    { ime: 'Gondola — Velika planina', opis: 'Z gondolo navzgor.', km: '3', vzpon: 100, lat: 46.3000, lon: 14.6167, tezavnost: 'hiking' },
  ],
  48: [
    { ime: 'Zelenica', opis: 'Najpogostejša pot. Parkirišče na Zelenici.', km: '5', vzpon: 600, lat: 46.4567, lon: 14.0844, tezavnost: 'mountain_hiking' },
    { ime: 'Jesenice', opis: 'Daljša pot iz Jesenic.', km: '12', vzpon: 1050, lat: 46.4333, lon: 14.0500, tezavnost: 'mountain_hiking' },
  ],
  62: [
    { ime: 'Tacen', opis: 'Najpogostejša pot. Parkirišče pri Tacnu.', km: '4', vzpon: 250, lat: 46.1000, lon: 14.4333, tezavnost: 'hiking' },
    { ime: 'Vikrče', opis: 'Pot iz Vikrč.', km: '5', vzpon: 300, lat: 46.1333, lon: 14.3833, tezavnost: 'hiking' },
  ],
}

function tezavnostInfo(t) {
  if (!t) return { razred: 'lahka', ime: 'Lahka', barva: '#065F46', ozadje: '#D1FAE5' }
  const s = t.toLowerCase()
  if (s.includes('demanding')) return { razred: 'tezka', ime: 'Zahtevna', barva: '#991B1B', ozadje: '#FEE2E2' }
  if (s.includes('mountain')) return { razred: 'srednja', ime: 'Srednja', barva: '#92400E', ozadje: '#FEF3C7' }
  return { razred: 'lahka', ime: 'Lahka', barva: '#065F46', ozadje: '#D1FAE5' }
}

function TezavnostPike({ razred }) {
  const barva = razred === 'tezka' ? '#991B1B' : razred === 'srednja' ? '#92400E' : '#065F46'
  const ozadje = razred === 'tezka' ? '#FEE2E2' : razred === 'srednja' ? '#FEF3C7' : '#D1FAE5'
  const filled = razred === 'tezka' ? 3 : razred === 'srednja' ? 2 : 1
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i <= filled ? barva : ozadje,
          border: `1px solid ${i <= filled ? barva : barva + '50'}`,
        }} />
      ))}
    </div>
  )
}

function StatChip({ ikona, vrednost, opis }) {
  return (
    <div style={{
      flex: 1, background: 'var(--zelena-sv)', borderRadius: 10,
      padding: '10px 8px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 16 }}>{ikona}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zelena)', marginTop: 2 }}>{vrednost}</div>
      <div style={{ fontSize: 10, color: 'var(--besedilo2)', marginTop: 1 }}>{opis}</div>
    </div>
  )
}

export default function PotDetail({ pot, onZacniNavigacijo, onNazaj }) {
  const izhodisca = IZHODISCA[pot.id] || [{
    ime: pot.regija + ' — standardno izhodišče',
    opis: 'Standardno izhodišče za to pot.',
    km: pot.dolzina,
    vzpon: pot.vzpon,
    lat: pot.lat,
    lon: pot.lon,
    tezavnost: pot.tezavnost,
  }]

  const tInfo = tezavnostInfo(pot.tezavnost)
  const cas = izracunajCas(pot.dolzina, pot.vzpon)

  return (
    <div style={{ padding: 16 }}>

      {/* Nazaj */}
      <style>{`
        @keyframes nazajPulse {
          0% { transform: translateX(0); }
          30% { transform: translateX(-5px); }
          60% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
        .nazaj-btn:hover { background: var(--zelena-sv) !important; transform: translateX(-3px); }
        .nazaj-btn:active { transform: scale(0.95) translateX(-3px) !important; }
      `}</style>
      <button
        className="nazaj-btn"
        onClick={onNazaj}
        style={{
          background: 'white', border: '1.5px solid var(--zelena)',
          cursor: 'pointer', color: 'var(--zelena)', fontSize: 13, fontWeight: 700,
          padding: '9px 16px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 7,
          borderRadius: 12, boxShadow: '0 2px 8px rgba(45,122,45,0.15)',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          animation: 'nazajPulse 1.5s ease 0.5s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
        </svg>
        Nazaj
      </button>

      {/* Hero kartica */}
      <div style={{
        background: 'linear-gradient(135deg, #174617 0%, #2f8f2f 100%)',
        borderRadius: 18, padding: '20px 18px', marginBottom: 16,
        color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 4, letterSpacing: '0.5px' }}>
          {pot.regija?.toUpperCase()}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          {pot.ime}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
            background: tInfo.ozadje, color: tInfo.barva,
          }}>{tInfo.ime}</span>
          <TezavnostPike razred={tInfo.razred} />
        </div>
      </div>

      {/* Statistike */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <StatChip ikona="📏" vrednost={`${pot.dolzina} km`} opis="razdalja" />
        <StatChip ikona="▲" vrednost={`${pot.vzpon} m`} opis="vzpon" />
        <StatChip ikona="⏱" vrednost={cas} opis="čas" />
      </div>

      {/* Izhodišča */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: 'var(--besedilo2)',
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10,
      }}>
        Izberi izhodišče in začni
      </div>

      {izhodisca.map((iz, i) => {
        const izInfo = tezavnostInfo(iz.tezavnost)
        const izCas = izracunajCas(iz.km, iz.vzpon)
        return (
          <div key={i} style={{
            background: 'white', borderRadius: 14, padding: 14,
            marginBottom: 10, border: '0.5px solid var(--rob)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700, flex: 1, paddingRight: 8 }}>
                📍 {iz.ime}
              </div>
              <span className={`tezavnost ${izInfo.razred}`}>{izInfo.ime}</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginBottom: 10, lineHeight: 1.5 }}>
              {iz.opis}
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 12, padding: '8px 0', borderTop: '0.5px solid var(--rob)' }}>
              <span style={{ fontSize: 12, color: 'var(--besedilo2)' }}>📏 {iz.km} km</span>
              <span style={{ fontSize: 12, color: 'var(--besedilo2)' }}>▲ {iz.vzpon} m</span>
              <span style={{ fontSize: 12, color: 'var(--besedilo2)' }}>⏱ {izCas}</span>
            </div>

            {/* Gumba */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${iz.lat},${iz.lon}&travelmode=driving`, '_blank')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: 'white', border: '1px solid var(--rob)',
                  color: 'var(--besedilo)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Do izhodišča
              </button>
              <button
                onClick={() => onZacniNavigacijo({ ...pot, ...iz })}
                style={{
                  flex: 2, padding: '10px',
                  background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  boxShadow: '0 4px 12px rgba(45,122,45,0.35)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Začni pohod + GPS
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
