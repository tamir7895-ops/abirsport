import { useTranslation } from 'react-i18next'
import { useDesignStore, FloorTexture } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { EquipmentCard } from '../catalog/EquipmentCard'
import { autoArrange } from './AutoArrange'

const FLOOR_OPTIONS: { key: FloorTexture; color: string }[] = [
  { key: 'rubber', color: '#4a4a4a' },
  { key: 'wood', color: '#c4956a' },
  { key: 'concrete', color: '#b0b0b0' },
  { key: 'turf', color: '#5a9e4b' },
]

export function CartPanel() {
  const { t } = useTranslation()
  const cartItems = useDesignStore((s) => s.cartItems)
  const placedItems = useDesignStore((s) => s.placedItems)
  const addToCart = useDesignStore((s) => s.addToCart)
  const removeFromCart = useDesignStore((s) => s.removeFromCart)
  const updateCartQty = useDesignStore((s) => s.updateCartQty)
  const cartCount = useDesignStore((s) => s.cartCount)
  const loadFromSaved = useDesignStore((s) => s.loadFromSaved)
  const saveToHistory = useDesignStore((s) => s.saveToHistory)
  const roomWidth = useDesignStore((s) => s.roomWidth)
  const roomDepth = useDesignStore((s) => s.roomDepth)
  const roomHeight = useDesignStore((s) => s.roomHeight)
  const floorTexture = useDesignStore((s) => s.floorTexture)
  const setFloorTexture = useDesignStore((s) => s.setFloorTexture)

  const openRoomSetup = useUiStore((s) => s.openRoomSetup)
  const openTemplates = useUiStore((s) => s.openTemplates)
  const goNextStep = useUiStore((s) => s.goNextStep)
  const setDragEquipmentId = useUiStore((s) => s.setDragEquipmentId)

  const getCartQty = (id: string) => cartItems.find((c) => c.equipment.id === id)?.quantity ?? 0

  const handleAutoArrange = () => {
    const arranged = autoArrange(cartItems, roomWidth, roomDepth)
    loadFromSaved(arranged, { width: roomWidth, depth: roomDepth, height: roomHeight })
  }

  const handleNextStep = () => {
    if (placedItems.length > 0) saveToHistory()
    goNextStep()
  }

  const canArrange = cartItems.length > 0
  const canProceed = placedItems.length > 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', width: '100%',
      background: 'var(--bg-0)',
      borderLeft: '1px solid var(--border-medium)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border-medium)',
        flexShrink: 0,
        background: 'linear-gradient(180deg, var(--bg-1) 0%, transparent 100%)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
          🛒 {t('cart.title')}
          {cartCount() > 0 && (
            <span style={{
              marginRight: 8, marginLeft: 8,
              background: '#E30613', color: '#fff',
              borderRadius: 9999, padding: '2px 8px', fontSize: 10, fontWeight: 700,
            }}>
              {cartCount()}
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {t('cart.dragHint')}
        </div>
      </div>

      {/* Cart items list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12, paddingTop: 32 }}>
            {t('cart.addFromCatalog')}
          </div>
        ) : (
          cartItems.map((item) => (
            <EquipmentCard
              key={item.equipment.id}
              equipment={item.equipment}
              variant="sidebar"
              cartQuantity={getCartQty(item.equipment.id)}
              draggable
              onDragStart={() => setDragEquipmentId(item.equipment.id)}
              onAdd={() => addToCart(item.equipment)}
              onRemove={() => {
                const qty = getCartQty(item.equipment.id)
                if (qty <= 1) removeFromCart(item.equipment.id)
                else updateCartQty(item.equipment.id, qty - 1)
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-medium)',
        padding: '12px 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: 'var(--bg-0)',
      }}>
        {/* Stats */}
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
          {placedItems.length} {t('cart.placed')} / {cartCount()} {t('cart.inCart')}
        </div>

        {/* Floor texture selector */}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {FLOOR_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFloorTexture(opt.key)}
              title={t(`floor.${opt.key}`)}
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: opt.color,
                border: floorTexture === opt.key ? '2px solid #E30613' : '2px solid var(--border-medium)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                boxShadow: floorTexture === opt.key ? '0 0 0 2px rgba(227,6,19,0.2)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Auto arrange */}
        <button
          onClick={handleAutoArrange}
          disabled={!canArrange}
          onMouseEnter={e => { if (canArrange) e.currentTarget.style.filter = 'brightness(1.15)' }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
          style={{
            width: '100%',
            background: canArrange
              ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
              : 'var(--bg-2)',
            color: canArrange ? '#fff' : 'var(--text-tertiary)',
            border: canArrange ? 'none' : '1px solid var(--border-subtle)',
            borderRadius: 10, padding: '11px 0',
            fontSize: 13, fontWeight: 700,
            cursor: canArrange ? 'pointer' : 'not-allowed',
            fontFamily: 'Heebo, sans-serif',
            opacity: canArrange ? 1 : 0.5,
            transition: 'opacity 0.2s, filter 0.2s',
          }}
        >
          {t('cart.autoArrange')}
        </button>

        {/* Templates */}
        <button
          onClick={openTemplates}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(227,6,19,0.08)'
            e.currentTarget.style.borderColor = '#E30613'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-1)'
            e.currentTarget.style.borderColor = 'var(--border-medium)'
          }}
          style={{
            width: '100%',
            background: 'var(--bg-1)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 10, padding: '9px 0',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          🗂️ {t('templates.title')}
        </button>

        {/* Room settings */}
        <button
          onClick={openRoomSetup}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-1)'
          }}
          style={{
            width: '100%',
            background: 'var(--bg-1)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 10, padding: '9px 0',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          {t('cart.roomSettings')}
        </button>

        {/* Next step */}
        <button
          onClick={handleNextStep}
          disabled={!canProceed}
          onMouseEnter={e => { if (canProceed) e.currentTarget.style.background = '#c7050f' }}
          onMouseLeave={e => { if (canProceed) e.currentTarget.style.background = '#E30613' }}
          style={{
            width: '100%',
            background: canProceed ? '#E30613' : 'var(--bg-2)',
            color: '#fff', border: 'none',
            borderRadius: 10, padding: '11px 0',
            fontSize: 13, fontWeight: 700,
            cursor: canProceed ? 'pointer' : 'not-allowed',
            fontFamily: 'Heebo, sans-serif',
            opacity: canProceed ? 1 : 0.4,
            transition: 'background 0.2s',
          }}
        >
          {t('cart.toQuote')}
        </button>
      </div>
    </div>
  )
}
