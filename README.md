# PotniK — pohodni portal za Slovenijo

PWA mobilna aplikacija · React + Vite · v2.0

---

## Zahteve

- [Node.js](https://nodejs.org/) — verzija 18 ali novejša

---

## Zagon (prvič)

```bash
# 1. Pojdi v mapo projekta
cd potnik

# 2. Namesti odvisnosti (samo enkrat)
npm install

# 3. Zaženi razvojni strežnik
npm run dev
```

Odpri brskalnik na: **http://localhost:5173**

---

## Zagon (vsak naslednji)

```bash
cd potnik
npm run dev
```

---

## Gradnja za objavo

```bash
npm run build
npm run preview   # lokalni predogled produkcijske verzije
```

---

## Struktura projekta

```
potnik/
├── index.html
├── vite.config.js          ← PWA nastavitve + offline tile caching
├── src/
│   ├── main.jsx            ← vstopna točka
│   ├── App.jsx             ← routing med zasloni
│   ├── index.css           ← globalni stilji, barvna shema
│   ├── komponente/
│   │   ├── Header.jsx      ← glava z logotipom in zastavo
│   │   └── BottomNav.jsx   ← spodnja navigacija (5 zavihkov)
│   └── zasloni/
│       ├── Domov.jsx       ← vreme, statistike, priporočene poti
│       ├── Iskanje.jsx     ← iskanje in filter poti
│       ├── Zemljevid.jsx   ← topo zemljevid (Leaflet v naslednji fazi)
│       ├── Navigacija.jsx  ← HUD, profil višine, ARSO opozorila
│       └── Profil.jsx      ← statistike, značke, zgodovina
```

---

## Naslednja faza

- Leaflet.js + OpenTopoMap tiles (interaktivni zemljevid)
- GPS sledenje: `navigator.geolocation.watchPosition()`
- GPX parser + prikaz poti
- ARSO API za vreme
