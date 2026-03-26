import { useTranslation } from 'react-i18next'
import { useDesignStore } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { Logo } from './Logo'

export function DesignHistoryModal() {
  const { t } = useTranslation()
  const { savedDesigns, loadFromHistory, deleteFromHistory } = useDesignStore()
  const { closeHistory } = useUiStore()
  const goToStep = useUiStore((s) => s.goToStep)

  const handleLoad = (id: string) => {
    loadFromHistory(id)
    closeHistory()
    goToStep(2)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } as React.CSSProperties}
      onClick={(e) => e.target === e.currentTarget && closeHistory()}
    >
      <div
        className="modal-enter p-6 w-full max-w-lg"
        style={{
          background: 'var(--bg-0, #ffffff)',
          border: '1px solid var(--border-medium, rgba(0,0,0,0.1))',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
        } as React.CSSProperties}
        dir="rtl"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {t('history.title')}
          </h2>
          <Logo size="sm" variant="mark" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '0 0 16px' }}>
          {t('history.subtitle')}
        </p>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          {savedDesigns.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, paddingTop: 40 }}>
              {t('history.empty')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedDesigns.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: 'var(--bg-1, #f8f9fa)',
                    border: '1px solid var(--border-subtle, rgba(0,0,0,0.06))',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {new Date(d.date).toLocaleDateString('he-IL')} · {d.roomWidth}×{d.roomDepth}m · {d.itemCount} {t('history.items')}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#E30613', marginTop: 4, direction: 'ltr', textAlign: 'right' }}>
                      {d.totalPrice > 0 ? `₪${d.totalPrice.toLocaleString()}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleLoad(d.id)}
                      style={{
                        background: '#E30613', color: '#fff',
                        border: 'none', borderRadius: 8,
                        padding: '6px 14px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
                      }}
                    >
                      {t('history.load')}
                    </button>
                    <button
                      onClick={() => deleteFromHistory(d.id)}
                      style={{
                        background: 'transparent', color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                        padding: '6px 10px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
                      }}
                    >
                      {t('history.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={closeHistory}
          style={{
            width: '100%',
            background: 'var(--bg-1, #f8f9fa)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium, rgba(0,0,0,0.1))',
            borderRadius: 10, padding: '10px 0',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
          }}
        >
          {t('room.cancel')}
        </button>
      </div>
    </div>
  )
}
