const fs = require('fs')
const pot = 'src/zasloni/Zemljevid.jsx'
let k = fs.readFileSync(pot, 'utf8')

// 1. Dodaj state za kompas
const s1 = `  const [hitrost, setHitrost] = useState(0)
  const casTimer = useRef(null)
  const smerRef = useRef(0)`
const n1 = `  const [hitrost, setHitrost] = useState(0)
  const [kompasSmeri, setKompasSmeri] = useState(null)
  const [kompasAktiven, setKompasAktiven] = useState(false)
  const casTimer = useRef(null)
  const smerRef = useRef(0)`
if (k.includes(s1)) { k = k.replace(s1, n1); console.log('✅ 1. State dodan') }
else console.log('⚠️ 1. State ni najden')

// 2. Popravi onOrientacija - Android fix
const s2 = `    function onOrientacija(e) {
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
const n2 = `    function onOrientacija(e) {
      let smer = null
      if (e.webkitCompassHeading != null) {
        smer = e.webkitCompassHeading
      } else if (e.alpha != null) {
        smer = (360 - e.alpha + 360) % 360
      }
      if (smer === null) return
      smerRef.current = smer
      setKompasSmeri(Math.round(smer))
      setKompasAktiven(true)
      const lokacija = gpsLokacija.current
      if (lokacija) posodobiSnop(lokacija[0], lokacija[1], smer)
    }`
if (k.includes(s2)) { k = k.replace(s2, n2); console.log('✅ 2. Android fix') }
else console.log('⚠️ 2. onOrientacija ni najdena')

// 3. Zamenjaj gumb kompas z SVG kompasom
const s3 = `        <button
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
const n3 = `        <div
          onClick={() => {
            const aktiviraj = () => {
              setKompasAktiven(true)
              window.addEventListener('deviceorientationabsolute', onOrientacija, true)
              window.addEventListener('deviceorientation', onOrientacija, true)
            }
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission().then(p => { if (p === 'granted') aktiviraj() }).catch(() => {})
            } else { aktiviraj() }
          }}
          style={{ pointerEvents: 'auto', cursor: 'pointer', width: 82, height: 82, borderRadius: '50%', background: 'white', border: kompasAktiven ? '2px solid #2D7A2D' : '2px solid #D1D5DB', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 100 100" width="76" height="76">
            <circle cx="50" cy="50" r="47" fill="#f5f5f5" stroke="#ccc" strokeWidth="1"/>
            <circle cx="50" cy="50" r="40" fill="white" stroke="#ddd" strokeWidth="0.5"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
              const rad = (deg-90)*Math.PI/180
              const r1=40, r2=deg%90===0?34:37
              return <line key={deg} x1={50+r1*Math.cos(rad)} y1={50+r1*Math.sin(rad)} x2={50+r2*Math.cos(rad)} y2={50+r2*Math.sin(rad)} stroke={deg%90===0?'#555':'#bbb'} strokeWidth={deg%90===0?1.5:1}/>
            })}
            <line x1="50" y1="14" x2="50" y2="86" stroke="#eee" strokeWidth="0.5"/>
            <line x1="14" y1="50" x2="86" y2="50" stroke="#eee" strokeWidth="0.5"/>
            <text x="50" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#CC2222" fontFamily="sans-serif">N</text>
            <text x="50" y="81" textAnchor="middle" fontSize="10" fontWeight="600" fill="#555" fontFamily="sans-serif">S</text>
            <text x="79" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="#555" fontFamily="sans-serif">E</text>
            <text x="21" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="#555" fontFamily="sans-serif">W</text>
            <g transform={`rotate(${kompasSmeri||0},50,50)`}>
              <polygon points="50,16 46,50 50,46 54,50" fill="#CC2222"/>
              <polygon points="50,84 46,50 50,54 54,50" fill="#3366CC"/>
            </g>
            <circle cx="50" cy="50" r="5" fill="#888" stroke="#555" strokeWidth="1"/>
            <circle cx="50" cy="50" r="2.5" fill="#eee"/>
            <text x="50" y="95" textAnchor="middle" fontSize="8" fontWeight="700" fill={kompasAktiven?'#2D7A2D':'#aaa'} fontFamily="sans-serif">{kompasSmeri!==null?kompasSmeri+'°':'tap'}</text>
          </svg>
        </div>`
if (k.includes(s3)) { k = k.replace(s3, n3); console.log('✅ 3. SVG kompas dodan') }
else console.log('⚠️ 3. Gumb ni najden')

fs.writeFileSync(pot, k, 'utf8')
console.log('\n✅ Končano!')
