import React, { useState, useEffect } from 'react'

const BAZA_KOC = [
  // JULIJSKE ALPE
  { id: 1,  ime: 'Triglavski dom na Kredarici',       visina: 2515, regija: 'Julijske Alpe',        tel: '+386 4 574 0 574',  lezisca: 130, odprta: 'Jul–Sep',  lat: 46.3792, lon: 13.8367, km: 9,  vzpon: 1400, opis: 'Najvišja planinska koča v Sloveniji' },
  { id: 2,  ime: 'Aljažev dom v Vratih',              visina: 1015, regija: 'Julijske Alpe',        tel: '+386 4 589 8360',   lezisca: 80,  odprta: 'Cel leto', lat: 46.4167, lon: 13.8500, km: 0,  vzpon: 0,    opis: 'Izhodišče za vzpon na Triglav' },
  { id: 3,  ime: 'Dom Planika pod Triglavom',         visina: 2401, regija: 'Julijske Alpe',        tel: '+386 4 574 1 574',  lezisca: 60,  odprta: 'Jul–Sep',  lat: 46.3750, lon: 13.8400, km: 7,  vzpon: 1200, opis: 'Pod severnim Triglavskim stenjem' },
  { id: 4,  ime: 'Koča pri Triglavskih jezerih',      visina: 1685, regija: 'Julijske Alpe',        tel: '+386 4 572 3170',   lezisca: 50,  odprta: 'Jun–Sep',  lat: 46.3333, lon: 13.8000, km: 6,  vzpon: 700,  opis: 'V dolini sedmih jezer' },
  { id: 5,  ime: 'Vodnikov dom na Velem polju',       visina: 1817, regija: 'Julijske Alpe',        tel: '+386 4 572 1182',   lezisca: 70,  odprta: 'Jun–Oct',  lat: 46.3667, lon: 13.8500, km: 5,  vzpon: 900,  opis: 'Na poti na Triglav iz Bohinja' },
  { id: 6,  ime: 'Dom v Tamarju',                     visina: 1108, regija: 'Julijske Alpe',        tel: '+386 4 589 0050',   lezisca: 40,  odprta: 'Cel leto', lat: 46.4667, lon: 13.7833, km: 4,  vzpon: 200,  opis: 'V dolini Tamar pod Jalovec' },
  { id: 7,  ime: 'Koča pri Izviru Soče',              visina: 926,  regija: 'Julijske Alpe',        tel: '+386 5 388 6011',   lezisca: 30,  odprta: 'Apr–Oct',  lat: 46.3833, lon: 13.6667, km: 2,  vzpon: 100,  opis: 'Pri izviru reke Soče' },
  { id: 8,  ime: 'Dom na Komni',                      visina: 1520, regija: 'Julijske Alpe',        tel: '+386 4 572 5100',   lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.2667, lon: 13.8333, km: 5,  vzpon: 800,  opis: 'Na planoti Komna nad Bohinjem' },
  { id: 9,  ime: 'Koča na Doliču',                    visina: 2151, regija: 'Julijske Alpe',        tel: '+386 4 589 9000',   lezisca: 40,  odprta: 'Jul–Sep',  lat: 46.4000, lon: 13.7500, km: 8,  vzpon: 1200, opis: 'Pod Jalovec in Mangart' },
  { id: 10, ime: 'Pogačnikov dom na Kriških podih',   visina: 2050, regija: 'Julijske Alpe',        tel: '+386 4 589 8200',   lezisca: 50,  odprta: 'Jul–Sep',  lat: 46.3833, lon: 13.8700, km: 6,  vzpon: 1000, opis: 'Na Kriških podih' },
  { id: 11, ime: 'Erjavčeva koča na Vršiču',         visina: 1515, regija: 'Julijske Alpe',        tel: '+386 4 588 1050',   lezisca: 60,  odprta: 'Maj–Oct',  lat: 46.4333, lon: 13.7500, km: 1,  vzpon: 50,   opis: 'Na prelazu Vršič' },
  { id: 12, ime: 'Tičarjev dom na Vršiču',           visina: 1620, regija: 'Julijske Alpe',        tel: '+386 4 588 1055',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4300, lon: 13.7450, km: 2,  vzpon: 150,  opis: 'Nad Vršičem' },
  { id: 13, ime: 'Zasavska koča na Prehodavcih',     visina: 2071, regija: 'Julijske Alpe',        tel: '+386 1 234 5678',   lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.3500, lon: 13.7833, km: 7,  vzpon: 1000, opis: 'Med Triglavom in Krnom' },
  { id: 14, ime: 'Koča na Planini pri Jezeru',        visina: 1453, regija: 'Julijske Alpe',        tel: '+386 4 572 3000',   lezisca: 40,  odprta: 'Jun–Sep',  lat: 46.3167, lon: 13.8167, km: 4,  vzpon: 600,  opis: 'Pri Triglavskih jezerih' },
  { id: 15, ime: 'Dom pod Špičkom',                   visina: 1055, regija: 'Julijske Alpe',        tel: '+386 5 389 1234',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.2333, lon: 13.7167, km: 3,  vzpon: 400,  opis: 'Pod Krnom v dolini Soče' },
  { id: 16, ime: 'Koča pri Savici',                   visina: 653,  regija: 'Julijske Alpe',        tel: '+386 4 572 3456',   lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.2833, lon: 13.8667, km: 1,  vzpon: 100,  opis: 'Pri slapu Savica' },
  { id: 17, ime: 'Dom na Voglu',                      visina: 1535, regija: 'Julijske Alpe',        tel: '+386 4 572 9100',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.2667, lon: 13.8333, km: 1,  vzpon: 50,   opis: 'Na Voglu nad Bohinjem' },
  { id: 18, ime: 'Koča na Mangartskem sedlu',         visina: 2055, regija: 'Julijske Alpe',        tel: '+386 5 389 2000',   lezisca: 20,  odprta: 'Jul–Sep',  lat: 46.4333, lon: 13.6333, km: 1,  vzpon: 200,  opis: 'Ob cesti na Mangart' },
  { id: 19, ime: 'Dom v Trenti',                      visina: 623,  regija: 'Julijske Alpe',        tel: '+386 5 388 9000',   lezisca: 20,  odprta: 'Apr–Oct',  lat: 46.3833, lon: 13.6500, km: 0,  vzpon: 0,    opis: 'V dolini Trente' },
  { id: 20, ime: 'Planinska koča Bovec',              visina: 434,  regija: 'Julijske Alpe',        tel: '+386 5 389 3000',   lezisca: 30,  odprta: 'Cel leto', lat: 46.3367, lon: 13.5533, km: 0,  vzpon: 0,    opis: 'V Bovcu ob Soči' },

  // KAMNIŠKE ALPE
  { id: 21, ime: 'Cojzova koča na Kokrskem sedlu',   visina: 1793, regija: 'Kamniške Alpe',        tel: '+386 4 252 5010',   lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.3833, lon: 14.5500, km: 5,  vzpon: 900,  opis: 'Na Kokrskem sedlu' },
  { id: 22, ime: 'Češka koča na Spodnjih Ravneh',    visina: 1543, regija: 'Kamniške Alpe',        tel: '+386 4 839 1600',   lezisca: 80,  odprta: 'Jun–Oct',  lat: 46.3500, lon: 14.5667, km: 4,  vzpon: 700,  opis: 'Pod Ojstrico in Planjavo' },
  { id: 23, ime: 'Dom na Kamniškem sedlu',            visina: 1864, regija: 'Kamniške Alpe',        tel: '+386 1 839 1234',   lezisca: 40,  odprta: 'Jul–Sep',  lat: 46.3667, lon: 14.5667, km: 6,  vzpon: 1000, opis: 'Na Kamniškem sedlu' },
  { id: 24, ime: 'Klemenčeva koča na Grintovcu',     visina: 2347, regija: 'Kamniške Alpe',        tel: '+386 4 252 0000',   lezisca: 20,  odprta: 'Jul–Sep',  lat: 46.3667, lon: 14.5333, km: 8,  vzpon: 1400, opis: 'Tik pod vrhom Grintovca' },
  { id: 25, ime: 'Dom na Okrešlju',                   visina: 1396, regija: 'Kamniške Alpe',        tel: '+386 4 839 1700',   lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.3500, lon: 14.5833, km: 3,  vzpon: 500,  opis: 'V kotanji pod Skuto' },
  { id: 26, ime: 'Frischaufov dom na Okrešlju',      visina: 1328, regija: 'Kamniške Alpe',        tel: '+386 4 839 1800',   lezisca: 60,  odprta: 'Cel leto', lat: 46.3333, lon: 14.6000, km: 2,  vzpon: 400,  opis: 'Nad Kamnikom' },
  { id: 27, ime: 'Koča na Veliki planini',            visina: 1666, regija: 'Kamniške Alpe',        tel: '+386 4 252 3100',   lezisca: 40,  odprta: 'Cel leto', lat: 46.3167, lon: 14.6333, km: 3,  vzpon: 380,  opis: 'Na pastirski planini' },
  { id: 28, ime: 'Dom v Logarski dolini',             visina: 785,  regija: 'Kamniške Alpe',        tel: '+386 3 839 5000',   lezisca: 30,  odprta: 'Apr–Oct',  lat: 46.3833, lon: 14.6333, km: 1,  vzpon: 50,   opis: 'V Logarski dolini' },
  { id: 29, ime: 'Koča na Loki pod Raduho',          visina: 1360, regija: 'Kamniške Alpe',        tel: '+386 3 839 6000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4167, lon: 14.7333, km: 4,  vzpon: 700,  opis: 'Pod Raduho' },
  { id: 30, ime: 'Koča na Robanovem kotu',            visina: 782,  regija: 'Kamniške Alpe',        tel: '+386 3 839 7000',   lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.3667, lon: 14.6167, km: 1,  vzpon: 30,   opis: 'V Robanovem kotu' },
  { id: 31, ime: 'Koča pod Skuto',                    visina: 1850, regija: 'Kamniške Alpe',        tel: '+386 4 839 2000',   lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.3400, lon: 14.5600, km: 5,  vzpon: 900,  opis: 'Pod vrhom Skute' },
  { id: 32, ime: 'Dom na Storžiču',                   visina: 1755, regija: 'Kamniške Alpe',        tel: '+386 4 252 6000',   lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4000, lon: 14.4667, km: 5,  vzpon: 900,  opis: 'Na vrhu Storžiča' },

  // KARAVANKE
  { id: 33, ime: 'Dom na Stolu',                      visina: 1685, regija: 'Karavanke',            tel: '+386 4 572 7000',   lezisca: 50,  odprta: 'Jun–Oct',  lat: 46.4833, lon: 14.1167, km: 4,  vzpon: 700,  opis: 'Na vrhu Stola' },
  { id: 34, ime: 'Prešernova koča na Stolu',         visina: 1331, regija: 'Karavanke',            tel: '+386 4 574 1000',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4667, lon: 14.0833, km: 3,  vzpon: 500,  opis: 'Pod Stolom' },
  { id: 35, ime: 'Koča na Zelenici',                  visina: 1537, regija: 'Karavanke',            tel: '+386 4 572 8000',   lezisca: 60,  odprta: 'Jun–Oct',  lat: 46.4500, lon: 14.0833, km: 2,  vzpon: 300,  opis: 'Na planini Zelenica' },
  { id: 36, ime: 'Planinska koča na Golici',          visina: 1582, regija: 'Karavanke',            tel: '+386 4 572 9000',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.4667, lon: 14.0333, km: 3,  vzpon: 500,  opis: 'Znana po narcisah spomladi' },
  { id: 37, ime: 'Dom na Begunjščici',                visina: 1657, regija: 'Karavanke',            tel: '+386 4 532 1000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.4333, lon: 14.2167, km: 4,  vzpon: 700,  opis: 'Na vrhu Begunjščice' },
  { id: 38, ime: 'Koča na Kepi',                      visina: 1882, regija: 'Karavanke',            tel: '+386 4 588 2000',   lezisca: 25,  odprta: 'Jul–Sep',  lat: 46.5000, lon: 13.9500, km: 5,  vzpon: 900,  opis: 'Na vrhu Kepe' },
  { id: 39, ime: 'Planinska koča na Košuti',          visina: 1789, regija: 'Karavanke',            tel: '+386 4 532 2000',   lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4500, lon: 14.3333, km: 5,  vzpon: 800,  opis: 'Na grebenu Košute' },
  { id: 40, ime: 'Dom na Uršlji gori',                visina: 1699, regija: 'Karavanke',            tel: '+386 2 824 1000',   lezisca: 40,  odprta: 'Cel leto', lat: 46.5167, lon: 14.7833, km: 4,  vzpon: 600,  opis: 'Na vrhu Uršlje gore' },
  { id: 41, ime: 'Koča na Peci',                      visina: 2114, regija: 'Karavanke',            tel: '+386 2 824 2000',   lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.5000, lon: 14.8833, km: 6,  vzpon: 900,  opis: 'Na vrhu Pece' },
  { id: 42, ime: 'Koča na Olševi',                    visina: 1620, regija: 'Karavanke',            tel: '+386 2 824 3000',   lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4833, lon: 14.8167, km: 4,  vzpon: 600,  opis: 'Na Olševi' },
  { id: 43, ime: 'Dom na Jezerskem',                  visina: 900,  regija: 'Karavanke',            tel: '+386 4 254 0100',   lezisca: 20,  odprta: 'Cel leto', lat: 46.3967, lon: 14.5006, km: 0,  vzpon: 0,    opis: 'V Jezerskem' },
  { id: 44, ime: 'Koča na Raduhi',                    visina: 2062, regija: 'Karavanke',            tel: '+386 2 870 1000',   lezisca: 30,  odprta: 'Jul–Sep',  lat: 46.4167, lon: 14.7333, km: 5,  vzpon: 800,  opis: 'Na vrhu Raduhe' },

  // ŠKOFJELOŠKO HRIBOVJE
  { id: 45, ime: 'Planinska koča na Ratitovcu',      visina: 1667, regija: 'Škofjeloško hribovje', tel: '+386 4 512 1000',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2333, lon: 14.0667, km: 4,  vzpon: 700,  opis: 'Na vrhu Ratitovca' },
  { id: 46, ime: 'Koča na Blegoš',                   visina: 1562, regija: 'Škofjeloško hribovje', tel: '+386 4 512 2000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 46.1833, lon: 14.0167, km: 4,  vzpon: 650,  opis: 'Na vrhu Blegoša' },
  { id: 47, ime: 'Dom na Goški ravni',                visina: 933,  regija: 'Škofjeloško hribovje', tel: '+386 4 512 3000',   lezisca: 40,  odprta: 'Cel leto', lat: 46.3166, lon: 14.1328, km: 3,  vzpon: 440,  opis: 'Na planini Goška ravan' },
  { id: 48, ime: 'Koča na Lubniku',                   visina: 1025, regija: 'Škofjeloško hribovje', tel: '+386 4 512 4000',   lezisca: 25,  odprta: 'Jun–Sep',  lat: 46.1667, lon: 14.0833, km: 3,  vzpon: 500,  opis: 'Nad Škofjo Loko' },

  // POSAVSKO HRIBOVJE
  { id: 49, ime: 'Dom na Šmarni gori',                visina: 669,  regija: 'Posavsko hribovje',    tel: '+386 1 561 1000',   lezisca: 30,  odprta: 'Cel leto', lat: 46.1872, lon: 14.4630, km: 2,  vzpon: 250,  opis: 'Na vrhu Šmarne gore' },
  { id: 50, ime: 'Koča na Kumu',                      visina: 1220, regija: 'Posavsko hribovje',    tel: '+386 1 898 1000',   lezisca: 35,  odprta: 'Jun–Oct',  lat: 46.0833, lon: 15.0667, km: 5,  vzpon: 700,  opis: 'Na vrhu Kuma' },
  { id: 51, ime: 'Koča na Zasavski sveti gori',       visina: 767,  regija: 'Posavsko hribovje',    tel: '+386 3 567 1000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.0500, lon: 15.0167, km: 3,  vzpon: 350,  opis: 'Romarska točka' },
  { id: 52, ime: 'Dom na Limbarski gori',             visina: 625,  regija: 'Posavsko hribovje',    tel: '+386 1 898 2000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.1333, lon: 14.8667, km: 2,  vzpon: 300,  opis: 'Na Limbarski gori' },

  // PRIMORSKA
  { id: 53, ime: 'Koča na Nanosu',                    visina: 1262, regija: 'Primorska',            tel: '+386 5 364 1000',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 45.7667, lon: 14.0333, km: 3,  vzpon: 450,  opis: 'Na planoti Nanos' },
  { id: 54, ime: 'Dom na Snežniku',                   visina: 1796, regija: 'Primorska',            tel: '+386 1 707 1000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5833, lon: 14.4500, km: 5,  vzpon: 700,  opis: 'Na vrhu Snežnika' },
  { id: 55, ime: 'Dom na Slavniku',                   visina: 1028, regija: 'Primorska',            tel: '+386 5 672 1000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.5333, lon: 13.9667, km: 4,  vzpon: 500,  opis: 'Na vrhu Slavnika' },
  { id: 56, ime: 'Koča na Trstelju',                  visina: 643,  regija: 'Primorska',            tel: '+386 5 769 1000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 45.8167, lon: 13.7500, km: 2,  vzpon: 300,  opis: 'Na Kraškem robu' },
  { id: 57, ime: 'Dom pri Izviru Reke',               visina: 560,  regija: 'Primorska',            tel: '+386 5 708 1000',   lezisca: 25,  odprta: 'Apr–Oct',  lat: 45.5500, lon: 14.3500, km: 2,  vzpon: 100,  opis: 'Pri izviru reke Reke' },
  { id: 58, ime: 'Koča na Vremščici',                 visina: 1027, regija: 'Primorska',            tel: '+386 5 769 2000',   lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.7000, lon: 13.9500, km: 3,  vzpon: 400,  opis: 'Na vrhu Vremščice' },

  // POHORJE
  { id: 59, ime: 'Koča na Črnem vrhu',                visina: 1543, regija: 'Pohorje',              tel: '+386 2 603 1000',   lezisca: 40,  odprta: 'Cel leto', lat: 46.5000, lon: 15.3833, km: 4,  vzpon: 400,  opis: 'Na Črnem vrhu na Pohorju' },
  { id: 60, ime: 'Dom na Rogli',                      visina: 1517, regija: 'Pohorje',              tel: '+386 3 757 1000',   lezisca: 50,  odprta: 'Cel leto', lat: 46.4500, lon: 15.3333, km: 3,  vzpon: 300,  opis: 'Na Rogli — smučarsko središče' },
  { id: 61, ime: 'Planinska koča Mariborsko Pohorje', visina: 1320, regija: 'Pohorje',              tel: '+386 2 603 2000',   lezisca: 35,  odprta: 'Cel leto', lat: 46.5333, lon: 15.4000, km: 3,  vzpon: 350,  opis: 'Nad Mariborom' },
  { id: 62, ime: 'Koča na Osankarici',                visina: 1307, regija: 'Pohorje',              tel: '+386 2 603 3000',   lezisca: 30,  odprta: 'Cel leto', lat: 46.4667, lon: 15.4333, km: 3,  vzpon: 300,  opis: 'Na Osankarici na Pohorju' },
  { id: 63, ime: 'Dom na Lovrenškem jezeru',          visina: 1517, regija: 'Pohorje',              tel: '+386 2 603 4000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.5167, lon: 15.3500, km: 4,  vzpon: 350,  opis: 'Pri barjanskih jezerih na Pohorju' },

  // DOLENJSKA & BELA KRAJINA
  { id: 64, ime: 'Koča na Trdinov vrh',               visina: 1178, regija: 'Dolenjska',            tel: '+386 7 384 1000',   lezisca: 30,  odprta: 'Jun–Sep',  lat: 45.8167, lon: 15.2333, km: 4,  vzpon: 500,  opis: 'Na vrhu Gorjancev' },
  { id: 65, ime: 'Dom na Mirni gori',                 visina: 1046, regija: 'Dolenjska',            tel: '+386 7 305 1000',   lezisca: 25,  odprta: 'Jun–Sep',  lat: 45.7167, lon: 15.1000, km: 3,  vzpon: 400,  opis: 'Na Mirni gori' },
  { id: 66, ime: 'Koča na Sveti gori',                visina: 682,  regija: 'Dolenjska',            tel: '+386 7 384 2000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 45.8500, lon: 15.3000, km: 2,  vzpon: 300,  opis: 'Na Sveti gori nad Šmarješkimi Toplicami' },

  // SAVINJSKE ALPE
  { id: 67, ime: 'Dom na Menini',                     visina: 1508, regija: 'Savinjske Alpe',       tel: '+386 3 839 8000',   lezisca: 40,  odprta: 'Jun–Oct',  lat: 46.2500, lon: 14.7833, km: 4,  vzpon: 600,  opis: 'Na Menini planini' },
  { id: 68, ime: 'Koča na Smrekovcu',                 visina: 1577, regija: 'Savinjske Alpe',       tel: '+386 3 839 9000',   lezisca: 35,  odprta: 'Jun–Sep',  lat: 46.4833, lon: 14.7167, km: 4,  vzpon: 500,  opis: 'Na vrhu Smrekovca' },
  { id: 69, ime: 'Dom pod Oljko',                     visina: 950,  regija: 'Savinjske Alpe',       tel: '+386 3 839 3000',   lezisca: 25,  odprta: 'Apr–Oct',  lat: 46.2167, lon: 14.8500, km: 3,  vzpon: 400,  opis: 'V Savinjski dolini' },

  // GORENJSKA
  { id: 70, ime: 'Dom na Bledu',                      visina: 501,  regija: 'Gorenjska',            tel: '+386 4 574 1111',   lezisca: 20,  odprta: 'Cel leto', lat: 46.3683, lon: 14.1146, km: 1,  vzpon: 50,   opis: 'Ob Blejskem jezeru' },
  { id: 71, ime: 'Koča na Vintgarju',                 visina: 520,  regija: 'Gorenjska',            tel: '+386 4 574 2000',   lezisca: 15,  odprta: 'Apr–Oct',  lat: 46.3900, lon: 14.0800, km: 1,  vzpon: 50,   opis: 'Pri Blejskem vintgarju' },
  { id: 72, ime: 'Dom na Pokljuki',                   visina: 1330, regija: 'Gorenjska',            tel: '+386 4 572 0100',   lezisca: 40,  odprta: 'Cel leto', lat: 46.3333, lon: 13.9833, km: 2,  vzpon: 200,  opis: 'Na Pokljuškem visokovju' },
  { id: 73, ime: 'Koča pri Beli Peči',               visina: 1050, regija: 'Gorenjska',            tel: '+386 4 589 4000',   lezisca: 20,  odprta: 'Jun–Sep',  lat: 46.4833, lon: 13.8667, km: 3,  vzpon: 400,  opis: 'V dolini Radovne' },
]

const REGIJE = ['Vse', ...new Set(BAZA_KOC.map(k => k.regija))]

function izracunajCas(km, vzpon) {
  if (km === 0) return 'pri cesti'
  const ure = (km / 4) + (vzpon / 600)
  const h = Math.floor(ure)
  const min = Math.round((ure - h) * 60)
  if (h === 0) return `${min} min`
  if (min === 0) return `${h} h`
  return `${h} h ${min} min`
}

function VisinaBadge({ visina }) {
  const barva = visina > 2000 ? '#991B1B' : visina > 1500 ? '#92400E' : '#065F46'
  const ozadje = visina > 2000 ? '#FEE2E2' : visina > 1500 ? '#FEF3C7' : '#D1FAE5'
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: ozadje, color: barva }}>
      {visina} m
    </span>
  )
}

export default function Koce({ onPotDoKoce }) {
  const [iskanje, setIskanje] = useState('')
  const [regija, setRegija] = useState('Vse')
  const [koce, setKoce] = useState(BAZA_KOC)

  useEffect(() => {
    setKoce(BAZA_KOC.filter(k => {
      const ujema = k.ime.toLowerCase().includes(iskanje.toLowerCase()) ||
                    k.regija.toLowerCase().includes(iskanje.toLowerCase()) ||
                    k.opis.toLowerCase().includes(iskanje.toLowerCase())
      const regijaUjema = regija === 'Vse' || k.regija === regija
      return ujema && regijaUjema
    }))
  }, [iskanje, regija])

  return (
    <div style={{ padding: 16 }}>

      {/* Naslov */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Planinske koče</div>
        <div style={{ fontSize: 12, color: 'var(--besedilo2)' }}>{BAZA_KOC.length} koč · {REGIJE.length - 1} regij po Sloveniji</div>
      </div>

      {/* Iskanje */}
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
          placeholder="Išči kočo, regijo, opis..."
          style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1, background: 'transparent', color: 'var(--besedilo)' }}
        />
        {iskanje && (
          <button onClick={() => setIskanje('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--besedilo2)', fontSize: 16, padding: 0 }}>✕</button>
        )}
      </div>

      {/* Filter regij */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {REGIJE.map(r => (
          <button key={r} onClick={() => setRegija(r)} style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: 20,
            border: '0.5px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            background: regija === r ? 'var(--zelena)' : 'white',
            color: regija === r ? 'white' : 'var(--besedilo2)',
            borderColor: regija === r ? 'var(--zelena)' : 'var(--rob)',
          }}>{r}</button>
        ))}
      </div>

      {/* Število */}
      <div style={{ fontSize: 11, color: 'var(--besedilo2)', marginBottom: 10, fontWeight: 500 }}>
        {koce.length} koč
      </div>

      {/* Seznam */}
      {koce.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--besedilo2)' }}>
          Ni rezultatov za "{iskanje}"
        </div>
      )}

      {koce.map((k) => (
        <div key={k.id} style={{
          background: 'white', borderRadius: 14, padding: '13px 14px',
          marginBottom: 10, border: '0.5px solid var(--rob)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
          {/* Glava kartice */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: 'var(--zelena-sv)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>🏠</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>{k.ime}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--zelena)', fontWeight: 600 }}>{k.regija}</span>
                <VisinaBadge visina={k.visina} />
              </div>
            </div>
          </div>

          {/* Opis */}
          <div style={{ fontSize: 12, color: 'var(--besedilo2)', marginBottom: 10, lineHeight: 1.5 }}>{k.opis}</div>

          {/* Info chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, paddingBottom: 10, borderBottom: '0.5px solid var(--rob)' }}>
            {k.km > 0 && (
              <span style={{ fontSize: 11, background: '#F0FAF0', color: 'var(--zelena-t)', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>
                📏 {k.km} km · ↑{k.vzpon} m · ⏱ {izracunajCas(k.km, k.vzpon)}
              </span>
            )}
            <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>
              🛏 {k.lezisca} ležišč
            </span>
            <span style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--besedilo2)', padding: '3px 8px', borderRadius: 6 }}>
              📅 {k.odprta}
            </span>
          </div>

          {/* Gumbi */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`tel:${k.tel}`} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '8px', background: 'var(--zelena-sv)', borderRadius: 8,
              textDecoration: 'none', color: 'var(--zelena-t)', fontSize: 12, fontWeight: 600,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.62 4.38 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Pokliči
            </a>
            <button
              onClick={() => onPotDoKoce && onPotDoKoce(k)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px', background: 'linear-gradient(135deg, #1F5C1F, #3A9A3A)',
                borderRadius: 8, border: 'none', color: 'white', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 3px 10px rgba(45,122,45,0.3)',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Pot do koče
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
