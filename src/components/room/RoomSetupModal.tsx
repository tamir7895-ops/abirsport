import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDesignStore, RoomShape } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { assetUrl } from '../../lib/assetUrl'

const SHAPES: { key: RoomShape; svg: string }[] = [
  { key: 'rectangle', svg: 'M2,2 L18,2 L18,14 L2,14 Z' },
  { key: 'L', svg: 'M2,2 L18,2 L18,8 L12,8 L12,14 L2,14 Z' },
  { key: 'U', svg: 'M2,2 L8,2 L8,8 L12,8 L12,2 L18,2 L18,14 L2,14 Z' },
  { key: 'T', svg: 'M2,2 L18,2 L18,8 L13,8 L13,14 L7,14 L7,8 L2,8 Z' },
]

export function RoomSetupModal() {
  const { t } = useTranslation()
  const { roomWidth, roomDepth, roomHeight, roomShape, roomCutWidth, roomCutDepth, setRoom, setRoomShape, setRoomCut } = useDesignStore()
  const { closeRoomSetup } = useUiStore()

  const [w, setW] = useState(roomWidth)
  const [d, setD] = useState(roomDepth)
  const [h, setH] = useState(roomHeight)
  const [shape, setShape] = useState<RoomShape>(roomShape)
  const [cutW, setCutW] = useState(roomCutWidth)
  const [cutD, setCutD] = useState(roomCutDepth)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const PRESETS = [
    { label: t('room.small'), desc: `6×8 ${t('room.meter')}`, w: 6, d: 8, h: 3 },
    { label: t('room.medium'), desc: `10×12 ${t('room.meter')}`, w: 10, d: 12, h: 3.5 },
    { label: t('room.large'), desc: `15×20 ${t('room.meter')}`, w: 15, d: 20, h: 4 },
  ]

  const apply = () => {
    const finalW = Math.max(3, Math.min(50, w))
    const finalD = Math.max(3, Math.min(50, d))
    const finalH = Math.max(2.4, Math.min(8, h))
    setRoom(finalW, finalD, finalH)
    setRoomShape(shape)
    if (shape !== 'rectangle') {
      setRoomCut(
        Math.max(1, Math.min(finalW - 1, cutW)),
        Math.max(1, Math.min(finalD - 1, cutD))
      )
    }
    closeRoomSetup()
  }

  const showCutInputs = shape !== 'rectangle'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } as React.CSSProperties}
      onClick={(e) => e.target === e.currentTarget && closeRoomSetup()}
    >
      <div
        className="modal-enter p-6 w-full max-w-md"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          maxHeight: '90vh',
          overflowY: 'auto',
        } as React.CSSProperties}
        dir="rtl"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{t('room.title')}</h2>
          <img src={assetUrl('logo-mark.svg')} alt="" style={{ width: 28, height: 28, opacity: 0.5 }} />
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>{t('room.subtitle')}</p>

        {/* Room Shape Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
            {t('room.shape')}
          </label>
          <div className="flex gap-2">
            {SHAPES.map((s) => {
              const active = shape === s.key
              return (
                <button
                  key={s.key}
                  onClick={() => setShape(s.key)}
                  className="flex-1 py-2 rounded-xl transition-all flex flex-col items-center gap-1"
                  style={{
                    background: active ? 'rgba(227,6,19,0.06)' : '#f8f9fa',
                    border: active ? '1px solid rgba(227,6,19,0.5)' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  } as React.CSSProperties}
                >
                  <svg viewBox="0 0 20 16" width="32" height="24" style={{ fill: 'none', stroke: active ? '#E30613' : '#6b7280', strokeWidth: 1.5 }}>
                    <path d={s.svg} />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#E30613' : '#6b7280' }}>
                    {t(`room.shape_${s.key}`)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 mb-5">
          {PRESETS.map((p) => {
            const active = w === p.w && d === p.d
            return (
              <button
                key={p.label}
                onClick={() => { setW(p.w); setD(p.d); setH(p.h) }}
                className="flex-1 py-2 px-1 rounded-xl text-center transition-all"
                style={{
                  background: active ? 'rgba(227,6,19,0.06)' : '#f8f9fa',
                  border: active ? '1px solid rgba(227,6,19,0.5)' : '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                } as React.CSSProperties}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#E30613' : '#1a1a2e' }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.desc}</div>
              </button>
            )
          })}
        </div>

        {/* Main Dimensions */}
        <div className={`grid ${showCutInputs ? 'grid-cols-3' : 'grid-cols-3'} gap-3 mb-4`}>
          {[
            { label: t('room.length'), value: w, setter: setW, min: 3, max: 50, key: 'w' },
            { label: t('room.width'), value: d, setter: setD, min: 3, max: 50, key: 'd' },
            { label: t('room.height'), value: h, setter: setH, min: 2.4, max: 8, key: 'h' },
          ].map(({ label, value, setter, min, max, key }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{label}</label>
              <input
                type="number"
                value={value}
                min={min}
                max={max}
                step={0.5}
                onChange={(e) => setter(parseFloat(e.target.value) || min)}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
                className="w-full rounded-xl px-3 py-2 text-sm ltr focus:outline-none"
                style={{
                  background: '#f8f9fa',
                  border: focusedField === key ? '1px solid rgba(227,6,19,0.6)' : '1px solid rgba(0,0,0,0.12)',
                  color: '#1a1a2e',
                  boxShadow: focusedField === key ? '0 0 0 3px rgba(227,6,19,0.08)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        {/* Cut Dimensions (for non-rectangle shapes) */}
        {showCutInputs && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: t('room.cutWidth'), value: cutW, setter: setCutW, min: 1, max: w - 1, key: 'cutW' },
              { label: t('room.cutDepth'), value: cutD, setter: setCutD, min: 1, max: d - 1, key: 'cutD' },
            ].map(({ label, value, setter, min, max, key }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{label}</label>
                <input
                  type="number"
                  value={value}
                  min={min}
                  max={max}
                  step={0.5}
                  onChange={(e) => setter(parseFloat(e.target.value) || min)}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl px-3 py-2 text-sm ltr focus:outline-none"
                  style={{
                    background: '#f8f9fa',
                    border: focusedField === key ? '1px solid rgba(227,6,19,0.6)' : '1px solid rgba(0,0,0,0.12)',
                    color: '#1a1a2e',
                    boxShadow: focusedField === key ? '0 0 0 3px rgba(227,6,19,0.08)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        )}

        {/* Preview */}
        <div
          className="rounded-xl p-3 mb-5 text-center text-sm"
          style={{
            background: '#f8f9fa',
            border: '1px solid rgba(0,0,0,0.06)',
            color: '#6b7280',
          } as React.CSSProperties}
        >
          {t('room.floorArea')} <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{(w * d).toFixed(0)} {t('room.sqm')}</span>
          {' · '}
          {t('room.volume')} <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{(w * d * h).toFixed(0)} {t('room.cbm')}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={apply}
            className="flex-1 font-bold py-2.5 rounded-xl transition-colors"
            style={{ background: '#E30613', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Heebo, sans-serif' } as React.CSSProperties}
          >
            {t('room.confirm')}
          </button>
          <button
            onClick={closeRoomSetup}
            className="px-4 py-2.5 rounded-xl transition-colors text-sm"
            style={{
              background: '#f8f9fa',
              color: '#6b7280',
              border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            } as React.CSSProperties}
          >
            {t('room.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
