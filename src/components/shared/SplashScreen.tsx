import { useEffect, useState } from 'react'
import { Logo } from './Logo'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 1800)
    const t2 = setTimeout(onDone, 2300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className={exiting ? 'splash-exit' : ''}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 50%, #ffffff 100%)',
        gap: 24,
      }}
    >
      <div className="splash-logo">
        <Logo size="lg" variant="full" />
      </div>

      {/* Loading bar */}
      <div style={{
        width: 120, height: 3, borderRadius: 3,
        background: 'rgba(0,0,0,0.06)', overflow: 'hidden',
        marginTop: 8,
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: 'linear-gradient(90deg, #E30613, #ff4d5a)',
          animation: 'loadBar 1.8s ease-out forwards',
        }} />
      </div>

      <div style={{ fontSize: 12, color: '#9ca3af', letterSpacing: '0.1em' }}>
        GYM DESIGN SIMULATOR
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
