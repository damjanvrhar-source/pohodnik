import React, { useState, useEffect } from 'react'

const FILTRI = ['Vse', 'Lahka', 'Srednja', 'Zahtevna']
const REGIJE_FILTER = ['Vse regije', 'Julijske Alpe', 'Kamniške Alpe', 'Karavanke', 'Škofjeloško hribovje', 'Posavsko hribovje', 'Primorska', 'Pohorje', 'Dolenjska', 'Savinjske Alpe', 'Gorenjska']

function tezavnostBadge(t) {
  if (!t) return null
  const s = t.toLowerCase()
  if (s.includes('demanding') || s.includes('zahtev') || s.includes('alpine')) return { razred: 'tezka', ime: 'Zahtevna' }
  if (s.includes('mountain') || s.includes('srednja')) return { razred: 'srednja', ime: 'Srednja' }
  if (s.includes('hiking') || s.includes('lahk')) return { razred: 'lahka', ime: 'Lahka' }
  return null
}

function izracunajCas(km, vzpon) {
  const ure = (parseFloat(km) / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

function TezavnostPike({ razred }) {
  const barva = razred === 'tezka' ? '#991B1B' : razred === 'srednja' ? '#92400E' : '#065F46'
  const ozadje = razred === 'tezka' ? '#FEE2E2' : razred === 'srednja' ? '#FEF3C7' : '#D1FAE5'
  const filled = razred === 'tezka' ? 3 : razred === 'srednja' ? 2 : 1
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= filled ? barva : ozadje,
          border: `1px solid ${i <= filled ? barva : barva + '40'}`,
        }} />
      ))}
    </div>
  )
}

