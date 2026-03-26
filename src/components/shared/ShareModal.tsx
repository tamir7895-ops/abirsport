import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '../../store/uiStore'
import { Logo } from './Logo'

export function ShareModal() {
  const { t } = useTranslation()
  const { shareUrl, closeShareModal } = useUiStore()
  const [copied, setCopied] = useState(false)

  if (!shareUrl) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } as React.CSSProperties}
      onClick={(e) => e.target === e.currentTarget && closeShareModal()}
    >
      <div
        className="modal-enter p-6 w-full max-w-sm"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        } as React.CSSProperties}
        dir="rtl"
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Logo size="sm" variant="mark" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', margin: '0 0 4px' }}>{t('share.saved')}</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>{t('share.shareWithClients')}</p>
        </div>

        <div
          className="rounded-xl p-3 mb-4 flex items-center gap-2"
          style={{
            background: '#f8f9fa',
            border: '1px solid rgba(0,0,0,0.08)',
          } as React.CSSProperties}
        >
          <span className="text-xs flex-1 truncate ltr" style={{ color: '#6b7280' }}>{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={copied ? {
              background: 'rgba(34,197,94,0.1)',
              color: '#16a34a',
              border: '1px solid rgba(34,197,94,0.3)',
              cursor: 'pointer',
            } : {
              background: '#ffffff',
              color: '#1a1a2e',
              border: '1px solid rgba(0,0,0,0.12)',
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            {copied ? t('share.copied') : t('share.copy')}
          </button>
        </div>

        <div className="flex gap-2">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-colors"
            style={{ background: '#E30613', color: '#fff', textDecoration: 'none', display: 'block' } as React.CSSProperties}
          >
            {t('share.openNewTab')}
          </a>
          <button
            onClick={closeShareModal}
            className="px-4 py-2.5 rounded-xl transition-colors text-sm"
            style={{
              background: '#f8f9fa',
              color: '#6b7280',
              border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            } as React.CSSProperties}
          >
            {t('share.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
