import React, { useState } from 'react'
import Header from './komponente/Header'
import BottomNav from './komponente/BottomNav'
import Domov from './zasloni/Domov'
import Isci from './zasloni/Isci'
import PotDetail from './zasloni/PotDetail'
import Zemljevid from './zasloni/Zemljevid'
import Navigacija from './zasloni/Navigacija'
import Profil from './zasloni/Profil'
import SplashScreen from './zasloni/SplashScreen'

export default function App() {
  const [splashKoncan, setSplashKoncan] = useState(false)
  const [aktiven, setAktiven] = useState('domov')
  const [izbranaPot, setIzbranaPot] = useState(null)
  const [potDetail, setPotDetail] = useState(null)

  function odpriDetail(pot) { setPotDetail(pot) }

  function zacniPohod(pot) {
    setPotDetail(null)
    setIzbranaPot(pot)
    setAktiven('zemljevid')
  }

  function naZadaj() { setPotDetail(null) }

  function preklopi(zaslon) { setPotDetail(null); setAktiven(zaslon) }

  return (
    <>
      {!splashKoncan && <SplashScreen onKonec={() => setSplashKoncan(true)} />}

      <Header />
      <main className="vsebina">
        {potDetail ? (
          <PotDetail pot={potDetail} onIzberiIzhodisce={zacniPohod} onNazaj={naZadaj} />
        ) : (
          <>
            {aktiven === 'domov' && <Domov onOdpriPot={odpriDetail} />}
            {aktiven === 'isci' && (
              <Isci
                onOdpriPot={odpriDetail}
                onPotDoKoce={(koca) => {
                  setIzbranaPot({ ime: koca.ime, regija: koca.regija, lat: koca.lat, lon: koca.lon })
                  setAktiven('zemljevid')
                }}
              />
            )}
            {aktiven === 'zemljevid' && (
              <div style={{ position: 'relative', height: '100%' }}>
                <Zemljevid izbranaPot={izbranaPot} />
              </div>
            )}
            {aktiven === 'nav2' && <Navigacija izbranaPot={izbranaPot} />}
            {aktiven === 'profil' && <Profil />}
          </>
        )}
      </main>
      <BottomNav aktiven={aktiven} onPreklop={preklopi} />
    </>
  )
}
