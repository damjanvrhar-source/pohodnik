import React, { useState } from 'react'
import Header from './komponente/Header'
import BottomNav from './komponente/BottomNav'
import Domov from './zasloni/Domov'
import Iskanje from './zasloni/Iskanje'
import Zemljevid from './zasloni/Zemljevid'
import Navigacija from './zasloni/Navigacija'
import Profil from './zasloni/Profil'

const zasloni = {
  domov:      <Domov />,
  iskanje:    <Iskanje />,
  zemljevid:  <Zemljevid />,
  navigacija: <Navigacija />,
  profil:     <Profil />,
}

export default function App() {
  const [aktiven, setAktiven] = useState('domov')

  return (
    <>
      <Header />

      <main className="vsebina">
        {/* Zemljevid zaslon je full-screen, ostali imajo normalen scroll */}
        {aktiven === 'zemljevid'
          ? <div style={{ position: 'relative', height: '100%' }}>{zasloni.zemljevid}</div>
          : zasloni[aktiven]
        }
      </main>

      <BottomNav aktiven={aktiven} onPreklop={setAktiven} />
    </>
  )
}
