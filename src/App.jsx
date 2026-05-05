import React, { useState } from 'react'
import Header from './komponente/Header'
import BottomNav from './komponente/BottomNav'
import Domov from './zasloni/Domov'
import Iskanje from './zasloni/Iskanje'
import PotDetail from './zasloni/PotDetail'
import Zemljevid from './zasloni/Zemljevid'
import Koce from './zasloni/Koce'
import Profil from './zasloni/Profil'

export default function App() {
  const [aktiven, setAktiven] = useState('domov')
  const [izbranaPot, setIzbranaPot] = useState(null)
  const [potDetail, setPotDetail] = useState(null)

  function odpriDetail(pot) { setPotDetail(pot) }
  function zacniPohod(pot) { setPotDetail(null); setIzbranaPot(pot); setAktiven('zemljevid') }
  function naZadaj() { setPotDetail(null) }
  function preklopi(zaslon) { setPotDetail(null); setAktiven(zaslon) }

  return (
    <>
      <Header />
      <main className="vsebina">
        {potDetail ? (
          <PotDetail pot={potDetail} onIzberiIzhodisce={zacniPohod} onNazaj={naZadaj} />
        ) : (
          <>
            {aktiven === 'domov' && <Domov />}
            {aktiven === 'iskanje' && <Iskanje onZacniPohod={odpriDetail} />}
            {aktiven === 'zemljevid' && (
              <div style={{ position: 'relative', height: '100%' }}>
                <Zemljevid izbranaPot={izbranaPot} />
              </div>
            )}
            {aktiven === 'navigacija' && <Koce onPotDoKoce={(koca) => {
              setIzbranaPot({ ime: koca.ime, regija: koca.regija, lat: koca.lat, lon: koca.lon })
              setAktiven('zemljevid')
            }} />}
            {aktiven === 'profil' && <Profil />}
          </>
        )}
      </main>
      <BottomNav aktiven={aktiven} onPreklop={preklopi} />
    </>
  )
}
