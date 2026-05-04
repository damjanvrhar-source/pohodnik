import React from 'react'

export default function Navigacija() {
  return (
    <div style={{ padding: 16 }}>

      {/* Sporočilo */}
      <div style={{
        background: 'white', borderRadius: 12, padding: 24,
        border: '0.5px solid var(--rob)', textAlign: 'center',
        marginBottom: 12
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Navigacija ni aktivna
        </div>
        <div style={{ fontSize: 14, color: 'var(--besedilo2)', lineHeight: 1.5 }}>
          Pojdi na <strong>Iskanje</strong>, izberi pot in izhodišče ter klikni <strong>"Začni pohod od tukaj"</strong>.
        </div>
      </div>

      {/* SOS gumb */}
      <button style={{
        width: '100%', background: 'var(--rdeca)', color: 'white',
        border: 'none', borderRadius: 10, padding: 14,
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        letterSpacing: '0.5px', marginTop: 8
      }}>
        🆘 SOS — klic za pomoč
      </button>

    </div>
  )
}
