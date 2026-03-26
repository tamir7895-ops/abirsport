import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { Equipment } from '../../types'

const FALLBACK_ICONS: Record<string, string> = {
  treadmill: '🏃', elliptical: '🔄', exercise_bike: '🚴',
  spinning_bike: '🚴', rowing_machine: '🚣', cable_machine: '⚙️',
  multi_gym: '🏋️', smith_machine: '🔩', bench_press: '💪',
  power_rack: '🏗️', dumbbell_rack: '🏋️', leg_press: '🦵',
  lat_pulldown: '⬇️', chest_press: '💪', functional_trainer: '🔗',
  reformer: '🧘', generic_machine: '⚙️',
}

interface Props {
  equipment: Equipment
  onAdd: () => void
  onRemove?: () => void
  onQtyChange?: (qty: number) => void
  cartQuantity?: number
  variant?: 'grid' | 'sidebar' | 'list'
  draggable?: boolean
  onDragStart?: () => void
}

export function EquipmentCard({ equipment: eq, onAdd, onRemove, cartQuantity = 0, variant = 'grid', draggable, onDragStart }: Props) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const color = eq.model_type?.fallback_color ?? '#5588bb'
  const fallbackIcon = FALLBACK_ICONS[eq.model_type?.name ?? ''] ?? '🏋️'
  const inCart = cartQuantity > 0

  const dragProps = draggable ? {
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData('equipment-id', eq.id)
      onDragStart?.()
    },
  } : {}

  // Sidebar variant (Step 2 cart panel)
  if (variant === 'sidebar') {
    return (
      <div
        {...dragProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'var(--bg-2)' : 'var(--bg-0)',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          marginBottom: 6,
          overflow: 'hidden',
          transition: 'background 0.2s',
          cursor: draggable ? 'grab' : 'default',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', direction: 'ltr' }}>
          <div style={{ width: 52, height: 52, flexShrink: 0, background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {eq.image_url && !imgError ? (
              <img src={eq.image_url} alt={eq.name_he} referrerPolicy="no-referrer" onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{fallbackIcon}</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: '6px 10px', direction: 'rtl' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name_he}</div>
            <div style={{ fontSize: 11, color: '#E30613', fontWeight: 700, direction: 'ltr', marginTop: 2 }}>{eq.price != null ? `₪${Number(eq.price).toLocaleString()}` : 'צור קשר'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', direction: 'ltr', flexShrink: 0 }}>
            <button onClick={onRemove} style={qtyBtn('var(--bg-2)', 'var(--text-secondary)')}>−</button>
            <span style={{ width: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{cartQuantity}</span>
            <button onClick={onAdd} style={qtyBtn('#E30613', '#fff')}>+</button>
          </div>
        </div>
      </div>
    )
  }

  // List variant (full-width row for catalog)
  if (variant === 'list') {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'var(--card-hover)' : 'var(--card-bg)',
          borderRadius: 12,
          border: inCart ? '1.5px solid #E30613' : '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.15s ease',
          boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ width: 80, height: 80, flexShrink: 0, background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {eq.image_url && !imgError ? (
            <img src={eq.image_url} alt={eq.name_he} referrerPolicy="no-referrer" onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{fallbackIcon}</div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: '10px 14px', direction: 'rtl', minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name_he}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
            {eq.brand && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{eq.brand.name}</span>}
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', direction: 'ltr' }}>
              {eq.width_cm && eq.depth_cm && eq.height_cm ? `${eq.width_cm}×${eq.depth_cm}×${eq.height_cm} ${t('catalog.cm')}` : ''}
            </span>
          </div>
        </div>

        {/* Price */}
        <div style={{ padding: '0 12px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#E30613', direction: 'ltr' }}>
            {eq.price != null ? `₪${Number(eq.price).toLocaleString()}` : 'צור קשר'}
          </div>
        </div>

        {/* Action */}
        <div style={{ padding: '0 14px 0 8px', flexShrink: 0, direction: 'ltr' }}>
          {!inCart ? (
            <button
              onClick={onAdd}
              style={{
                background: '#E30613', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Heebo, sans-serif', whiteSpace: 'nowrap',
              }}
            >
              {t('catalog.addToCart')}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={onRemove} style={qtyBtnLg()}>−</button>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', width: 24, textAlign: 'center' }}>{cartQuantity}</span>
              <button onClick={onAdd} style={qtyBtnLg('#E30613')}>+</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid variant (Step 1)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 14,
        border: inCart ? '1.5px solid #E30613' : '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.15s',
        cursor: 'default',
      }}
    >
      {/* Image */}
      <div style={{ height: isMobile ? 110 : 150, background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {eq.image_url && !imgError ? (
          <img src={eq.image_url} alt={eq.name_he} referrerPolicy="no-referrer" onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{fallbackIcon}</div>
        )}
        {inCart && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: '#E30613', color: '#fff', borderRadius: 20,
            padding: '3px 9px', fontSize: 10, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(227,6,19,0.4)',
          }}>
            {cartQuantity} {t('catalog.inCart')}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: isMobile ? '8px 8px 4px' : '12px 12px 8px', flex: 1, direction: 'rtl' }}>
        <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name_he}</div>
        {eq.brand && <div style={{ fontSize: isMobile ? 10 : 11, color: 'var(--text-secondary)', marginBottom: isMobile ? 2 : 4 }}>{eq.brand.name}</div>}
        {!isMobile && (
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', direction: 'ltr', marginBottom: 8 }}>
            {eq.width_cm && eq.depth_cm && eq.height_cm ? `${eq.width_cm}×${eq.depth_cm}×${eq.height_cm} ${t('catalog.cm')}` : ''}
          </div>
        )}
        <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: '#E30613', direction: 'ltr' }}>
          {eq.price != null ? `₪${Number(eq.price).toLocaleString()}` : 'צור קשר'}
        </div>
      </div>

      {/* Add/Qty controls */}
      <div style={{ padding: isMobile ? '0 8px 8px' : '0 12px 12px', direction: 'ltr' }}>
        {!inCart ? (
          <button
            onClick={onAdd}
            onMouseEnter={e => (e.currentTarget.style.background = '#c7050f')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E30613')}
            style={{
              width: '100%', background: '#E30613', color: '#fff', border: 'none',
              borderRadius: 9, padding: '9px 0', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Heebo, sans-serif', transition: 'background 0.2s',
            }}
          >
            {t('catalog.addToCart')}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
            <button onClick={onRemove} style={qtyBtnLg()}>−</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{cartQuantity}</span>
            <button onClick={onAdd} style={qtyBtnLg('#E30613')}>+</button>
          </div>
        )}
      </div>
    </div>
  )
}

function qtyBtn(bg: string, color: string): React.CSSProperties {
  return {
    background: bg, color, border: 'none',
    width: 28, height: 52, fontSize: 16,
    cursor: 'pointer', fontFamily: 'Heebo, sans-serif', flexShrink: 0,
    transition: 'background 0.15s',
  }
}

function qtyBtnLg(bg = 'var(--bg-2)'): React.CSSProperties {
  return {
    background: bg, color: bg === 'var(--bg-2)' ? 'var(--text-primary)' : '#fff', border: 'none',
    borderRadius: 9, width: 36, height: 36, fontSize: 18,
    cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
    transition: 'background 0.15s',
  }
}
