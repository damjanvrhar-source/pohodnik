const fs = require('fs')
const pot = 'src/zasloni/Zemljevid.jsx'
let k = fs.readFileSync(pot, 'utf8')

// 1. Dodaj kompasSmeri state (za nov SVG kompas)
const stara1 = `  const [hitrost, setHitrost] = useState(0)
  const casTimer = useRef(null)
  const smerRef = useRef(0)`

const nova1 = `  const [hitrost, setHitrost] = useState(0)
  const [kompasSmeri, setKompasSmeri] = useState(null)
  const [kompasAktiven, setKompasAktiven] = useState(false)
  const casTimer = useRef(null)
  const smerRef = useRef(0)`

if (k.includes(stara1)) { k = k.replace(stara1, nova1); console.log('✅ 1. State dodan') }
else console.log('⚠️ 1. State ni najden')

// 2. Popravi Android kompas logiko v onOrientacija
const stara2 = `    function onOrientacija(e) {
      let smer = 0
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        smer = e.webkitCompassHeading
      } else if (e.absolute && e.alpha !== null) {
        smer = 360 - e.alpha
      } else {
        return // Ni veljavnih podatkov
      }
      smerRef.current = smer
      const lokacija = gpsLokacija.current
      if (lokacija && map) {
        if (snopMarker.current) map.removeLayer(snopMarker.current)
        snopMarker.current = L.marker(lokacija, { icon: ustvariSnopIkono(smer), zIndexOffset: -100 }).addTo(map)
      }
    }`

const nova2 = `    function onOrientacija(e) {
      let smer = null
      if (e.webkitCompassHeading != null) {
        // iOS — direktno kompas smer
        smer = e.webkitCompassHeading
      } else if (e.alpha != null) {
        // Android — alpha je rotacija zaslona, ne kompas!
        // Za absolutni event: smer = 360 - alpha
        // Za navadni event: potrebujemo popravek za magnetno deklinacijo
        smer = (360 - e.alpha) % 360
      }
      if (smer === null) return
      smer = (smer + 360) % 360
      smerRef.current = smer
      setKompasSmeri(Math.round(smer))
      setKompasAktiven(true)
      const lokacija = gpsLokacija.current
      if (lokacija && map) {
        posodobiSnop(lokacija[0], lokacija[1], smer)
      }
    }`

if (k.includes(stara2)) { k = k.replace(stara2, nova2); console.log('✅ 2. Android kompas popravljen') }
else console.log('⚠️ 2. onOrientacija ni najdena')

// 3. Zamenjaj gumb Kompas z novim SVG kompasom
const stara3 = `        <button
          onClick={() => {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission().then(p => {
                if (p === 'granted') {
                  window.addEventListener('deviceorientation', (e) => {
                    const smer = e.webkitCompassHeading ?? (360 - (e.alpha || 0))
                    smerRef.current = smer
                    const lok = gpsLokacija.current
                    const map = mapInstanca.current
                    if (lok && map) {
                      const lok2 = gpsLokacija.current
                      if (lok2) posodobiSnop(lok2[0], lok2[1], smer)
                    }
                  }, true)
                }
              }).catch(() => {})
            }
          }}
          style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
        >
          🧭 Kompas
        </button>`

