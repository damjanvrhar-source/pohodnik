import React, { useState, useEffect, useRef } from 'react'

// ============================================================
// PODATKI — POTI
// ============================================================
const BAZA_POTI = [
  { id: 1,  ime: 'Triglav — standardna pot',    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '18', vzpon: 1700, lat: 46.3792, lon: 13.8367 },
  { id: 2,  ime: 'Triglav — Bambergova pot',    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '20', vzpon: 1800, lat: 46.3792, lon: 13.8367 },
  { id: 3,  ime: 'Mangart',                      regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1200, lat: 46.4333, lon: 13.6500 },
  { id: 4,  ime: 'Jalovec',                      regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.4167, lon: 13.7000 },
  { id: 5,  ime: 'Razor',                        regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1400, lat: 46.3833, lon: 13.8167 },
  { id: 6,  ime: 'Škrlatica',                    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '17', vzpon: 1600, lat: 46.3833, lon: 13.8667 },
  { id: 7,  ime: 'Prisojnik',                    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1300, lat: 46.3833, lon: 13.8500 },
  { id: 8,  ime: 'Špik',                         regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 13.8000 },
  { id: 9,  ime: 'Visoka Ponca',                 regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1250, lat: 46.4500, lon: 13.7333 },
  { id: 10, ime: 'Velika Mojstrovka',            regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '11', vzpon: 1100, lat: 46.4333, lon: 13.7667 },
  { id: 11, ime: 'Kanjavec',                     regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '13', vzpon: 1000, lat: 46.3500, lon: 13.8167 },
  { id: 12, ime: 'Bogatin',                      regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 900,  lat: 46.2833, lon: 13.8333 },
  { id: 13, ime: 'Krn',                          regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1100, lat: 46.2333, lon: 13.7167 },
  { id: 14, ime: 'Matajur',                      regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 850,  lat: 46.1833, lon: 13.5833 },
  { id: 15, ime: 'Rombon',                       regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.3167, lon: 13.5667 },
  { id: 16, ime: 'Črna prst',                   regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 800,  lat: 46.2667, lon: 13.9667 },
  { id: 17, ime: 'Soška pot',                    regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '25', vzpon: 300,  lat: 46.2500, lon: 13.6833 },
  { id: 18, ime: 'Bohinjsko jezero — Savica',    regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '6',  vzpon: 200,  lat: 46.2833, lon: 13.8667 },
  { id: 19, ime: 'Vogel',                        regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '5',  vzpon: 350,  lat: 46.2667, lon: 13.8333 },
  { id: 20, ime: 'Blejski vintgar',              regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '4',  vzpon: 80,   lat: 46.3900, lon: 14.0800 },
  { id: 21, ime: 'Pokljuka — krožna pot',        regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 200,  lat: 46.3333, lon: 13.9833 },
  { id: 22, ime: 'Grintovec',                    regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3667, lon: 14.5333 },
  { id: 23, ime: 'Kočna',                        regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1400, lat: 46.3833, lon: 14.5167 },
  { id: 24, ime: 'Skuta',                        regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1600, lat: 46.3500, lon: 14.5500 },
  { id: 25, ime: 'Ojstrica',                     regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1200, lat: 46.3333, lon: 14.5667 },
  { id: 26, ime: 'Velika planina',               regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '6',  vzpon: 380,  lat: 46.3167, lon: 14.6333 },
  { id: 27, ime: 'Planjava',                     regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 1000, lat: 46.3167, lon: 14.5833 },
  { id: 28, ime: 'Storžič',                      regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1100, lat: 46.4000, lon: 14.4667 },
  { id: 29, ime: 'Logarska dolina',              regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '8',  vzpon: 250,  lat: 46.3833, lon: 14.6333 },
  { id: 30, ime: 'Okrešelj',                     regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '7',  vzpon: 400,  lat: 46.3500, lon: 14.5833 },
  { id: 31, ime: 'Stol',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1050, lat: 46.4833, lon: 14.1167 },
  { id: 32, ime: 'Golica',                       regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 900,  lat: 46.4667, lon: 14.0333 },
  { id: 33, ime: 'Begunjščica',                  regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 1000, lat: 46.4333, lon: 14.2167 },
  { id: 34, ime: 'Košuta',                       regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '13', vzpon: 1100, lat: 46.4500, lon: 14.3333 },
  { id: 35, ime: 'Kepa',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.5000, lon: 13.9500 },
  { id: 36, ime: 'Jezerska Kočna',               regija: 'Karavanke',            tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1300, lat: 46.4167, lon: 14.5000 },
  { id: 37, ime: 'Peca',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 950,  lat: 46.5000, lon: 14.8833 },
  { id: 38, ime: 'Goška ravan',                  regija: 'Škofjeloško hribovje', tezavnost: 'hiking',                    dolzina: '8',  vzpon: 440,  lat: 46.3166, lon: 14.1328 },
  { id: 39, ime: 'Ratitovec',                    regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 850,  lat: 46.2333, lon: 14.0667 },
  { id: 40, ime: 'Blegoš',                       regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 700,  lat: 46.1833, lon: 14.0167 },
  { id: 41, ime: 'Šmarna gora',                  regija: 'Posavsko hribovje',    tezavnost: 'hiking',                    dolzina: '4',  vzpon: 250,  lat: 46.1872, lon: 14.4630 },
  { id: 42, ime: 'Kum',                          regija: 'Posavsko hribovje',    tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 800,  lat: 46.0833, lon: 15.0667 },
  { id: 43, ime: 'Nanos',                        regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '7',  vzpon: 450,  lat: 45.7667, lon: 14.0333 },
  { id: 44, ime: 'Snežnik',                      regija: 'Primorska',            tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 900,  lat: 45.5833, lon: 14.4500 },
  { id: 45, ime: 'Slavnik',                      regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 500,  lat: 45.5333, lon: 13.9667 },
  { id: 46, ime: 'Rogla',                        regija: 'Pohorje',              tezavnost: 'hiking',                    dolzina: '6',  vzpon: 300,  lat: 46.4500, lon: 15.3333 },
  { id: 47, ime: 'Trdinov vrh',                  regija: 'Dolenjska',            tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 700,  lat: 45.8167, lon: 15.2333 },
  { id: 48, ime: 'Menina planina',               regija: 'Savinjske Alpe',       tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 700,  lat: 46.2500, lon: 14.7833 },
  { id: 49, ime: 'Raduha',                       regija: 'Savinjske Alpe',       tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 14.7333 },
  { id: 50, ime: 'Donačka gora',                 regija: 'Štajerska',            tezavnost: 'hiking',                    dolzina: '6',  vzpon: 350,  lat: 46.3167, lon: 15.8167 },
]

