import { useTranslation } from 'react-i18next'
import { useDesignStore } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { useIsMobile } from '../../hooks/useIsMobile'
import { saveDesign } from '../../lib/api'
import { exportQuotePdf } from '../../lib/exportPdf'
import { sendWhatsApp } from '../../lib/whatsapp'
import { Logo } from '../shared/Logo'
import toast from 'react-hot-toast'

const VAT = 0.18

export function QuotePanel() {
  const { t } = useTranslation()
  const placedItems = useDesignStore((s) => s.placedItems)
  const totalPrice = useDesignStore((s) => s.totalPrice)
  const designName = useDesignStore((s) => s.designName)
  const roomWidth = useDesignStore((s) => s.roomWidth)
  const roomDepth = useDesignStore((s) => s.roomDepth)
  const roomHeight = useDesignStore((s) => s.roomHeight)

  const isMobile = useIsMobile()
  const isSaving = useUiStore((s) => s.isSaving)
  const setIsSaving = useUiStore((s) => s.setIsSaving)
  const setShareUrl = useUiStore((s) => s.setShareUrl)
  const shareUrl = useUiStore((s) => s.shareUrl)
  const openShareModal = useUiStore((s) => s.openShareModal)
  const goPrevStep = useUiStore((s) => s.goPrevStep)
  const goToStep = useUiStore((s) => s.goToStep)

  const handleSave = async () => {
    if (placedItems.length === 0) {
      toast.error(t('toast.addItemFirst'))
      return
    }
    setIsSaving(true)
    try {
      const code = await saveDesign(
        designName,
        { width: roomWidth, depth: roomDepth, height: roomHeight },
        placedItems
      )
      const url = `${window.location.origin}?design=${code}`
      setShareUrl(url)
      window.history.replaceState({}, '', `?design=${code}`)
      toast.success(t('toast.designSaved'))
      openShareModal()
    } catch {
      toast.error(t('toast.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  const handlePdf = () => {
    exportQuotePdf(placedItems, roomWidth, roomDepth, roomHeight, designName)
    toast.success(t('toast.pdfGenerated'))
  }

  const handleWhatsApp = () => {
    sendWhatsApp(placedItems, roomWidth, roomDepth, designName, shareUrl)
  }

  const subtotal = totalPrice()
  const vatAmount = subtotal * VAT
  const grandTotal = subtotal + vatAmount
  const canSave = placedItems.length > 0 && !isSaving

  const ghostBtn: React.CSSProperties = {
    background: 'rgba(0,0,0,0.04)',
    color: '#6b7280',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 10, padding: '10px 20px',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
    transition: 'background 0.2s',
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', width: '100%',
      background: '#f8f9fa', overflow: 'hidden',
    }}>
      {/* Header with brand */}
      <div style={{
        padding: isMobile ? '14px 16px 12px' : '20px 32px 16px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>{t('quote.title')}</div>
          <div style={{ fontSize: isMobile ? 12 : 13, color: '#6b7280' }}>{placedItems.length} {t('quote.itemsInGym')}</div>
        </div>
        {!isMobile && <Logo size="sm" variant="full" />}
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '0 12px' : '0 32px' }}>
        {placedItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, paddingTop: 64 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <div>{t('quote.noItems')}</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>{t('quote.goBackStep2')}</div>
          </div>
        ) : isMobile ? (
          /* Mobile: card layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {placedItems.map((item) => (
              <div key={item.instanceId} style={{
                background: '#fff', borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{item.equipment.name_he}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{item.equipment.brand?.name ?? ''}</div>
                  </div>
                  <div style={{ textAlign: 'left', flexShrink: 0, marginRight: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#E30613', direction: 'ltr' }}>
                      {item.equipment.price != null ? `₪${((item.equipment.price) * item.quantity).toLocaleString()}` : '—'}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', direction: 'ltr' }}>
                      {item.quantity > 1 && item.equipment.price != null ? `${item.quantity} × ₪${Number(item.equipment.price).toLocaleString()}` : `${t('quote.qty')}: ${item.quantity}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: table */
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                {[t('quote.equipment'), t('quote.brand'), t('quote.dimensions'), t('quote.unitPrice'), t('quote.qty'), t('quote.total')].map((h) => (
                  <th key={h} style={{
                    padding: '12px 12px', textAlign: 'right',
                    fontSize: 11, fontWeight: 600, color: '#9ca3af',
                    fontFamily: 'Heebo, sans-serif',
                    letterSpacing: '0.04em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {placedItems.map((item, i) => (
                <tr key={item.instanceId} style={{
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                }}>
                  <td style={{ padding: '13px 12px', fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>
                    {item.equipment.name_he}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 12, color: '#6b7280' }}>
                    {item.equipment.brand?.name ?? '—'}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 11, color: '#9ca3af', direction: 'ltr', textAlign: 'right' }}>
                    {item.equipment.width_cm && item.equipment.depth_cm && item.equipment.height_cm
                      ? `${item.equipment.width_cm}×${item.equipment.depth_cm}×${item.equipment.height_cm}`
                      : '—'}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 13, color: '#6b7280', direction: 'ltr', textAlign: 'right' }}>
                    {item.equipment.price != null ? `₪${Number(item.equipment.price).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 13, color: '#1a1a2e', textAlign: 'center', fontWeight: 600 }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 14, color: '#E30613', fontWeight: 700, direction: 'ltr', textAlign: 'right' }}>
                    {item.equipment.price != null ? `₪${((item.equipment.price) * item.quantity).toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary + Actions */}
      <div style={{ flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.08)', padding: isMobile ? '12px' : '16px 32px' }}>
        {/* Price breakdown card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 12, padding: isMobile ? '12px 14px' : '14px 20px',
          marginBottom: isMobile ? 10 : 16, maxWidth: isMobile ? '100%' : 360,
          display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{t('quote.subtotal')}</span>
            <span style={{ fontSize: 13, color: '#1a1a2e', direction: 'ltr' }}>₪{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{t('quote.vat')}</span>
            <span style={{ fontSize: 13, color: '#1a1a2e', direction: 'ltr' }}>₪{Math.round(vatAmount).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 10, marginTop: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>{t('quote.grandTotal')}</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#E30613', direction: 'ltr' }}>₪{Math.round(grandTotal).toLocaleString()}</span>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', gap: isMobile ? 8 : 10, flexWrap: 'wrap', direction: 'ltr' }}>
          <button
            onClick={goPrevStep}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            style={ghostBtn}
          >
            {t('quote.backToSim')}
          </button>
          <button
            onClick={() => goToStep(1)}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            style={ghostBtn}
          >
            {t('quote.editCatalog')}
          </button>

          {/* PDF Export */}
          {placedItems.length > 0 && (
            <button
              onClick={handlePdf}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              style={ghostBtn}
            >
              {t('quote.exportPdf')}
            </button>
          )}

          {/* WhatsApp */}
          {placedItems.length > 0 && (
            <button
              onClick={handleWhatsApp}
              onMouseEnter={e => (e.currentTarget.style.background = '#1fa855')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}
              style={{
                background: '#25D366', color: '#fff', border: 'none',
                borderRadius: 10, padding: '10px 20px',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              {t('quote.whatsapp')}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={!canSave}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.background = '#c7050f' }}
            onMouseLeave={e => { if (canSave) e.currentTarget.style.background = '#E30613' }}
            style={{
              background: canSave ? '#E30613' : 'rgba(0,0,0,0.06)',
              color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 28px',
              fontSize: 14, fontWeight: 700,
              cursor: canSave ? 'pointer' : 'not-allowed',
              fontFamily: 'Heebo, sans-serif',
              opacity: placedItems.length > 0 ? 1 : 0.4,
              transition: 'background 0.2s',
            }}
          >
            {isSaving ? t('quote.saving') : t('quote.saveAndShare')}
          </button>
        </div>
      </div>
    </div>
  )
}
