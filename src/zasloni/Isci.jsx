import React, { useState, useEffect, useRef } from 'react'

const BAZA_POTI = [
  { id: 1,  ime: 'Triglav — standardna pot',    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '18', vzpon: 1700, lat: 46.3794, lon: 13.8369 },
  { id: 2,  ime: 'Triglav — Bambergova pot',    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '20', vzpon: 1800, lat: 46.3794, lon: 13.8369 },
  { id: 3,  ime: 'Mangart',                      regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1200, lat: 46.4428, lon: 13.6644 },
  { id: 4,  ime: 'Jalovec',                      regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.4458, lon: 13.6997 },
  { id: 5,  ime: 'Razor',                        regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1400, lat: 46.3736, lon: 13.8069 },
  { id: 6,  ime: 'Škrlatica',                    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '17', vzpon: 1600, lat: 46.3858, lon: 13.8586 },
  { id: 7,  ime: 'Prisojnik',                    regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1300, lat: 46.3942, lon: 13.8303 },
  { id: 8,  ime: 'Špik',                         regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4197, lon: 13.7997 },
  { id: 9,  ime: 'Visoka Ponca',                 regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1250, lat: 46.4175, lon: 13.8039 },
  { id: 10, ime: 'Velika Mojstrovka',            regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '11', vzpon: 1100, lat: 46.4378, lon: 13.7622 },
  { id: 11, ime: 'Mala Mojstrovka',              regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '10', vzpon: 1000, lat: 46.4358, lon: 13.7642 },
  { id: 12, ime: 'Tosc',                         regija: 'Julijske Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '16', vzpon: 1500, lat: 46.3317, lon: 13.8667 },
  { id: 13, ime: 'Kanjavec',                     regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '13', vzpon: 1000, lat: 46.365, lon: 13.8006 },
  { id: 14, ime: 'Bogatin',                      regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 900,  lat: 46.2861, lon: 13.8183 },
  { id: 15, ime: 'Krn',                          regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1100, lat: 46.2258, lon: 13.6967 },
  { id: 16, ime: 'Matajur',                      regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 850,  lat: 46.1878, lon: 13.5714 },
  { id: 17, ime: 'Rombon',                       regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.3108, lon: 13.4978 },
  { id: 18, ime: 'Polovnik',                     regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '8',  vzpon: 700,  lat: 46.1536, lon: 13.6528 },
  { id: 19, ime: 'Slemenova špica',              regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '7',  vzpon: 600,  lat: 46.4000, lon: 13.9000 },
  { id: 20, ime: 'Črna prst',                   regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 800,  lat: 46.2656, lon: 13.9711 },
  { id: 21, ime: 'Kobla',                        regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '8',  vzpon: 700,  lat: 46.2994, lon: 13.9494 },
  { id: 22, ime: 'Porezen',                      regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 750,  lat: 46.2253, lon: 14.0175 },
  { id: 23, ime: 'Dolina Triglavskih jezer',     regija: 'Julijske Alpe',        tezavnost: 'mountain_hiking',           dolzina: '20', vzpon: 1000, lat: 46.3333, lon: 13.8000 },
  { id: 24, ime: 'Soška pot',                    regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '25', vzpon: 300,  lat: 46.25, lon: 13.6833 },
  { id: 25, ime: 'Bohinjsko jezero — Savica',    regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '6',  vzpon: 200,  lat: 46.2997, lon: 13.8681 },
  { id: 26, ime: 'Vogel',                        regija: 'Julijske Alpe',        tezavnost: 'hiking',                    dolzina: '5',  vzpon: 350,  lat: 46.2711, lon: 13.8319 },
  { id: 27, ime: 'Blejski vintgar',              regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '4',  vzpon: 80,   lat: 46.3933, lon: 14.0794 },
  { id: 28, ime: 'Pokljuka — krožna pot',        regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 200,  lat: 46.3331, lon: 13.9828 },
  { id: 29, ime: 'Dolina Radovne',               regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '10', vzpon: 150,  lat: 46.4000, lon: 13.9500 },
  { id: 30, ime: 'Kranjska Gora — Vršič',        regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 550,  lat: 46.4833, lon: 13.9167 },
  { id: 31, ime: 'Bled — Straža',               regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '3',  vzpon: 150,  lat: 46.3683, lon: 14.1146 },
  { id: 32, ime: 'Sveti Jošt nad Kranjem',      regija: 'Gorenjska',            tezavnost: 'hiking',                    dolzina: '5',  vzpon: 350,  lat: 46.2333, lon: 14.3500 },
  { id: 33, ime: 'Grintovec',                    regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3714, lon: 14.5342 },
  { id: 34, ime: 'Kočna',                        regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1400, lat: 46.3808, lon: 14.5128 },
  { id: 35, ime: 'Skuta',                        regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1600, lat: 46.3608, lon: 14.5681 },
  { id: 36, ime: 'Ojstrica',                     regija: 'Kamniške Alpe',        tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1200, lat: 46.3381, lon: 14.5583 },
  { id: 37, ime: 'Raduha',                       regija: 'Savinjske Alpe',       tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1100, lat: 46.4167, lon: 14.7333 },
  { id: 38, ime: 'Velika planina',               regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '6',  vzpon: 380,  lat: 46.3142, lon: 14.6317 },
  { id: 39, ime: 'Planjava',                     regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 1000, lat: 46.3242, lon: 14.5719 },
  { id: 40, ime: 'Brana',                        regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 950,  lat: 46.3361, lon: 14.5339 },
  { id: 41, ime: 'Turska gora',                  regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 1050, lat: 46.35, lon: 14.5194 },
  { id: 42, ime: 'Kamniško sedlo',               regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 850,  lat: 46.3831, lon: 14.5628 },
  { id: 43, ime: 'Storžič',                      regija: 'Kamniške Alpe',        tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1100, lat: 46.3969, lon: 14.4681 },
  { id: 44, ime: 'Logarska dolina',              regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '8',  vzpon: 250,  lat: 46.3808, lon: 14.6244 },
  { id: 45, ime: 'Okrešelj',                     regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '7',  vzpon: 400,  lat: 46.3500, lon: 14.5833 },
  { id: 46, ime: 'Krvavec',                      regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '5',  vzpon: 300,  lat: 46.3000, lon: 14.5333 },
  { id: 47, ime: 'Menina planina',               regija: 'Kamniške Alpe',        tezavnost: 'hiking',                    dolzina: '9',  vzpon: 500,  lat: 46.2500, lon: 14.7833 },
  { id: 48, ime: 'Stol',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 1050, lat: 46.4967, lon: 14.1167 },
  { id: 49, ime: 'Golica',                       regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 900,  lat: 46.4736, lon: 14.0308 },
  { id: 50, ime: 'Begunjščica',                  regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 1000, lat: 46.4461, lon: 14.2178 },
  { id: 51, ime: 'Košuta',                       regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '13', vzpon: 1100, lat: 46.4503, lon: 14.3317 },
  { id: 52, ime: 'Kepa',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.4728, lon: 13.9383 },
  { id: 53, ime: 'Uršlja gora',                  regija: 'Karavanke',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 550,  lat: 46.5167, lon: 14.7833 },
  { id: 54, ime: 'Peca',                         regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 950,  lat: 46.5092, lon: 14.8944 },
  { id: 55, ime: 'Jezerska Kočna',               regija: 'Karavanke',            tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1300, lat: 46.415, lon: 14.5017 },
  { id: 56, ime: 'Olševa',                       regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 700,  lat: 46.4833, lon: 14.8167 },
  { id: 57, ime: 'Smrekovec',                    regija: 'Karavanke',            tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 700,  lat: 46.4833, lon: 14.7167 },
  { id: 58, ime: 'Goška ravan',                  regija: 'Škofjeloško hribovje', tezavnost: 'hiking',                    dolzina: '8',  vzpon: 440,  lat: 46.3166, lon: 14.1328 },
  { id: 59, ime: 'Ratitovec',                    regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 850,  lat: 46.2383, lon: 14.0553 },
  { id: 60, ime: 'Blegoš',                       regija: 'Škofjeloško hribovje', tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 700,  lat: 46.1808, lon: 14.0183 },
  { id: 61, ime: 'Lubnik',                       regija: 'Škofjeloško hribovje', tezavnost: 'hiking',                    dolzina: '5',  vzpon: 450,  lat: 46.1667, lon: 14.0833 },
  { id: 62, ime: 'Šmarna gora',                  regija: 'Posavsko hribovje',    tezavnost: 'hiking',                    dolzina: '4',  vzpon: 250,  lat: 46.1869, lon: 14.4636 },
  { id: 63, ime: 'Kum',                          regija: 'Posavsko hribovje',    tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 800,  lat: 46.0817, lon: 15.0617 },
  { id: 64, ime: 'Sv. Gora — Zasavje',           regija: 'Posavsko hribovje',    tezavnost: 'hiking',                    dolzina: '5',  vzpon: 350,  lat: 46.0500, lon: 15.0167 },
  { id: 65, ime: 'Limbarska gora',               regija: 'Posavsko hribovje',    tezavnost: 'hiking',                    dolzina: '4',  vzpon: 280,  lat: 46.1333, lon: 14.8667 },
  { id: 66, ime: 'Nanos',                        regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '7',  vzpon: 450,  lat: 46.7622, lon: 14.0456 },
  { id: 67, ime: 'Snežnik',                      regija: 'Primorska',            tezavnost: 'mountain_hiking',           dolzina: '12', vzpon: 900,  lat: 45.5892, lon: 14.4461 },
  { id: 68, ime: 'Slavnik',                      regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '8',  vzpon: 500,  lat: 45.5364, lon: 13.9728 },
  { id: 69, ime: 'Vremščica',                    regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '7',  vzpon: 400,  lat: 45.7000, lon: 13.9500 },
  { id: 70, ime: 'Trstelj',                      regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '5',  vzpon: 280,  lat: 45.8167, lon: 13.7500 },
  { id: 71, ime: 'Izvir Reke',                   regija: 'Primorska',            tezavnost: 'hiking',                    dolzina: '4',  vzpon: 100,  lat: 45.5500, lon: 14.3500 },
  { id: 72, ime: 'Rogla — krožna pot',           regija: 'Pohorje',              tezavnost: 'hiking',                    dolzina: '6',  vzpon: 300,  lat: 46.4500, lon: 15.3333 },
  { id: 73, ime: 'Črni vrh — Pohorje',           regija: 'Pohorje',              tezavnost: 'hiking',                    dolzina: '8',  vzpon: 400,  lat: 46.5000, lon: 15.3833 },
  { id: 74, ime: 'Lovrenška jezera',             regija: 'Pohorje',              tezavnost: 'hiking',                    dolzina: '7',  vzpon: 300,  lat: 46.5167, lon: 15.3500 },
  { id: 75, ime: 'Trdinov vrh',                  regija: 'Dolenjska',            tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 700,  lat: 45.8194, lon: 15.2322 },
  { id: 76, ime: 'Mirna gora',                   regija: 'Dolenjska',            tezavnost: 'hiking',                    dolzina: '7',  vzpon: 450,  lat: 45.7167, lon: 15.1000 },
  { id: 77, ime: 'Gorjanci — greben',            regija: 'Dolenjska',            tezavnost: 'mountain_hiking',           dolzina: '15', vzpon: 600,  lat: 45.8000, lon: 15.2000 },
  { id: 78, ime: 'Menina planina — vrh',         regija: 'Savinjske Alpe',       tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 700,  lat: 46.2500, lon: 14.7833 },
  { id: 79, ime: 'Smrekovec — vrh',              regija: 'Savinjske Alpe',       tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 600,  lat: 46.4833, lon: 14.7167 },
  { id: 80, ime: 'Donačka gora',                 regija: 'Štajerska',            tezavnost: 'hiking',                    dolzina: '6',  vzpon: 350,  lat: 46.3167, lon: 15.8167 },
  { id: 81, ime: 'Boč',                          regija: 'Štajerska',            tezavnost: 'hiking',                    dolzina: '7',  vzpon: 400,  lat: 46.2167, lon: 15.6667 },
  { id: 82, ime: 'Mrzlica',                      regija: 'Štajerska',            tezavnost: 'hiking',                    dolzina: '6',  vzpon: 380,  lat: 46.1667, lon: 15.1833 },
  { id: 83, ime: 'Peca — vrh',                   regija: 'Koroška',              tezavnost: 'mountain_hiking',           dolzina: '11', vzpon: 950,  lat: 46.5000, lon: 14.8833 },
  { id: 84, ime: 'Plešivec — Koroška',           regija: 'Koroška',              tezavnost: 'hiking',                    dolzina: '7',  vzpon: 500,  lat: 46.5500, lon: 14.9000 },
  { id: 85,  ime: 'Debela peč',         regija: 'Julijske Alpe',  tezavnost: 'mountain_hiking',           dolzina: '8',  vzpon: 700,  lat: 46.3167, lon: 14.0000 },
  { id: 86,  ime: 'Bavški Grintavec',   regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '18', vzpon: 1847, lat: 46.2428, lon: 13.5983 },
  { id: 87,  ime: 'Begunjski vrh',      regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1560, lat: 46.3903, lon: 13.8544 },
  { id: 88,  ime: 'Cmir',               regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1500, lat: 46.3708, lon: 13.8358 },
  { id: 89,  ime: 'Vrbanova špica',     regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1500, lat: 46.3847, lon: 13.8422 },
  { id: 90,  ime: 'Velika Ponca',       regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '12', vzpon: 1300, lat: 46.4175, lon: 13.8039 },
  { id: 91,  ime: 'Mala Ponca',         regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '11', vzpon: 1200, lat: 46.415, lon: 13.8019 },
  { id: 92,  ime: 'Štenov',             regija: 'Julijske Alpe',  tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 1000, lat: 46.4333, lon: 13.7833 },
  { id: 93,  ime: 'Križ',               regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3575, lon: 13.7972 },
  { id: 94,  ime: 'Mladi vrh',          regija: 'Julijske Alpe',  tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 900,  lat: 46.3500, lon: 13.8500 },
  { id: 95,  ime: 'Mali Tosc',          regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '15', vzpon: 1500, lat: 46.3333, lon: 13.865 },
  { id: 96,  ime: 'Kanin',              regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '14', vzpon: 1500, lat: 46.3625, lon: 13.4878 },
  { id: 97,  ime: 'Prestreljenik',      regija: 'Julijske Alpe',  tezavnost: 'demanding_mountain_hiking', dolzina: '13', vzpon: 1400, lat: 46.3333, lon: 13.5000 },
  { id: 98,  ime: 'Batognica',          regija: 'Julijske Alpe',  tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 900,  lat: 46.2000, lon: 13.7167 },
  { id: 99,  ime: 'Mrežce',             regija: 'Gorenjska',      tezavnost: 'mountain_hiking',           dolzina: '7',  vzpon: 600,  lat: 46.3333, lon: 13.9667 },
  { id: 100, ime: 'Mrzla gora',         regija: 'Kamniške Alpe',  tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.3500, lon: 14.6000 },
  { id: 101, ime: 'Kalški greben',      regija: 'Kamniške Alpe',  tezavnost: 'mountain_hiking',           dolzina: '10', vzpon: 900,  lat: 46.3167, lon: 14.5000 },
  { id: 102, ime: 'Dobrča',             regija: 'Kamniške Alpe',  tezavnost: 'mountain_hiking',           dolzina: '9',  vzpon: 800,  lat: 46.4000, lon: 14.3833 },
  { id: 103, ime: 'Dovška baba',        regija: 'Karavanke',      tezavnost: 'hiking',                    dolzina: '7',  vzpon: 600,  lat: 46.4833, lon: 14.0167 },
  { id: 104, ime: 'Kriška gora',        regija: 'Karavanke',      tezavnost: 'hiking',                    dolzina: '6',  vzpon: 500,  lat: 46.4167, lon: 14.3667 },
]

const BAZA_KOC = [
  { id: 1,  ime: 'Triglavski dom na Kredarici',       visina: 2515, regija: 'Julijske Alpe',        tel: '+38645740574',  lezisca: 130, odprta: 'Jul–Sep',  lat: 46.3794, lon: 13.8369, km: 9,  vzpon: 1400 },
  { id: 2,  ime: 'Aljažev dom v Vratih',              visina: 1015, regija: 'Julijske Alpe',        tel: '+38645898360',  lezisca: 80,  odprta: 'Cel leto', lat: 46.4181, lon: 13.8467, km: 0,  vzpon: 0    },
  { id: 3,  ime: 'Dom Planika pod Triglavom',         visina: 2401, regija: 'Julijske Alpe',        tel: '+38645741574',  lezisca: 60,  odprta: 'Jul–Sep',  lat: 46.3822, lon: 13.8292, km: 7,  vzpon: 1200 },
  { id: 4,  ime: 'Koča pri Triglavskih jezerih',      visina: 1685, regija: 'Julijske Alpe',        tel: '+38645723170',  lezisca: 50,  odprta: 'Jun–Sep',  lat: 46.3333, lon: 13.7997, km: 6,  vzpon: 700  },
  { id: 5,  ime: 'Vodnikov dom na Velem polju',       visina: 1817, regija: 'Julijske Alpe',        tel: '+38645721182',  lezisca: 70,  odprta: 'Jun–Oct',  lat: 46.3706, lon: 13.8506, km: 5,  vzpon: 900  },
  { id: 6,  ime: 'Dom v Tamarju',                     visina: 1108, regija: 'Julijske Alpe',        tel: '+38645890050',  lezisca: 40,  odprta: 'Cel leto', lat: 46.4694, lon: 13.7819, km: 4,  vzpon: 200  },
  { id: 7,  ime: 'Erjavčeva koča na Vršiču',         visina: 1515, regija: 'Julijske Alpe',        tel: '+38645881050',  lezisca: 60,  odprta: 'Maj–Oct',  lat: 46.4353, lon: 13.7483, km: 1,  vzpon: 50   },
  { id: 8,  ime: 'Dom na Komni',                      visina: 1520, regija: 'Julijske Alpe',        tel: '+38645725100',  lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.2736, lon: 13.8353, km: 5,  vzpon: 800  },
  { id: 9,  ime: 'Koča na Doliču',                    visina: 2151, regija: 'Julijske Alpe',        tel: '+38645899000',  lezisca: 40,  odprta: 'Jul–Sep',  lat: 46.4025, lon: 13.7528, km: 8,  vzpon: 1200 },
  { id: 10, ime: 'Pogačnikov dom na Kriških podih',   visina: 2050, regija: 'Julijske Alpe',        tel: '+38645898200',  lezisca: 50,  odprta: 'Jul–Sep',  lat: 46.3828, lon: 13.8697, km: 6,  vzpon: 1000 },
  { id: 11, ime: 'Tičarjev dom na Vršiču',           visina: 1620, regija: 'Julijske Alpe',        tel: '+38645881055',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4306, lon: 13.7472, km: 2,  vzpon: 150  },
  { id: 12, ime: 'Zasavska koča na Prehodavcih',     visina: 2071, regija: 'Julijske Alpe',        tel: '+38612345678',  lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.3525, lon: 13.7828, km: 7,  vzpon: 1000 },
  { id: 13, ime: 'Koča pri Savici',                   visina: 653,  regija: 'Julijske Alpe',        tel: '+38645723456',  lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.3, lon: 13.8681, km: 1,  vzpon: 100  },
  { id: 14, ime: 'Dom na Voglu',                      visina: 1535, regija: 'Julijske Alpe',        tel: '+38645729100',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.2711, lon: 13.8319, km: 1,  vzpon: 50   },
  { id: 15, ime: 'Cojzova koča na Kokrskem sedlu',   visina: 1793, regija: 'Kamniške Alpe',        tel: '+38642525010',  lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.3836, lon: 14.5533, km: 5,  vzpon: 900  },
  { id: 16, ime: 'Češka koča na Spodnjih Ravneh',    visina: 1543, regija: 'Kamniške Alpe',        tel: '+38648391600',  lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.3494, lon: 14.5672, km: 4,  vzpon: 700  },
  { id: 17, ime: 'Dom na Kamniškem sedlu',            visina: 1864, regija: 'Kamniške Alpe',        tel: '+38618391234',  lezisca: 40,  odprta: 'Jul–Sep',  lat: 46.3831, lon: 14.5628, km: 6,  vzpon: 1000 },
  { id: 18, ime: 'Klemenčeva koča na Grintovcu',     visina: 2347, regija: 'Kamniške Alpe',        tel: '+38642520000',  lezisca: 20,  odprta: 'Jul–Sep',  lat: 46.3667, lon: 14.5333, km: 8,  vzpon: 1400 },
  { id: 19, ime: 'Dom na Okrešlju',                   visina: 1396, regija: 'Kamniške Alpe',        tel: '+38648391700',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.3519, lon: 14.5806, km: 3,  vzpon: 500  },
  { id: 20, ime: 'Koča na Veliki planini',            visina: 1666, regija: 'Kamniške Alpe',        tel: '+38642523100',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3142, lon: 14.6317, km: 3,  vzpon: 380  },
  { id: 21, ime: 'Dom v Logarski dolini',             visina: 785,  regija: 'Kamniške Alpe',        tel: '+38638395000',  lezisca: 30,  odprta: 'Apr–Oct',  lat: 46.3808, lon: 14.6244, km: 1,  vzpon: 50   },
  { id: 22, ime: 'Koča pod Skuto',                    visina: 1850, regija: 'Kamniške Alpe',        tel: '+38648392000',  lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.3400, lon: 14.5600, km: 5,  vzpon: 900  },
  { id: 23, ime: 'Dom na Storžiču',                   visina: 1755, regija: 'Kamniške Alpe',        tel: '+38642526000',  lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4000, lon: 14.4667, km: 5,  vzpon: 900  },
  { id: 24, ime: 'Dom na Stolu',                      visina: 1685, regija: 'Karavanke',            tel: '+38645727000',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.4969, lon: 14.1156, km: 4,  vzpon: 700  },
  { id: 25, ime: 'Prešernova koča na Stolu',         visina: 1331, regija: 'Karavanke',            tel: '+38645741000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4739, lon: 14.0881, km: 3,  vzpon: 500  },
  { id: 26, ime: 'Koča na Zelenici',                  visina: 1537, regija: 'Karavanke',            tel: '+38645728000',  lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.4567, lon: 14.0844, km: 2,  vzpon: 300  },
  { id: 27, ime: 'Planinska koča na Golici',          visina: 1582, regija: 'Karavanke',            tel: '+38645729000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4736, lon: 14.0308, km: 3,  vzpon: 500  },
  { id: 28, ime: 'Dom na Begunjščici',                visina: 1657, regija: 'Karavanke',            tel: '+38645321000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4461, lon: 14.2178, km: 4,  vzpon: 700  },
  { id: 29, ime: 'Koča na Kepi',                      visina: 1882, regija: 'Karavanke',            tel: '+38645882000',  lezisca: 25,  odprta: 'Jul–Sep',  lat: 46.5000, lon: 13.9500, km: 5,  vzpon: 900  },
  { id: 30, ime: 'Planinska koča na Košuti',          visina: 1789, regija: 'Karavanke',            tel: '+38645322000',  lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4500, lon: 14.3333, km: 5,  vzpon: 800  },
  { id: 31, ime: 'Dom na Uršlji gori',                visina: 1699, regija: 'Karavanke',            tel: '+38628241000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.5164, lon: 14.7831, km: 4,  vzpon: 600  },
  { id: 32, ime: 'Koča na Peci',                      visina: 2114, regija: 'Karavanke',            tel: '+38628242000',  lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.5092, lon: 14.8944, km: 6,  vzpon: 900  },
  { id: 33, ime: 'Koča na Olševi',                    visina: 1620, regija: 'Karavanke',            tel: '+38628243000',  lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4833, lon: 14.8167, km: 4,  vzpon: 600  },
  { id: 34, ime: 'Koča na Raduhi',                    visina: 2062, regija: 'Karavanke',            tel: '+38628701000',  lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.4167, lon: 14.7333, km: 5,  vzpon: 800  },
  { id: 35, ime: 'Planinska koča na Ratitovcu',      visina: 1667, regija: 'Škofjeloško hribovje', tel: '+38645121000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2333, lon: 14.0667, km: 4,  vzpon: 700  },
  { id: 36, ime: 'Koča na Blegoš',                   visina: 1562, regija: 'Škofjeloško hribovje', tel: '+38645122000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.1833, lon: 14.0167, km: 4,  vzpon: 650  },
  { id: 37, ime: 'Dom na Goški ravni',                visina: 933,  regija: 'Škofjeloško hribovje', tel: '+38645123000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3166, lon: 14.1328, km: 3,  vzpon: 440  },
  { id: 38, ime: 'Koča na Lubniku',                   visina: 1025, regija: 'Škofjeloško hribovje', tel: '+38645124000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.1667, lon: 14.0833, km: 3,  vzpon: 500  },
  { id: 39, ime: 'Dom na Šmarni gori',                visina: 669,  regija: 'Posavsko hribovje',    tel: '+38615611000',  lezisca: 30,  odprta: 'Cel leto', lat: 46.1869, lon: 14.4636, km: 2,  vzpon: 250  },
  { id: 40, ime: 'Koča na Kumu',                      visina: 1220, regija: 'Posavsko hribovje',    tel: '+38618981000',  lezisca: 35,  odprta: 'Jun–Oct',  lat: 46.0817, lon: 15.0617, km: 5,  vzpon: 700  },
  { id: 41, ime: 'Koča na Nanosu',                    visina: 1262, regija: 'Primorska',            tel: '+38653641000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 45.7667, lon: 14.0333, km: 3,  vzpon: 450  },
  { id: 42, ime: 'Dom na Snežniku',                   visina: 1796, regija: 'Primorska',            tel: '+38617071000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5892, lon: 14.4461, km: 5,  vzpon: 700  },
  { id: 43, ime: 'Dom na Slavniku',                   visina: 1028, regija: 'Primorska',            tel: '+38656721000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5364, lon: 13.9728, km: 4,  vzpon: 500  },
  { id: 44, ime: 'Koča na Vremščici',                 visina: 1027, regija: 'Primorska',            tel: '+38656922000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.7000, lon: 13.9500, km: 3,  vzpon: 400  },
  { id: 45, ime: 'Koča na Črnem vrhu',                visina: 1543, regija: 'Pohorje',              tel: '+38626031000',  lezisca: 40,  odprta: 'Cel leto', lat: 46.5000, lon: 15.3833, km: 4,  vzpon: 400  },
  { id: 46, ime: 'Dom na Rogli',                      visina: 1517, regija: 'Pohorje',              tel: '+38637571000',  lezisca: 50,  odprta: 'Cel leto', lat: 46.4500, lon: 15.3333, km: 3,  vzpon: 300  },
  { id: 47, ime: 'Planinska koča Mariborsko Pohorje', visina: 1320, regija: 'Pohorje',              tel: '+38626032000',  lezisca: 35,  odprta: 'Cel leto', lat: 46.5333, lon: 15.4000, km: 3,  vzpon: 350  },
  { id: 48, ime: 'Dom na Lovrenškem jezeru',          visina: 1517, regija: 'Pohorje',              tel: '+38626034000',  lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.5167, lon: 15.3500, km: 4,  vzpon: 350  },
  { id: 49, ime: 'Koča na Trdinov vrh',               visina: 1178, regija: 'Dolenjska',            tel: '+38673841000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.8167, lon: 15.2333, km: 4,  vzpon: 500  },
  { id: 50, ime: 'Dom na Mirni gori',                 visina: 1046, regija: 'Dolenjska',            tel: '+38673051000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.7167, lon: 15.1000, km: 3,  vzpon: 400  },
  { id: 51, ime: 'Dom na Menini',                     visina: 1508, regija: 'Savinjske Alpe',       tel: '+38638398000',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2500, lon: 14.7833, km: 4,  vzpon: 600  },
  { id: 52, ime: 'Koča na Smrekovcu',                 visina: 1577, regija: 'Savinjske Alpe',       tel: '+38638399000',  lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4833, lon: 14.7167, km: 4,  vzpon: 500  },
  { id: 53, ime: 'Dom na Pokljuki',                   visina: 1330, regija: 'Gorenjska',            tel: '+38645720100',  lezisca: 40,  odprta: 'Cel leto', lat: 46.3331, lon: 13.9828, km: 2,  vzpon: 200  },
  { id: 54, ime: 'Koča pri Savici',                   visina: 653,  regija: 'Gorenjska',            tel: '+38645723456',  lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.3, lon: 13.8681, km: 1,  vzpon: 100  },
  { id: 55, ime: 'Dom na Voglu',                      visina: 1535, regija: 'Gorenjska',            tel: '+38645729100',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.2711, lon: 13.8319, km: 1,  vzpon: 50   },
  { id: 56, ime: 'Koča na Raduhi — Koroška',         visina: 2062, regija: 'Koroška',              tel: '+38628702000',  lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.4167, lon: 14.7333, km: 5,  vzpon: 800  },
  { id: 57, ime: 'Dom na Donački gori',               visina: 884,  regija: 'Štajerska',            tel: '+38627961000',  lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.3167, lon: 15.8167, km: 3,  vzpon: 350  },
  { id: 58, ime: 'Dom na Boču',                       visina: 979,  regija: 'Štajerska',            tel: '+38635721000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.2167, lon: 15.6667, km: 3,  vzpon: 400  },
  { id: 59, ime: 'Košutnikov dom',                visina: 1520, regija: 'Karavanke',            tel: '+38640123456',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4503, lon: 14.35, km: 4,  vzpon: 600  },
  { id: 60, ime: 'Dom Valentina Staniča',         visina: 2332, regija: 'Julijske Alpe',        tel: '+38645742332',  lezisca: 50,  odprta: 'Jul–Sep',  lat: 46.3822, lon: 13.8411, km: 8,  vzpon: 1450 },
  { id: 61, ime: 'Gomiščkovo zavetišče',          visina: 2182, regija: 'Julijske Alpe',        tel: '+38641234567',  lezisca: 20,  odprta: 'Jul–Sep',  lat: 46.2167, lon: 13.7000, km: 7,  vzpon: 1200 },
  { id: 62, ime: 'Dom Petra Skalarja na Kaninu',  visina: 2260, regija: 'Julijske Alpe',        tel: '+38653881100',  lezisca: 40,  odprta: 'Jul–Sep',  lat: 46.3500, lon: 13.4833, km: 2,  vzpon: 200  },
  { id: 63, ime: 'Koča v Grohotu',                visina: 1460, regija: 'Kamniške Alpe',        tel: '+38638391000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.4000, lon: 14.7500, km: 4,  vzpon: 600  },
  { id: 64, ime: 'Koča na Loki pod Raduho',       visina: 1534, regija: 'Kamniške Alpe',        tel: '+38638396000',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4167, lon: 14.7333, km: 5,  vzpon: 700  },
  { id: 65, ime: 'Planinska koča na Kriški gori', visina: 1490, regija: 'Karavanke',            tel: '+38645324000',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.4167, lon: 14.3667, km: 3,  vzpon: 450  },
  { id: 66, ime: 'Blejska koča na Lipanci',          visina: 1630, regija: 'Gorenjska',            tel: '+38645742600',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.3736, lon: 13.9494, km: 3,  vzpon: 500  },
  { id: 67, ime: 'Dom v Kamniški Bistrici',           visina: 601,  regija: 'Kamniške Alpe',        tel: '+38641711121',  lezisca: 30,  odprta: 'Cel leto', lat: 46.3167, lon: 14.5833, km: 0,  vzpon: 0    },
  { id: 68, ime: 'Dom Zorka Jelinčiča na Črni prsti', visina: 1295, regija: 'Julijske Alpe',        tel: '+38645722022',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2667, lon: 13.9833, km: 4,  vzpon: 500  },
  { id: 69, ime: 'Frischaufov dom na Okrešlju',       visina: 1328, regija: 'Kamniške Alpe',        tel: '+38641711122',  lezisca: 60,  odprta: 'Cel leto', lat: 46.3333, lon: 14.6000, km: 2,  vzpon: 400  },
  { id: 70, ime: 'Kocbekov dom na Korošici',          visina: 1808, regija: 'Kamniške Alpe',        tel: '+38641711123',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.3500, lon: 14.5500, km: 5,  vzpon: 900  },
  { id: 71, ime: 'Koča na Dobrči',                    visina: 1479, regija: 'Karavanke',            tel: '+38641711124',  lezisca: 35,  odprta: 'Jun–Oct',  lat: 46.4000, lon: 14.3833, km: 4,  vzpon: 700  },
  { id: 72, ime: 'Koča na planini Razor',             visina: 1315, regija: 'Julijske Alpe',        tel: '+38645722023',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.3833, lon: 13.8000, km: 5,  vzpon: 600  },
  { id: 73, ime: 'Koča na Poreznu',                   visina: 1245, regija: 'Julijske Alpe',        tel: '+38645722024',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.2333, lon: 14.0167, km: 4,  vzpon: 550  },
  { id: 74, ime: 'Koča v Krnici',                     visina: 1107, regija: 'Julijske Alpe',        tel: '+38645722025',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4500, lon: 13.8667, km: 3,  vzpon: 300  },
  { id: 75, ime: 'Kovinarska koča v Krmi',            visina: 870,  regija: 'Gorenjska',            tel: '+38645722026',  lezisca: 20,  odprta: 'Apr–Oct',  lat: 46.4167, lon: 13.9000, km: 0,  vzpon: 0    },
  { id: 76, ime: 'Koča pod Bogatinom',                visina: 1513, regija: 'Julijske Alpe',        tel: '+38645722027',  lezisca: 40,  odprta: 'Jun–Sep',  lat: 46.2833, lon: 13.8167, km: 4,  vzpon: 600  },
  { id: 77, ime: 'Dom na Lubniku',                    visina: 1025, regija: 'Škofjeloško hribovje', tel: '+38641711125',  lezisca: 30,  odprta: 'Cel leto', lat: 46.1667, lon: 14.0833, km: 3,  vzpon: 500  },
  { id: 78, ime: 'Planinski dom Tamar',               visina: 1108, regija: 'Julijske Alpe',        tel: '+38645889005',  lezisca: 50,  odprta: 'Cel leto', lat: 46.4667, lon: 13.7833, km: 0,  vzpon: 0    },
  { id: 79, ime: 'Poštarski dom na Vršiču',           visina: 1620, regija: 'Julijske Alpe',        tel: '+38645881050',  lezisca: 30,  odprta: 'Jun–Oct',  lat: 46.4333, lon: 13.7500, km: 1,  vzpon: 50   },
  { id: 80, ime: 'Dom pod Storžičem',                 visina: 855,  regija: 'Kamniške Alpe',        tel: '+38641711126',  lezisca: 25,  odprta: 'Jun–Oct',  lat: 46.3833, lon: 14.4667, km: 1,  vzpon: 100  },
  { id: 81, ime: 'Dom dr. Klementa Juga v Lepeni',   visina: 600,  regija: 'Julijske Alpe',        tel: '+38653882155',  lezisca: 20,  odprta: 'Apr–Oct',  lat: 46.2833, lon: 13.7167, km: 0,  vzpon: 0    },
  { id: 82, ime: 'Kosijev dom na Vogarju',            visina: 1054, regija: 'Julijske Alpe',        tel: '+38645722028',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.3167, lon: 13.9167, km: 3,  vzpon: 400  },
  { id: 83, ime: 'Planinski dom pri Krnskih jezerih', visina: 1385, regija: 'Julijske Alpe',        tel: '+38645722029',  lezisca: 60,  odprta: 'Jun–Sep',  lat: 46.2833, lon: 13.7500, km: 5,  vzpon: 500  },
  { id: 84, ime: 'Bregarjevo zavetišče',              visina: 1624, regija: 'Gorenjska',            tel: '+38645722030',  lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.3333, lon: 13.9667, km: 3,  vzpon: 450  },
  { id: 85, ime: 'Roblekov dom na Begunjščici',       visina: 1657, regija: 'Karavanke',            tel: '+38641711127',  lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4333, lon: 14.2167, km: 4,  vzpon: 700  },
  { id: 86, ime: 'Valvasorjev dom pod Stolom',        visina: 1181, regija: 'Karavanke',            tel: '+38641711128',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4667, lon: 14.1000, km: 2,  vzpon: 300  },
  { id: 87, ime: 'Zavetišče pod Špičkom',             visina: 1055, regija: 'Julijske Alpe',        tel: '+38653891234',  lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.2333, lon: 13.7167, km: 3,  vzpon: 400  },
  { id: 88, ime: 'Vojkova koča na Nanosu',            visina: 1262, regija: 'Primorska',            tel: '+38653641000',  lezisca: 35,  odprta: 'Jun–Oct',  lat: 45.7667, lon: 14.0333, km: 3,  vzpon: 450  },
  { id: 89, ime: 'Tumova koča na Slavniku',           visina: 1028, regija: 'Primorska',            tel: '+38641711129',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.5333, lon: 13.9667, km: 4,  vzpon: 500  },
  { id: 90, ime: 'Kocbekov dom na Korošici',          visina: 1808, regija: 'Kamniške Alpe',        tel: '+38641711130',  lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.3500, lon: 14.5833, km: 5,  vzpon: 900  },
  { id: 91, ime: 'Mozirska koča na Golteh',           visina: 1200, regija: 'Savinjske Alpe',       tel: '+38638398001',  lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4500, lon: 14.8167, km: 4,  vzpon: 600  },
  { id: 92, ime: 'Koča Draga Karolina na Snežniku',  visina: 1796, regija: 'Primorska',            tel: '+38641711131',  lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.5833, lon: 14.4500, km: 5,  vzpon: 700  },
  { id: 93, ime: 'Domžalski dom na Veliki planini',   visina: 1534, regija: 'Kamniške Alpe',        tel: '+38641711132',  lezisca: 45,  odprta: 'Cel leto', lat: 46.3167, lon: 14.6333, km: 3,  vzpon: 380  },
  { id: 94, ime: 'Planinski dom na Zasavski sveti gori', visina: 767, regija: 'Posavsko hribovje', tel: '+38641711133',  lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.0500, lon: 15.0167, km: 3,  vzpon: 350  },
  { id: 95, ime: 'Mariborska koča na Pohorju',        visina: 1320, regija: 'Pohorje',              tel: '+38641711134',  lezisca: 35,  odprta: 'Cel leto', lat: 46.5333, lon: 15.4000, km: 3,  vzpon: 350  },
]


function IkonaPoti({ razred }) {
  const [pulse, setPulse] = useState(false)
  const barve = {
    tezka:   { ozadje: '#FEE2E2', gora: '#C0392B', sneg: '#FADBD8' },
    srednja: { ozadje: '#FEF3C7', gora: '#D35400', sneg: '#FDEBD0' },
    lahka:   { ozadje: '#D1FAE5', gora: '#1E8449', sneg: '#A9DFBF' },
  }
  const b = barve[razred] || barve.lahka
  return (
    <div
      onMouseDown={() => setPulse(true)}
      onMouseUp={() => setTimeout(() => setPulse(false), 400)}
      onTouchStart={() => setPulse(true)}
      onTouchEnd={() => setTimeout(() => setPulse(false), 400)}
      style={{
        width: 44, height: 44, borderRadius: 10,
        background: b.ozadje, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: pulse ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: pulse ? `0 0 0 5px ${b.ozadje}80` : 'none',
      }}
    >
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
        <polygon points="20,4 25,14 15,14" fill={b.sneg}/>
        <polygon points="20,4 34,34 6,34" fill={b.gora}/>
        <path d="M20 34 C17 30 22 27 19 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      </svg>
    </div>
  )
}

function IkonaKoce() {
  const [pulse, setPulse] = useState(false)
  return (
    <div
      onMouseDown={() => setPulse(true)}
      onMouseUp={() => setTimeout(() => setPulse(false), 400)}
      onTouchStart={() => setPulse(true)}
      onTouchEnd={() => setTimeout(() => setPulse(false), 400)}
      style={{
        width: 44, height: 44, borderRadius: 10,
        background: '#E8F5E9', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: pulse ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: pulse ? '0 0 0 5px #E8F5E980' : 'none',
      }}
    >
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
        <polygon points="20,5 36,20 4,20" fill="#2E7D32"/>
        <rect x="10" y="20" width="20" height="14" fill="#388E3C" rx="1"/>
        <rect x="16" y="26" width="8" height="8" fill="#1B5E20" rx="1"/>
        <rect x="26" y="11" width="4" height="9" fill="#1B5E20"/>
      </svg>
    </div>
  )
}

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

function VisinaBadge({ visina }) {
  const barva  = visina > 2000 ? '#991B1B' : visina > 1500 ? '#92400E' : '#065F46'
  const ozadje = visina > 2000 ? '#FEE2E2' : visina > 1500 ? '#FEF3C7' : '#D1FAE5'
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: ozadje, color: barva }}>{visina} m</span>
}

const REGIJE_POTI = ['Vse', ...new Set(BAZA_POTI.map(p => p.regija))]
const REGIJE_KOC  = ['Vse', ...new Set(BAZA_KOC.map(k => k.regija))]

export default function Isci({ onOdpriPot, onPotDoKoce }) {
  const [tab, setTab] = useState('poti')
  const [iskanje, setIskanje] = useState('')
  const [tezavnost, setTezavnost] = useState('Vse')
  const [regija, setRegija] = useState('Vse')
  const inputRef = useRef(null)

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
      <div style={{ padding: '14px 14px 0', background: 'var(--ozadje)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'white', border: '0.5px solid var(--rob)',
          borderRadius: 12, padding: '11px 14px', marginBottom: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input ref={inputRef} value={iskanje} onChange={e => setIskanje(e.target.value)}
            placeholder={tab === 'poti' ? 'Išči pot ali vrh...' : 'Išči kočo ali regijo...'}
            style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, background: 'transparent', color: 'var(--besedilo)' }}
          />
          {iskanje && <button onClick={() => setIskanje('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--besedilo2)', fontSize: 18, padding: 0 }}>✕</button>}
        </div>

        <div style={{ display: 'flex', background: 'white', borderRadius: 10, padding: 3, border: '0.5px solid var(--rob)', marginBottom: 10 }}>
          {['poti', 'koce'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: tab === t ? 'var(--zelena)' : 'transparent',
              color: tab === t ? 'white' : 'var(--besedilo2)', transition: 'all 0.2s',
            }}>
              {t === 'poti' ? `⛰ Poti (${BAZA_POTI.length})` : `🏠 Koče (${BAZA_KOC.length})`}
            </button>
          ))}
        </div>

        {tab === 'poti' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {['Vse', 'Lahka', 'Srednja', 'Zahtevna'].map(f => (
              <button key={f} onClick={() => setTezavnost(f)} style={{
                flexShrink: 0, padding: '4px 12px', borderRadius: 20, border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
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
              flexShrink: 0, padding: '4px 11px', borderRadius: 20, border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: regija === r ? '#1F5C1F' : 'white',
              color: regija === r ? 'white' : 'var(--besedilo2)',
              borderColor: regija === r ? '#1F5C1F' : 'var(--rob)',
            }}>{r}</button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--besedilo2)', marginBottom: 8, fontWeight: 500 }}>
          {steviloRezultatov} {tab === 'poti' ? 'poti' : 'koč'}{iskanje && ` za "${iskanje}"`}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px' }}>
        {steviloRezultatov === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--besedilo2)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ni rezultatov</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Poskusi drugačen iskalni niz</div>
          </div>
        )}

        {tab === 'poti' && filtriranePoti.map(p => {
          const info = tezavnostInfo(p.tezavnost)
          const cas = izracunajCas(p.dolzina, p.vzpon)
          return (
            <div key={p.id} style={{ background: 'white', borderRadius: 14, padding: '13px 14px', marginBottom: 9, border: '0.5px solid var(--rob)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 8 }}>
                <IkonaPoti razred={info.razred} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {p.ime}<span className={`tezavnost ${info.razred}`}>{info.ime}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--besedilo2)' }}>{p.regija} · {p.dolzina} km · ▲{p.vzpon} m · ⏱ {cas}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, borderTop: '0.5px solid var(--rob)', paddingTop: 10 }}>
                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}&travelmode=driving`, '_blank')} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px', background: 'white', borderRadius: 8, border: '0.5px solid var(--rob)', color: 'var(--besedilo)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Navigacija
                </button>
                <button onClick={() => onOdpriPot && onOdpriPot(p)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px', background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)', borderRadius: 8, border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>▶ Odpri pot</button>
              </div>
            </div>
          )
        })}

        {tab === 'koce' && filtrirane_koce.map(k => (
          <div key={k.id} style={{ background: 'white', borderRadius: 14, padding: '13px 14px', marginBottom: 9, border: '0.5px solid var(--rob)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 8 }}>
              <IkonaKoce />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{k.ime}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--zelena)', fontWeight: 600 }}>{k.regija}</span>
                  <VisinaBadge visina={k.visina} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, paddingBottom: 10, borderBottom: '0.5px solid var(--rob)' }}>
              {k.km > 0 && <span style={{ fontSize: 11, background: '#F0FAF0', color: 'var(--zelena-t)', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>📏 {k.km} km · ▲{k.vzpon} m · ⏱ {izracunajCas(k.km, k.vzpon)}</span>}
              <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>🛏 {k.lezisca}</span>
              <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>📅 {k.odprta}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`tel:${k.tel}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: 'var(--zelena-sv)', borderRadius: 8, textDecoration: 'none', color: 'var(--zelena-t)', fontSize: 12, fontWeight: 600 }}>📞 Pokliči</a>
              <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${k.lat},${k.lon}&travelmode=driving`, '_blank')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: 'white', borderRadius: 8, border: '0.5px solid var(--rob)', color: 'var(--besedilo)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Navigacija
              </button>
              <button onClick={() => onPotDoKoce && onPotDoKoce(k)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)', borderRadius: 8, border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Pot</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
