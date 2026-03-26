interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'mark' | 'text'
  className?: string
}

const SIZES = {
  sm: { mark: 28, text: 12, sub: 9, gap: 8 },
  md: { mark: 34, text: 14, sub: 10, gap: 10 },
  lg: { mark: 48, text: 22, sub: 12, gap: 14 },
}

/** Dumbbell SVG mark rendered inline */
function DumbbellMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#E30613" />
      <rect x="8" y="16" width="7" height="16" rx="2" fill="white" />
      <rect x="17" y="19" width="14" height="10" rx="1.5" fill="white" />
      <rect x="33" y="16" width="7" height="16" rx="2" fill="white" />
      <rect x="15" y="22" width="18" height="4" rx="1" fill="white" />
    </svg>
  )
}

export function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const s = SIZES[size]

  if (variant === 'mark') {
    return <DumbbellMark size={s.mark} />
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, flexShrink: 0 }}>
      <DumbbellMark size={s.mark} />
      {variant === 'full' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
            <span style={{ color: '#1a1a2e', fontWeight: 900, fontSize: s.text, fontFamily: 'Heebo, sans-serif' }}>
              ABIR
            </span>
            <span style={{ color: '#E30613', fontWeight: 400, fontSize: s.text, fontFamily: 'Heebo, sans-serif' }}>
              SPORT
            </span>
          </div>
          <div style={{ color: '#9ca3af', fontSize: s.sub, lineHeight: 1, marginTop: 3, letterSpacing: '0.05em' }}>
            GYM SIMULATOR
          </div>
        </div>
      )}
    </div>
  )
}
