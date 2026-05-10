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
  const [zacniGPS, setZacniGPS] = useState(false)

  function odpriDetail(pot) {
    setPotDetail(pot)
  }

  function zacniNavigacijo(pot) {
    // Klik "Začni pohod + GPS" v PotDetail
    setPotDetail(null)
    setIzbranaPot(pot)
    setZacniGPS(true)  // Signal za avtomatski start GPS
    setAktiven('nav2')
  }

  function preklopi(zaslon) {
    setPotDetail(null)
    setZacniGPS(false)
    setAktiven(zaslon)
  }

  return (
    <>
      {!splashKoncan && <SplashScreen onKonec={() => setSplashKoncan(true)} />}

      <Header />
      <main className="vsebina">
        {potDetail ? (
          <PotDetail
            pot={potDetail}
            onZacniNavigacijo={zacniNavigacijo}
            onNazaj={() => setPotDetail(null)}
          />
        ) : (
          <>
            {aktiven === 'domov' && <Domov onOdpriPot={odpriDetail} />}
            {aktiven === 'isci' && (
              <Isci
                onOdpriPot={odpriDetail}
                onPotDoKoce={(koca) => {
                  setIzbranaPot({ ime: koca.ime, regija: koca.regija, lat: koca.lat, lon: koca.lon })
                  setAktiven('nav2')
                }}
              />
            )}
            {aktiven === 'zemljevid' && <Zemljevid izbranaPot={izbranaPot} />}
            {aktiven === 'nav2' && (
              <Navigacija
                izbranaPot={izbranaPot}
                avtomatskiStart={zacniGPS}
                onGPSZacet={() => setZacniGPS(false)}
              />
            )}
            {aktiven === 'profil' && <Profil />}
          </>
        )}
      </main>
      <BottomNav aktiven={aktiven} onPreklop={preklopi} />
    </>
  )
}