// ============================================================
// PODATKI — KOČE
// ============================================================
const BAZA_KOC = [
  { id: 1,  ime: 'Triglavski dom na Kredarici',     visina: 2515, regija: 'Julijske Alpe',        tel: '+38645740574',  lezisca: 130, odprta: 'Jul–Sep',  lat: 46.3792, lon: 13.8367, km: 9,  vzpon: 1400 },
  { id: 2,  ime: 'Aljažev dom v Vratih',            visina: 1015, regija: 'Julijske Alpe',        tel: '+38645898360',  lezisca: 80,  odprta: 'Cel leto', lat: 46.4167, lon: 13.8500, km: 0,  vzpon: 0    },
  { id: 3,  ime: 'Dom Planika pod Triglavom',       visina: 2401, regija: 'Julijske Alpe',        tel: '+38645741574',  lezisca: 60,  odprta: 'Jul–Sep',  lat: 46.3750, lon: 13.8400, km: 7,  vzpon: 1200 },
  { id: 4,  ime: 'Koča pri Triglavskih jezerih',    visina: 1685, regija: 'Julijske Alpe',        tel: '+38645723170',  lezisca: 50,  odprta: 'Jun–Sep',  lat: 46.3333, lon: 13.8000, km: 6,  vzpon: 700  },
  { id: 5,  ime: 'Vodnikov dom na Velem polju',     visina: 1817, regija: 'Julijske Alpe',        tel: '+38645721182',  lezisca: 70,  odprta: 'Jun–Oct',  lat: 46.3667, lon: 13.8500, km: 5,  vzpon: 900  },
  { id: 6,  ime: 'Dom v Tamarju',                   visina: 1108, regija: 'Julijske Alpe',        tel: '+38645890050',  lezisca: 40,  odprta: 'Cel leto', lat: 46.4667, lon: 13.7833, km: 4,  vzpon: 200  },
  { id: 7,  ime: 'Erjavčeva koča na Vršiču',       visina: 1515, regija: 'Julijske Alpe',        tel: '+38645881050',  lezisca: 60,  odprta: 'Maj–Oct',  lat: 46.4333, lon: 13.7500, km: 1,  vzpon: 50   },
  { id: 8,  ime: 'Dom na Komni',                    visina: 1520, regija: 'Julijske Alpe',        tel: '+38645725100',  lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.2667, lon: 13.8333, km: 5,  vzpon: 800  },
  { id: 9,  ime: 'Cojzova koča na Kokrskem sedlu', visina: 1793, regija: 'Kamniške Alpe',        tel: '+38642525010',  lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.3833, lon: 14.5500, km: 5,  vzpon: 900  },
  { id: 10, ime: 'Češka koča na Spodnjih Ravneh',  visina: 1543, regija: 'Kamniške Alpe',        tel: '+38648391600',  lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.3500, lon: 14.5667, km: 4,  vzpon: 700  },
  { id: 11, ime: 'Koča na Veliki planini',          visina: 1666, regija: 'Kamniške Alpe',        tel: '+38642523100',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3167, lon: 14.6333, km: 3,  vzpon: 380  },
  { id: 12, ime: 'Dom v Logarski dolini',           visina: 785,  regija: 'Kamniške Alpe',        tel: '+38638395000',  lezisca: 30,  odprta: 'Apr–Oct',  lat: 46.3833, lon: 14.6333, km: 1,  vzpon: 50   },
  { id: 13, ime: 'Dom na Stolu',                    visina: 1685, regija: 'Karavanke',            tel: '+38645727000',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.4833, lon: 14.1167, km: 4,  vzpon: 700  },
  { id: 14, ime: 'Koča na Zelenici',                visina: 1537, regija: 'Karavanke',            tel: '+38645728000',  lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.4500, lon: 14.0833, km: 2,  vzpon: 300  },
  { id: 15, ime: 'Planinska koča na Golici',        visina: 1582, regija: 'Karavanke',            tel: '+38645729000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4667, lon: 14.0333, km: 3,  vzpon: 500  },
  { id: 16, ime: 'Dom na Begunjščici',              visina: 1657, regija: 'Karavanke',            tel: '+38645321000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4333, lon: 14.2167, km: 4,  vzpon: 700  },
  { id: 17, ime: 'Dom na Uršlji gori',              visina: 1699, regija: 'Karavanke',            tel: '+38628241000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.5167, lon: 14.7833, km: 4,  vzpon: 600  },
  { id: 18, ime: 'Planinska koča na Ratitovcu',    visina: 1667, regija: 'Škofjeloško hribovje', tel: '+38645121000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2333, lon: 14.0667, km: 4,  vzpon: 700  },
  { id: 19, ime: 'Dom na Goški ravni',              visina: 933,  regija: 'Škofjeloško hribovje', tel: '+38645123000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3166, lon: 14.1328, km: 3,  vzpon: 440  },
  { id: 20, ime: 'Dom na Šmarni gori',              visina: 669,  regija: 'Posavsko hribovje',    tel: '+38615611000',  lezisca: 30,  odprta: 'Cel leto', lat: 46.1872, lon: 14.4630, km: 2,  vzpon: 250  },
  { id: 21, ime: 'Koča na Kumu',                    visina: 1220, regija: 'Posavsko hribovje',    tel: '+38618981000',  lezisca: 35,  odprta: 'Jun–Oct',  lat: 46.0833, lon: 15.0667, km: 5,  vzpon: 700  },
  { id: 22, ime: 'Koča na Nanosu',                  visina: 1262, regija: 'Primorska',            tel: '+38653641000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 45.7667, lon: 14.0333, km: 3,  vzpon: 450  },
  { id: 23, ime: 'Dom na Snežniku',                 visina: 1796, regija: 'Primorska',            tel: '+38617071000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5833, lon: 14.4500, km: 5,  vzpon: 700  },
  { id: 24, ime: 'Dom na Slavniku',                 visina: 1028, regija: 'Primorska',            tel: '+38656721000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5333, lon: 13.9667, km: 4,  vzpon: 500  },
  { id: 25, ime: 'Koča na Črnem vrhu',              visina: 1543, regija: 'Pohorje',              tel: '+38626031000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.5000, lon: 15.3833, km: 4,  vzpon: 400  },
  { id: 26, ime: 'Dom na Rogli',                    visina: 1517, regija: 'Pohorje',              tel: '+38637571000',  lezisca: 50,  odprta: 'Cel leto', lat: 46.4500, lon: 15.3333, km: 3,  vzpon: 300  },
  { id: 27, ime: 'Koča na Trdinov vrh',             visina: 1178, regija: 'Dolenjska',            tel: '+38673841000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.8167, lon: 15.2333, km: 4,  vzpon: 500  },
  { id: 28, ime: 'Dom na Menini',                   visina: 1508, regija: 'Savinjske Alpe',       tel: '+38638398000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2500, lon: 14.7833, km: 4,  vzpon: 600  },
  { id: 29, ime: 'Dom na Pokljuki',                 visina: 1330, regija: 'Gorenjska',            tel: '+38645720100',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3333, lon: 13.9833, km: 2,  vzpon: 200  },
  { id: 30, ime: 'Koča pri Savici',                 visina: 653,  regija: 'Gorenjska',            tel: '+38645723456',  lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.2833, lon: 13.8667, km: 1,  vzpon: 100  },
]

// ============================================================
// POMOŽNE FUNKCIJE
// ============================================================
function tezavnostInfo(t) {
  if (!t) return { razred: 'lahka', ime: 'Lahka' }
  const s = t.toLowerCase()
  if (s.includes('demanding')) return { razred: 'tezka', ime: 'Zahtevna' }
  if (s.includes('mountain'))  return { razred: 'srednja', ime: 'Srednja' }
  return { razred: 'lahka', ime: 'Lahka' }
}

function izracunajCas(km, vzpon) {
  const ure = (parseFloat(km) / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

function odpriNavig(k) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${k.lat},${k.lon}&travelmode=driving`, '_blank')
}

function VisinaBadge({ visina }) {
  const barva  = visina > 2000 ? '#991B1B' : visina > 1500 ? '#92400E' : '#065F46'
  const ozadje = visina > 2000 ? '#FEE2E2' : visina > 1500 ? '#FEF3C7' : '#D1FAE5'
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: ozadje, color: barva }}>{visina} m</span>
}

const REGIJE_POTI = ['Vse', ...new Set(BAZA_POTI.map(p => p.regija))]
const REGIJE_KOC  = ['Vse', ...new Set(BAZA_KOC.map(k => k.regija))]

// ============================================================
// GLAVNI KOMPONENTI
// ============================================================
export default function Isci({ onOdpriPot, onPotDoKoce }) {
  const [tab, setTab] = useState('poti')
  const [iskanje, setIskanje] = useState('')
  const [tezavnost, setTezavnost] = useState('Vse')
  const [regija, setRegija] = useState('Vse')
  const inputRef = useRef(null)

  // Reset filtrov ob menjavi taba
  useEffect(() => { setIskanje(''); setTezavnost('Vse'); setRegija('Vse') }, [tab])

  const filtriranePoti = BAZA_POTI.filter(p => {
    const q = iskanje.toLowerCase()
    const ujema = p.ime.toLowerCase().includes(q) || p.regija.toLowerCase().includes(q)
    const tInfo = tezavnostInfo(p.tezavnost)
    const tOk = tezavnost === 'Vse' || tInfo.ime === tezavnost
    const rOk = regija === 'Vse' || p.regija === regija
    return ujema && tOk && rOk
  })

  const filtrirane_koce = BAZA_KOC.filter(k => {
    const q = iskanje.toLowerCase()
    const ujema = k.ime.toLowerCase().includes(q) || k.regija.toLowerCase().includes(q)
    const rOk = regija === 'Vse' || k.regija === regija
    return ujema && rOk
  })

  const steviloRezultatov = tab === 'poti' ? filtriranePoti.length : filtrirane_koce.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Glava — fiksna */}
      <div style={{ padding: '14px 14px 0', background: 'var(--ozadje)', flexShrink: 0 }}>

        {/* Iskalno polje */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'white', border: '0.5px solid var(--rob)',
          borderRadius: 12, padding: '11px 14px', marginBottom: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={iskanje}
            onChange={e => setIskanje(e.target.value)}
            placeholder={tab === 'poti' ? 'Išči pot ali vrh...' : 'Išči kočo ali regijo...'}
            style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, background: 'transparent', color: 'var(--besedilo)' }}
          />
          {iskanje && (
            <button onClick={() => setIskanje('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--besedilo2)', fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'white', borderRadius: 10, padding: 3, border: '0.5px solid var(--rob)', marginBottom: 10 }}>
          {['poti', 'koce'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: tab === t ? 'var(--zelena)' : 'transparent',
              color: tab === t ? 'white' : 'var(--besedilo2)',
              transition: 'all 0.2s',
            }}>
              {t === 'poti' ? `⛰ Poti (${BAZA_POTI.length})` : `🏠 Koče (${BAZA_KOC.length})`}
            </button>
          ))}
        </div>

        {/* Filtri */}
        {tab === 'poti' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {['Vse', 'Lahka', 'Srednja', 'Zahtevna'].map(f => (
              <button key={f} onClick={() => setTezavnost(f)} style={{
                flexShrink: 0, padding: '4px 12px', borderRadius: 20,
                border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                background: tezavnost === f ? 'var(--zelena)' : 'white',
                color: tezavnost === f ? 'white' : 'var(--besedilo2)',
                borderColor: tezavnost === f ? 'var(--zelena)' : 'var(--rob)',
              }}>{f}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {(tab === 'poti' ? REGIJE_POTI : REGIJE_KOC).map(r => (
            <button key={r} onClick={() => setRegija(r)} style={{
              flexShrink: 0, padding: '4px 11px', borderRadius: 20,
              border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: regija === r ? '#1F5C1F' : 'white',
              color: regija === r ? 'white' : 'var(--besedilo2)',
              borderColor: regija === r ? '#1F5C1F' : 'var(--rob)',
            }}>{r}</button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--besedilo2)', marginBottom: 8, fontWeight: 500 }}>
          {steviloRezultatov} {tab === 'poti' ? 'poti' : 'koč'}
          {iskanje && ` za "${iskanje}"`}
        </div>
      </div>

      {/* Seznam — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px' }}>

        {steviloRezultatov === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--besedilo2)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ni rezultatov</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Poskusi drugačen iskalni niz</div>
          </div>
        )}

        {/* POTI */}
        {tab === 'poti' && filtriranePoti.map(p => {
          const info = tezavnostInfo(p.tezavnost)
          const cas = izracunajCas(p.dolzina, p.vzpon)
          return (
            <div key={p.id}
              onClick={() => onOdpriPot && onOdpriPot(p)}
              style={{
                background: 'white', borderRadius: 14, padding: '13px 14px',
                marginBottom: 9, border: '0.5px solid var(--rob)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                transition: 'box-shadow 0.15s',
              }}
              onTouchStart={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
              onTouchEnd={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--zelena-sv)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>⛰️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {p.ime}
                  <span className={`tezavnost ${info.razred}`}>{info.ime}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--besedilo2)' }}>
                  {p.regija} · {p.dolzina} km · ↑{p.vzpon} m · ⏱ {cas}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--besedilo2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          )
        })}

        {/* KOČE */}
        {tab === 'koce' && filtrirane_koce.map(k => (
          <div key={k.id} style={{
            background: 'white', borderRadius: 14, padding: '13px 14px',
            marginBottom: 9, border: '0.5px solid var(--rob)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 8 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--zelena-sv)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>🏠</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{k.ime}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--zelena)', fontWeight: 600 }}>{k.regija}</span>
                  <VisinaBadge visina={k.visina} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, paddingBottom: 10, borderBottom: '0.5px solid var(--rob)' }}>
              {k.km > 0 && (
                <span style={{ fontSize: 11, background: '#F0FAF0', color: 'var(--zelena-t)', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>
                  📏 {k.km} km · ↑{k.vzpon} m · ⏱ {izracunajCas(k.km, k.vzpon)}
                </span>
              )}
              <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>🛏 {k.lezisca}</span>
              <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>📅 {k.odprta}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`tel:${k.tel}`} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px', background: 'var(--zelena-sv)', borderRadius: 8,
                textDecoration: 'none', color: 'var(--zelena-t)', fontSize: 12, fontWeight: 600,
              }}>📞 Pokliči</a>
              <button onClick={() => odpriNavig(k)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px', background: 'white', borderRadius: 8,
                border: '0.5px solid var(--rob)', color: 'var(--besedilo)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Navigacija
              </button>
              <button onClick={() => onPotDoKoce && onPotDoKoce(k)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px', background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
                borderRadius: 8, border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>▶ Pot</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
