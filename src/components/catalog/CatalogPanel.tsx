import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchCategories, fetchEquipment } from '../../lib/api'
import { useDesignStore } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { Category, Equipment } from '../../types'
import { EquipmentCard } from './EquipmentCard'
import { Logo } from '../shared/Logo'

export function CatalogPanel() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)

  const addToCart = useDesignStore((s) => s.addToCart)
  const removeFromCart = useDesignStore((s) => s.removeFromCart)
  const updateCartQty = useDesignStore((s) => s.updateCartQty)
  const cartItems = useDesignStore((s) => s.cartItems)
  const cartCount = useDesignStore((s) => s.cartCount)
  const cartTotal = useDesignStore((s) => s.cartTotal)
  const goNextStep = useUiStore((s) => s.goNextStep)
  const catalogView = useUiStore((s) => s.catalogView)
  const setCatalogView = useUiStore((s) => s.setCatalogView)
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchEquipment(selectedCat ?? undefined)
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCat])

  const filtered = equipment.filter((eq) =>
    search === '' ||
    eq.name_he.includes(search) ||
    (eq.brand?.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const getCartQty = (id: string) => cartItems.find((c) => c.equipment.id === id)?.quantity ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-1)' }}>

      {/* Header */}
      <div style={{ padding: isMobile ? '12px 12px 10px' : '18px 20px 14px', borderBottom: '1px solid var(--border-medium)', flexShrink: 0, background: 'var(--bg-0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 10 : 14 }}>
          <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: 'var(--text-primary)' }}>{t('catalog.title')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Grid/List toggle */}
            <div style={{
              display: 'flex', borderRadius: 8, overflow: 'hidden',
              border: '1px solid var(--border-medium)',
            }}>
              <button
                onClick={() => setCatalogView('grid')}
                style={{
                  padding: '5px 10px', fontSize: 14, border: 'none', cursor: 'pointer',
                  background: catalogView === 'grid' ? '#E30613' : 'var(--bg-1)',
                  color: catalogView === 'grid' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
                title={t('catalog.gridView')}
              >
                ⊞
              </button>
              <button
                onClick={() => setCatalogView('list')}
                style={{
                  padding: '5px 10px', fontSize: 14, border: 'none', cursor: 'pointer',
                  borderRight: '1px solid var(--border-subtle)',
                  background: catalogView === 'list' ? '#E30613' : 'var(--bg-1)',
                  color: catalogView === 'list' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
                title={t('catalog.listView')}
              >
                ☰
              </button>
            </div>
            <Logo size="sm" variant="mark" />
          </div>
        </div>
        <input
          type="text"
          placeholder={t('catalog.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: '100%',
            background: 'var(--bg-1)',
            border: searchFocused ? '1px solid rgba(227,6,19,0.6)' : '1px solid var(--border-medium)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'Heebo, sans-serif',
            boxSizing: 'border-box',
            boxShadow: searchFocused ? '0 0 0 3px rgba(227,6,19,0.08)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 20px', overflowX: 'auto', borderBottom: '1px solid var(--border-medium)', flexShrink: 0, background: 'var(--bg-0)' }}>
        <button onClick={() => setSelectedCat(null)} style={catBtn(selectedCat === null)}>{t('catalog.all')}</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={catBtn(selectedCat === cat.id)}>
            {cat.name_he}
          </button>
        ))}
      </div>

      {/* Equipment grid/list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '20px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: catalogView === 'grid' ? (isMobile ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)') : '1fr', gap: catalogView === 'grid' ? (isMobile ? 10 : 16) : 8 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: catalogView === 'grid' ? (isMobile ? 220 : 290) : 80, background: 'var(--bg-2)', borderRadius: 14, opacity: 0.6 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14, paddingTop: 64 }}>{t('catalog.noResults')}</div>
        ) : (
          <div style={{
            display: catalogView === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: catalogView === 'grid' ? (isMobile ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)') : undefined,
            flexDirection: catalogView === 'list' ? 'column' : undefined,
            gap: catalogView === 'grid' ? (isMobile ? 10 : 16) : 8,
          }}>
            {filtered.map((eq) => (
              <EquipmentCard
                key={eq.id}
                equipment={eq}
                variant={catalogView === 'grid' ? 'grid' : 'list'}
                cartQuantity={getCartQty(eq.id)}
                onAdd={() => addToCart(eq)}
                onRemove={() => {
                  const qty = getCartQty(eq.id)
                  if (qty <= 1) removeFromCart(eq.id)
                  else updateCartQty(eq.id, qty - 1)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky bottom cart bar */}
      <div style={{
        flexShrink: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-medium)',
        padding: isMobile ? '10px 12px' : '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {cartCount() > 0 ? `${cartCount()} ${t('catalog.itemsSelected')}` : t('catalog.noItemsSelected')}
          </div>
          {cartCount() > 0 && (
            <div style={{ fontSize: 17, fontWeight: 800, color: '#E30613', direction: 'ltr' }}>
              ₪{cartTotal().toLocaleString()}
            </div>
          )}
        </div>
        <button
          onClick={goNextStep}
          disabled={cartCount() === 0}
          onMouseEnter={e => { if (cartCount() > 0) e.currentTarget.style.background = '#c7050f' }}
          onMouseLeave={e => { if (cartCount() > 0) e.currentTarget.style.background = '#E30613' }}
          style={{
            background: cartCount() > 0 ? '#E30613' : 'var(--bg-2)',
            color: cartCount() > 0 ? '#fff' : 'var(--text-tertiary)',
            border: 'none',
            borderRadius: 10,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 700,
            cursor: cartCount() > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'Heebo, sans-serif',
            whiteSpace: 'nowrap',
            opacity: cartCount() > 0 ? 1 : 0.5,
            transition: 'background 0.2s',
          }}
        >
          {t('catalog.toSimulation')}
        </button>
      </div>

      {/* Brand footer */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-subtle)',
        padding: '8px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        background: 'var(--bg-0)',
      }}>
        <img src="/favicon.svg" alt="" style={{ width: 16, height: 16, opacity: 0.4 }} />
        <span style={{ fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.08em' }}>POWERED BY ABIR SPORT</span>
      </div>
    </div>
  )
}

function catBtn(active: boolean): React.CSSProperties {
  return {
    flexShrink: 0, fontSize: 11, fontWeight: 600,
    padding: '5px 14px', borderRadius: 9999,
    border: active ? '1px solid #E30613' : '1px solid var(--border-medium)',
    cursor: 'pointer', fontFamily: 'Heebo, sans-serif', whiteSpace: 'nowrap',
    background: active ? 'rgba(227,6,19,0.08)' : 'var(--bg-0)',
    color: active ? '#E30613' : 'var(--text-secondary)',
    transition: 'all 0.15s ease',
  }
}
