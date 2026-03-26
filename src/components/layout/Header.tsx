import { useTranslation } from 'react-i18next'
import { useUiStore } from '../../store/uiStore'
import { useDesignStore } from '../../store/designStore'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'
import { Logo } from '../shared/Logo'
import { useIsMobile } from '../../hooks/useIsMobile'

const STEPS_KEYS = [
  { num: 1, key: 'steps.selectEquipment' },
  { num: 2, key: 'steps.arrangeRoom' },
  { num: 3, key: 'steps.quote' },
] as const

export function Header() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const currentStep = useUiStore((s) => s.currentStep)
  const goToStep = useUiStore((s) => s.goToStep)
  const shareUrl = useUiStore((s) => s.shareUrl)
  const openShareModal = useUiStore((s) => s.openShareModal)
  const openHistory = useUiStore((s) => s.openHistory)
  const isDarkMode = useUiStore((s) => s.isDarkMode)
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode)

  const { undo, redo, pastStates, futureStates } = useDesignStore.temporal.getState()
  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  const iconBtn: React.CSSProperties = {
    background: 'none', border: 'none',
    fontSize: 16, cursor: 'pointer',
    padding: '4px 6px', borderRadius: 6,
    transition: 'color 0.2s',
    color: 'var(--text-primary)',
  }

  return (
    <header style={{
      height: isMobile ? 48 : 56,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '0 10px' : '0 20px',
      gap: isMobile ? 6 : 12,
      flexShrink: 0,
      borderBottom: '1px solid var(--border-medium)',
      zIndex: 50,
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <Logo size="md" variant="full" />

      {/* Step indicator */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {STEPS_KEYS.map((step, i) => {
          const done = currentStep > step.num
          const active = currentStep === step.num
          return (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{
                  width: isMobile ? 20 : 40, height: 1,
                  background: done || active ? 'var(--border-strong)' : 'var(--border-subtle)',
                  transition: 'background 0.3s',
                }} />
              )}
              <button
                onClick={() => done ? goToStep(step.num as 1 | 2 | 3) : undefined}
                disabled={!done}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none',
                  cursor: done ? 'pointer' : 'default',
                  padding: '2px 6px',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: done ? '#E30613' : active ? 'var(--accent-muted)' : 'var(--bg-2)',
                  color: done ? '#fff' : active ? '#E30613' : 'var(--text-tertiary)',
                  border: active ? '1.5px solid #E30613' : done ? 'none' : '1.5px solid var(--border-medium)',
                  boxShadow: active ? '0 0 0 3px rgba(227,6,19,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}>
                  {done ? '✓' : step.num}
                </div>
                {!isMobile && (
                  <div style={{
                    fontSize: 10, fontWeight: active ? 700 : 500,
                    color: active ? 'var(--text-primary)' : done ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                    whiteSpace: 'nowrap', fontFamily: 'Heebo, sans-serif',
                    transition: 'color 0.2s',
                  }}>
                    {t(step.key)}
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {/* Undo/Redo */}
        {currentStep === 2 && (
          <>
            <button
              onClick={() => canUndo && undo()}
              disabled={!canUndo}
              title={t('actions.undo')}
              style={{ ...iconBtn, color: canUndo ? 'var(--text-primary)' : 'var(--text-tertiary)', opacity: canUndo ? 1 : 0.4 }}
            >
              ↶
            </button>
            <button
              onClick={() => canRedo && redo()}
              disabled={!canRedo}
              title={t('actions.redo')}
              style={{ ...iconBtn, color: canRedo ? 'var(--text-primary)' : 'var(--text-tertiary)', opacity: canRedo ? 1 : 0.4 }}
            >
              ↷
            </button>
          </>
        )}

        {/* History */}
        {!isMobile && (
          <button
            onClick={openHistory}
            title={t('history.title')}
            style={iconBtn}
          >
            📋
          </button>
        )}

        {/* Dark mode toggle */}
        {!isMobile && (
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            style={iconBtn}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        )}

        {!isMobile && <LanguageSwitcher />}

        {shareUrl && (
          <button
            onClick={openShareModal}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-1)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 10, padding: '7px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Heebo, sans-serif',
              transition: 'background 0.2s',
            }}
          >
            {t('share.shareButton')}
          </button>
        )}
      </div>
    </header>
  )
}