const BAZA_POTI = [
  // JULIJSKE ALPE - zahtevne
  { id: 1,  ime: 'Triglav — standardna pot',    regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '18', vzpon: 1700, lat: 46.3792, lon: 13.8367 },
  { id: 2,  ime: 'Triglav — Bambergova pot',    regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '20', vzpon: 1800, lat: 46.3792, lon: 13.8367 },
  { id: 3,  ime: 'Mangart',                      regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1200, lat: 46.4333, lon: 13.6500 },
  { id: 4,  ime: 'Jalovec',                      regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.4167, lon: 13.7000 },
  { id: 5,  ime: 'Razor',                        regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1400, lat: 46.3833, lon: 13.8167 },
  { id: 6,  ime: 'Škrlatica',                    regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '17', vzpon: 1600, lat: 46.3833, lon: 13.8667 },
  { id: 7,  ime: 'Prisojnik',                    regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1300, lat: 46.3833, lon: 13.8500 },
  { id: 8,  ime: 'Špik',                         regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 13.8000 },
  { id: 9,  ime: 'Visoka Ponca',                 regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1250, lat: 46.4500, lon: 13.7333 },
  { id: 10, ime: 'Velika Mojstrovka',            regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '11', vzpon: 1100, lat: 46.4333, lon: 13.7667 },
  { id: 11, ime: 'Mala Mojstrovka',              regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '10', vzpon: 1000, lat: 46.4300, lon: 13.7700 },
  { id: 12, ime: 'Zadnjica — Triglav',           regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '22', vzpon: 1900, lat: 46.3900, lon: 13.8100 },
  // JULIJSKE ALPE - srednje
  { id: 13, ime: 'Kanjavec',                     regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '13', vzpon: 1000, lat: 46.3500, lon: 13.8167 },
  { id: 14, ime: 'Bogatin',                      regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 900,  lat: 46.2833, lon: 13.8333 },
  { id: 15, ime: 'Krn',                          regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.2333, lon: 13.7167 },
  { id: 16, ime: 'Matajur',                      regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 850,  lat: 46.1833, lon: 13.5833 },
  { id: 17, ime: 'Rombon',                       regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 800,  lat: 46.3167, lon: 13.5667 },
  { id: 18, ime: 'Polovnik',                     regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '8',  vzpon: 700,  lat: 46.1667, lon: 13.6333 },
  { id: 19, ime: 'Slemenova špica',              regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '7',  vzpon: 600,  lat: 46.4000, lon: 13.9000 },
  { id: 20, ime: 'Dolina Triglavskih jezer',     regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '20', vzpon: 1000, lat: 46.3333, lon: 13.8000 },
  { id: 21, ime: 'Mrzla gora',                   regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 750,  lat: 46.3667, lon: 13.9167 },
  { id: 22, ime: 'Kobla',                        regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '8',  vzpon: 700,  lat: 46.3000, lon: 13.9500 },
  { id: 23, ime: 'Črna prst',                   regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 800,  lat: 46.2667, lon: 13.9667 },
  { id: 24, ime: 'Porezen',                      regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 750,  lat: 46.2333, lon: 14.0167 },
  // JULIJSKE ALPE - lahke
  { id: 25, ime: 'Soška pot',                    regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '25', vzpon: 300,  lat: 46.2500, lon: 13.6833 },
  { id: 26, ime: 'Bohinjsko jezero — Savica',    regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '6',  vzpon: 200,  lat: 46.2833, lon: 13.8667 },
  { id: 27, ime: 'Vogel',                        regija: 'Julijske Alpe', tezavnost: 'hiking', dolzina: '5',  vzpon: 350,  lat: 46.2667, lon: 13.8333 },
  { id: 28, ime: 'Blejski vintgar',              regija: 'Gorenjska',     tezavnost: 'hiking', dolzina: '4',  vzpon: 80,   lat: 46.3900, lon: 14.0800 },
  { id: 29, ime: 'Pokljuka — krožna pot',        regija: 'Gorenjska',     tezavnost: 'hiking', dolzina: '8',  vzpon: 200,  lat: 46.3333, lon: 13.9833 },
  { id: 30, ime: 'Dolina Radovne',               regija: 'Gorenjska',     tezavnost: 'hiking', dolzina: '10', vzpon: 150,  lat: 46.4000, lon: 13.9500 },
  // KAMNIŠKE ALPE - zahtevne
  { id: 31, ime: 'Grintovec',                    regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3667, lon: 14.5333 },
  { id: 32, ime: 'Kočna',                        regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1400, lat: 46.3833, lon: 14.5167 },
  { id: 33, ime: 'Skuta',                        regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1600, lat: 46.3500, lon: 14.5500 },
  { id: 34, ime: 'Ojstrica',                     regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1200, lat: 46.3333, lon: 14.5667 },
  { id: 35, ime: 'Raduha',                       regija: 'Kamniške Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 14.7333 },
  // KAMNIŠKE ALPE - srednje
  { id: 36, ime: 'Velika planina',               regija: 'Kamniške Alpe', tezavnost: 'hiking',         dolzina: '6',  vzpon: 380,  lat: 46.3167, lon: 14.6333 },
  { id: 37, ime: 'Planjava',                     regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1000, lat: 46.3167, lon: 14.5833 },
  { id: 38, ime: 'Brana',                        regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 950,  lat: 46.3333, lon: 14.5333 },
  { id: 39, ime: 'Turska gora',                  regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1050, lat: 46.3500, lon: 14.5167 },
  { id: 40, ime: 'Kamniško sedlo',               regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 850,  lat: 46.3667, lon: 14.5667 },
  { id: 41, ime: 'Storžič',                      regija: 'Kamniške Alpe', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4000, lon: 14.4667 },
  { id: 42, ime: 'Menina planina',               regija: 'Kamniške Alpe', tezavnost: 'hiking',         dolzina: '9',  vzpon: 500,  lat: 46.2500, lon: 14.7833 },
  { id: 43, ime: 'Logarska dolina',              regija: 'Kamniške Alpe', tezavnost: 'hiking',         dolzina: '8',  vzpon: 250,  lat: 46.3833, lon: 14.6333 },
  { id: 44, ime: 'Okrešelj',                     regija: 'Kamniške Alpe', tezavnost: 'hiking',         dolzina: '7',  vzpon: 400,  lat: 46.3500, lon: 14.5833 },
  { id: 45, ime: 'Krvavec',                      regija: 'Kamniške Alpe', tezavnost: 'hiking',         dolzina: '5',  vzpon: 300,  lat: 46.3000, lon: 14.5333 },
  // KARAVANKE
  { id: 46, ime: 'Stol',                         regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1050, lat: 46.4833, lon: 14.1167 },
  { id: 47, ime: 'Golica',                       regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 900,  lat: 46.4667, lon: 14.0333 },
  { id: 48, ime: 'Begunjščica',                  regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 1000, lat: 46.4333, lon: 14.2167 },
  { id: 49, ime: 'Košuta',                       regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '13', vzpon: 1100, lat: 46.4500, lon: 14.3333 },
  { id: 50, ime: 'Kepa',                         regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 800,  lat: 46.5000, lon: 13.9500 },
  { id: 51, ime: 'Uršlja gora',                  regija: 'Karavanke', tezavnost: 'hiking',         dolzina: '8',  vzpon: 550,  lat: 46.5167, lon: 14.7833 },
  { id: 52, ime: 'Peca',                         regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 950,  lat: 46.5000, lon: 14.8833 },
  { id: 53, ime: 'Jezerska Kočna',               regija: 'Karavanke', tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1300, lat: 46.4167, lon: 14.5000 },
  { id: 54, ime: 'Olševa',                       regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 700,  lat: 46.4833, lon: 14.8167 },
  { id: 55, ime: 'Raduha — Karavanke',           regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 1000, lat: 46.4167, lon: 14.7333 },
  { id: 56, ime: 'Smrekovec',                    regija: 'Karavanke', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 700,  lat: 46.4833, lon: 14.7167 },
  // ŠKOFJELOŠKO HRIBOVJE
  { id: 57, ime: 'Goška ravan',                  regija: 'Škofjeloško hribovje', tezavnost: 'hiking',         dolzina: '8',  vzpon: 440, lat: 46.3166, lon: 14.1328 },
  { id: 58, ime: 'Ratitovec',                    regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 850, lat: 46.2333, lon: 14.0667 },
  { id: 59, ime: 'Blegoš',                       regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 700, lat: 46.1833, lon: 14.0167 },
  { id: 60, ime: 'Lubnik',                       regija: 'Škofjeloško hribovje', tezavnost: 'hiking',         dolzina: '5',  vzpon: 450, lat: 46.1667, lon: 14.0833 },
  { id: 61, ime: 'Sv. Lovrenc nad Škofjo Loko',  regija: 'Škofjeloško hribovje', tezavnost: 'hiking',         dolzina: '6',  vzpon: 350, lat: 46.1500, lon: 14.1167 },
  // POSAVSKO HRIBOVJE
  { id: 62, ime: 'Šmarna gora',                  regija: 'Posavsko hribovje', tezavnost: 'hiking',         dolzina: '4',  vzpon: 250, lat: 46.1872, lon: 14.4630 },
  { id: 63, ime: 'Kum',                          regija: 'Posavsko hribovje', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 800, lat: 46.0833, lon: 15.0667 },
  { id: 64, ime: 'Sv. Gora — Zasavje',           regija: 'Posavsko hribovje', tezavnost: 'hiking',         dolzina: '5',  vzpon: 350, lat: 46.0500, lon: 15.0167 },
  { id: 65, ime: 'Limbarska gora',               regija: 'Posavsko hribovje', tezavnost: 'hiking',         dolzina: '4',  vzpon: 280, lat: 46.1333, lon: 14.8667 },
  { id: 66, ime: 'Reber — Litija',               regija: 'Posavsko hribovje', tezavnost: 'hiking',         dolzina: '6',  vzpon: 320, lat: 46.0667, lon: 14.8167 },
  // PRIMORSKA
  { id: 67, ime: 'Nanos',                        regija: 'Primorska', tezavnost: 'hiking',         dolzina: '7',  vzpon: 450, lat: 45.7667, lon: 14.0333 },
  { id: 68, ime: 'Snežnik',                      regija: 'Primorska', tezavnost: 'mountain_hiking', dolzina: '12', vzpon: 900, lat: 45.5833, lon: 14.4500 },
  { id: 69, ime: 'Slavnik',                      regija: 'Primorska', tezavnost: 'hiking',         dolzina: '8',  vzpon: 500, lat: 45.5333, lon: 13.9667 },
  { id: 70, ime: 'Vremščica',                    regija: 'Primorska', tezavnost: 'hiking',         dolzina: '7',  vzpon: 400, lat: 45.7000, lon: 13.9500 },
  { id: 71, ime: 'Trstelj',                      regija: 'Primorska', tezavnost: 'hiking',         dolzina: '5',  vzpon: 280, lat: 45.8167, lon: 13.7500 },
  { id: 72, ime: 'Sv. Katarina — Kras',          regija: 'Primorska', tezavnost: 'hiking',         dolzina: '6',  vzpon: 200, lat: 45.7500, lon: 13.8000 },
  { id: 73, ime: 'Izvir Reke',                   regija: 'Primorska', tezavnost: 'hiking',         dolzina: '4',  vzpon: 100, lat: 45.5500, lon: 14.3500 },
  // POHORJE
  { id: 74, ime: 'Rogla — krožna pot',           regija: 'Pohorje', tezavnost: 'hiking', dolzina: '6',  vzpon: 300, lat: 46.4500, lon: 15.3333 },
  { id: 75, ime: 'Črni vrh — Pohorje',           regija: 'Pohorje', tezavnost: 'hiking', dolzina: '8',  vzpon: 400, lat: 46.5000, lon: 15.3833 },
  { id: 76, ime: 'Lovrenška jezera',             regija: 'Pohorje', tezavnost: 'hiking', dolzina: '7',  vzpon: 300, lat: 46.5167, lon: 15.3500 },
  { id: 77, ime: 'Osankarica',                   regija: 'Pohorje', tezavnost: 'hiking', dolzina: '5',  vzpon: 250, lat: 46.4667, lon: 15.4333 },
  { id: 78, ime: 'Ribniška koča — Pohorje',      regija: 'Pohorje', tezavnost: 'hiking', dolzina: '9',  vzpon: 350, lat: 46.4833, lon: 15.3667 },
  // DOLENJSKA
  { id: 79, ime: 'Trdinov vrh',                  regija: 'Dolenjska', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 700, lat: 45.8167, lon: 15.2333 },
  { id: 80, ime: 'Mirna gora',                   regija: 'Dolenjska', tezavnost: 'hiking',         dolzina: '7',  vzpon: 450, lat: 45.7167, lon: 15.1000 },
  { id: 81, ime: 'Gorjanci — greben',            regija: 'Dolenjska', tezavnost: 'mountain_hiking', dolzina: '15', vzpon: 600, lat: 45.8000, lon: 15.2000 },
  { id: 82, ime: 'Sv. Miklavž — Dolenjska',      regija: 'Dolenjska', tezavnost: 'hiking',         dolzina: '5',  vzpon: 300, lat: 45.7500, lon: 15.0500 },
  // SAVINJSKE ALPE
  { id: 83, ime: 'Menina planina — vrh',         regija: 'Savinjske Alpe', tezavnost: 'mountain_hiking', dolzina: '10', vzpon: 700, lat: 46.2500, lon: 14.7833 },
  { id: 84, ime: 'Smrekovec — vrh',              regija: 'Savinjske Alpe', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 600, lat: 46.4833, lon: 14.7167 },
  // GORENJSKA
  { id: 85, ime: 'Triglav — pot čez Kredarico', regija: 'Gorenjska', tezavnost: 'demanding_mountain_hiking', dolzina: '19', vzpon: 1750, lat: 46.3792, lon: 13.8367 },
  { id: 86, ime: 'Stara Fužina — Bohinj',        regija: 'Gorenjska', tezavnost: 'hiking', dolzina: '5',  vzpon: 150, lat: 46.2833, lon: 13.9000 },
  { id: 87, ime: 'Kranjska Gora — Vršič',        regija: 'Gorenjska', tezavnost: 'hiking', dolzina: '8',  vzpon: 550, lat: 46.4833, lon: 13.9167 },
  { id: 88, ime: 'Jezersko — krožna pot',        regija: 'Gorenjska', tezavnost: 'hiking', dolzina: '7',  vzpon: 300, lat: 46.3967, lon: 14.5006 },
  { id: 89, ime: 'Radovljica — Begunje',         regija: 'Gorenjska', tezavnost: 'hiking', dolzina: '9',  vzpon: 200, lat: 46.3417, lon: 14.1736 },
  { id: 90, ime: 'Bled — Straža',               regija: 'Gorenjska', tezavnost: 'hiking', dolzina: '3',  vzpon: 150, lat: 46.3683, lon: 14.1146 },
  // ŠTAJERSKA
  { id: 91, ime: 'Donačka gora',                 regija: 'Štajerska', tezavnost: 'hiking', dolzina: '6',  vzpon: 350, lat: 46.3167, lon: 15.8167 },
  { id: 92, ime: 'Boč',                          regija: 'Štajerska', tezavnost: 'hiking', dolzina: '7',  vzpon: 400, lat: 46.2167, lon: 15.6667 },
  { id: 93, ime: 'Mrzlica',                      regija: 'Štajerska', tezavnost: 'hiking', dolzina: '6',  vzpon: 380, lat: 46.1667, lon: 15.1833 },
  { id: 94, ime: 'Resevna',                      regija: 'Štajerska', tezavnost: 'hiking', dolzina: '5',  vzpon: 300, lat: 46.3833, lon: 15.7833 },
  // KOROŠKA
  { id: 95, ime: 'Peca — vrh',                   regija: 'Koroška', tezavnost: 'mountain_hiking', dolzina: '11', vzpon: 950, lat: 46.5000, lon: 14.8833 },
  { id: 96, ime: 'Plešivec — Koroška',           regija: 'Koroška', tezavnost: 'hiking',         dolzina: '7',  vzpon: 500, lat: 46.5500, lon: 14.9000 },
  { id: 97, ime: 'Olševa — Koroška',             regija: 'Koroška', tezavnost: 'mountain_hiking', dolzina: '9',  vzpon: 650, lat: 46.4833, lon: 14.8167 },
  // DODATNE
  { id: 98,  ime: 'Sveti Jošt nad Kranjem',      regija: 'Gorenjska',     tezavnost: 'hiking', dolzina: '5',  vzpon: 350, lat: 46.2333, lon: 14.3500 },
  { id: 99,  ime: 'Tosc',                        regija: 'Julijske Alpe', tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.3333, lon: 13.8667 },
  { id: 100, ime: 'Debela peč',                  regija: 'Julijske Alpe', tezavnost: 'mountain_hiking', dolzina: '8', vzpon: 700, lat: 46.3167, lon: 14.0000 },
]

const REGIJE_LIST = ['Vse regije', ...new Set(BAZA_POTI.map(p => p.regija))]

export default function Iskanje({ onZacniPohod }) {
  const [iskanje, setIskanje] = useState('')
  const [filter, setFilter] = useState('Vse')
  const [regija, setRegija] = useState('Vse regije')
  const [poti, setPoti] = useState(BAZA_POTI)

  useEffect(() => {
    if (iskanje.length < 2) { setPoti(BAZA_POTI); return }
    const timer = setTimeout(() => {
      setPoti(BAZA_POTI.filter(p =>
        p.ime.toLowerCase().includes(iskanje.toLowerCase()) ||
        p.regija.toLowerCase().includes(iskanje.toLowerCase())
      ))
    }, 300)
    return () => clearTimeout(timer)
  }, [iskanje])

  const prikazanePoti = poti.filter(p => {
    const badge = tezavnostBadge(p.tezavnost)
    const tezavnostOk = filter === 'Vse' || badge?.ime === filter
    const regijaOk = regija === 'Vse regije' || p.regija === regija
    return tezavnostOk && regijaOk
  })

  return (
    <div style={{ padding: 16 }}>

      {/* Naslov */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Iskanje poti</div>
        <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>{BAZA_POTI.length} poti po vsej Sloveniji</div>
      </div>

      {/* Iskalno polje */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', border: '0.5px solid var(--rob)',
        borderRadius: 12, padding: '10px 14px', marginBottom: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <svg width="15" height="15" fill="none" stroke="#9CA3AF" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={iskanje}
          onChange={e => setIskanje(e.target.value)}
          placeholder="Išči pot ali vrh..."
          style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1, background: 'transparent', color: 'var(--besedilo)' }}
        />
        {iskanje && (
          <button onClick={() => setIskanje('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--besedilo2)', fontSize: 16, padding: 0 }}>✕</button>
        )}
      </div>

      {/* Filter težavnost */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTRI.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flexShrink: 0, padding: '5px 14px', borderRadius: 20,
            border: '0.5px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: filter === f ? 'var(--zelena)' : 'white',
            color: filter === f ? 'white' : 'var(--besedilo2)',
            borderColor: filter === f ? 'var(--zelena)' : 'var(--rob)',
          }}>{f}</button>
        ))}
      </div>

      {/* Filter regije */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {REGIJE_LIST.map(r => (
          <button key={r} onClick={() => setRegija(r)} style={{
            flexShrink: 0, padding: '4px 11px', borderRadius: 20,
            border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            background: regija === r ? '#1F5C1F' : 'white',
            color: regija === r ? 'white' : 'var(--besedilo2)',
            borderColor: regija === r ? '#1F5C1F' : 'var(--rob)',
          }}>{r}</button>
        ))}
      </div>

      {/* Število */}
      <div style={{ fontSize: 11, color: 'var(--besedilo2)', marginBottom: 10, fontWeight: 500 }}>
        {prikazanePoti.length} poti
      </div>

      {/* Seznam */}
      {prikazanePoti.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--besedilo2)' }}>
          Ni rezultatov za "{iskanje}"
        </div>
      )}

      {prikazanePoti.map((p) => {
        const badge = tezavnostBadge(p.tezavnost)
        const cas = izracunajCas(p.dolzina, p.vzpon)
        return (
          <div key={p.id} style={{
            background: 'white', borderRadius: 14, padding: '13px 14px',
            marginBottom: 9, border: '0.5px solid var(--rob)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--zelena-sv)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>⛰️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {p.ime}
                  {badge && <span className={`tezavnost ${badge.razred}`}>{badge.ime}</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--besedilo2)' }}>
                  {p.regija} · {p.dolzina} km · ↑{p.vzpon} m · ⏱ {cas}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '0.5px solid var(--rob)', paddingTop: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--besedilo2)' }}>Težavnost</span>
                {badge && <TezavnostPike razred={badge.razred} />}
              </div>
              <button
                onClick={() => onZacniPohod(p)}
                style={{
                  background: 'var(--zelena)', color: 'white',
                  border: 'none', borderRadius: 8,
                  padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Odpri pot
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