const nova3 = `        <div
          onClick={() => {
            const aktiviraj = () => {
              setKompasAktiven(true)
              window.addEventListener('deviceorientationabsolute', onOrientacijaZunanji, true)
              window.addEventListener('deviceorientation', onOrientacijaZunanji, true)
            }
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission().then(p => { if (p === 'granted') aktiviraj() }).catch(() => {})
            } else {
              aktiviraj()
            }
          }}
          style={{ pointerEvents: 'auto', cursor: 'pointer', width: 82, height: 82, borderRadius: '50%', background: kompasAktiven ? 'white' : '#f8f8f8', border: kompasAktiven ? '2px solid #2D7A2D' : '2px solid #D1D5DB', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <svg viewBox="0 0 100 100" width="78" height="78">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="47" fill="#f5f5f5" stroke="#ccc" strokeWidth="1"/>
            <circle cx="50" cy="50" r="42" fill="white" stroke="#ddd" strokeWidth="0.5"/>
            {/* Degree ticks */}
            {Array.from({length: 72}, (_, i) => {
              const deg = i * 5
              const rad = (deg - 90) * Math.PI / 180
              const r1 = 42, r2 = i % 2 === 0 ? 37 : 39
              return <line key={deg}
                x1={50 + r1 * Math.cos(rad)} y1={50 + r1 * Math.sin(rad)}
                x2={50 + r2 * Math.cos(rad)} y2={50 + r2 * Math.sin(rad)}
                stroke={i % 18 === 0 ? '#555' : '#bbb'} strokeWidth={i % 18 === 0 ? 1.5 : 0.8}
              />
            })}
            {/* Inner face */}
            <circle cx="50" cy="50" r="36" fill="white" stroke="#eee" strokeWidth="0.5"/>
            {/* Cross lines */}
            <line x1="50" y1="18" x2="50" y2="82" stroke="#eee" strokeWidth="0.5"/>
            <line x1="18" y1="50" x2="82" y2="50" stroke="#eee" strokeWidth="0.5"/>
            {/* Cardinal labels */}
            <text x="50" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="#CC2222" fontFamily="sans-serif">N</text>
            <text x="50" y="78" textAnchor="middle" fontSize="9" fontWeight="600" fill="#555" fontFamily="sans-serif">S</text>
            <text x="77" y="54" textAnchor="middle" fontSize="9" fontWeight="600" fill="#555" fontFamily="sans-serif">E</text>
            <text x="23" y="54" textAnchor="middle" fontSize="9" fontWeight="600" fill="#555" fontFamily="sans-serif">W</text>
            {/* Needle — rotira glede na smer */}
            <g transform={\`rotate(\${kompasSmeri || 0}, 50, 50)\`}>
              <polygon points="50,16 46,50 50,46 54,50" fill="#CC2222"/>
              <polygon points="50,84 46,50 50,54 54,50" fill="#3366CC"/>
            </g>
            {/* Center */}
            <circle cx="50" cy="50" r="5" fill="#888" stroke="#555" strokeWidth="1"/>
            <circle cx="50" cy="50" r="2.5" fill="#ddd"/>
            {/* Stopinje */}
            {kompasSmeri !== null && (
              <text x="50" y="94" textAnchor="middle" fontSize="8" fontWeight="700" fill={kompasAktiven ? '#2D7A2D' : '#999'} fontFamily="sans-serif">{kompasSmeri}°</text>
            )}
            {!kompasAktiven && (
              <text x="50" y="94" textAnchor="middle" fontSize="7" fill="#aaa" fontFamily="sans-serif">tap</text>
            )}
          </svg>
        </div>`

if (k.includes(stara3)) { k = k.replace(stara3, nova3); console.log('✅ 3. SVG kompas dodan') }
else console.log('⚠️ 3. Gumb kompas ni najden')

// 4. Dodaj onOrientacijaZunanji funkcijo (pred sosKlic)
const stara4 = `  function sosKlic() {`
const nova4 = `  function onOrientacijaZunanji(e) {
    let smer = null
    if (e.webkitCompassHeading != null) {
      smer = e.webkitCompassHeading
    } else if (e.alpha != null) {
      smer = (360 - e.alpha) % 360
    }
    if (smer === null) return
    smer = (smer + 360) % 360
    smerRef.current = smer
    setKompasSmeri(Math.round(smer))
    setKompasAktiven(true)
    const lok = gpsLokacija.current
    if (lok) posodobiSnop(lok[0], lok[1], smer)
  }

  function sosKlic() {`

if (k.includes(stara4)) { k = k.replace(stara4, nova4); console.log('✅ 4. onOrientacijaZunanji dodan') }
else console.log('⚠️ 4. sosKlic ni najden')

fs.writeFileSync(pot, k, 'utf8')
console.log('\n✅ Končano! Zaženi: git add -A && git commit -m "Nov kompas + Android fix" && git push')
