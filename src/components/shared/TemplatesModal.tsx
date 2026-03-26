import { useTranslation } from 'react-i18next'
import { useUiStore } from '../../store/uiStore'
import { Logo } from './Logo'

interface Template {
  id: string
  nameKey: string
  descKey: string
  icon: string
  roomWidth: number
  roomDepth: number
  roomHeight: number
  equipmentTypes: { type: string; count: number }[]
}

const TEMPLATES: Template[] = [
  {
    id: 'home',
    nameKey: 'templates.homeGym',
    descKey: 'templates.homeGymDesc',
    icon: '🏠',
    roomWidth: 5, roomDepth: 4, roomHeight: 2.8,
    equipmentTypes: [
      { type: 'treadmill', count: 1 },
      { type: 'bench_press', count: 1 },
      { type: 'dumbbell_rack', count: 1 },
    ],
  },
  {
    id: 'studio',
    nameKey: 'templates.studio',
    descKey: 'templates.studioDesc',
    icon: '🏋️',
    roomWidth: 8, roomDepth: 6, roomHeight: 3,
    equipmentTypes: [
      { type: 'treadmill', count: 2 },
      { type: 'exercise_bike', count: 2 },
      { type: 'cable_machine', count: 1 },
      { type: 'bench_press', count: 1 },
      { type: 'dumbbell_rack', count: 1 },
    ],
  },
  {
    id: 'commercial',
    nameKey: 'templates.commercial',
    descKey: 'templates.commercialDesc',
    icon: '🏢',
    roomWidth: 15, roomDepth: 12, roomHeight: 3.5,
    equipmentTypes: [
      { type: 'treadmill', count: 5 },
      { type: 'elliptical', count: 3 },
      { type: 'exercise_bike', count: 4 },
      { type: 'cable_machine', count: 2 },
      { type: 'smith_machine', count: 1 },
      { type: 'power_rack', count: 2 },
      { type: 'bench_press', count: 3 },
      { type: 'leg_press', count: 1 },
      { type: 'lat_pulldown', count: 2 },
      { type: 'dumbbell_rack', count: 2 },
    ],
  },
  {
    id: 'crossfit',
    nameKey: 'templates.crossfit',
    descKey: 'templates.crossfitDesc',
    icon: '💪',
    roomWidth: 12, roomDepth: 10, roomHeight: 4,
    equipmentTypes: [
      { type: 'power_rack', count: 4 },
      { type: 'rowing_machine', count: 4 },
      { type: 'functional_trainer', count: 2 },
      { type: 'dumbbell_rack', count: 2 },
      { type: 'bench_press', count: 2 },
    ],
  },
]

interface Props {
  onSelectTemplate: (template: Template) => void
}

export type { Template }

export function TemplatesModal({ onSelectTemplate }: Props) {
  const { t } = useTranslation()
  const closeTemplates = useUiStore((s) => s.closeTemplates)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } as React.CSSProperties}
      onClick={(e) => e.target === e.currentTarget && closeTemplates()}
    >
      <div
        className="modal-enter p-6 w-full max-w-lg"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        } as React.CSSProperties}
        dir="rtl"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{t('templates.title')}</h2>
          <Logo size="sm" variant="mark" />
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>{t('templates.subtitle')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {TEMPLATES.map((tmpl) => {
            const totalItems = tmpl.equipmentTypes.reduce((s, e) => s + e.count, 0)
            return (
              <button
                key={tmpl.id}
                onClick={() => { onSelectTemplate(tmpl); closeTemplates() }}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 14,
                  padding: '16px 14px',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#E30613'
                  e.currentTarget.style.background = 'rgba(227,6,19,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                  e.currentTarget.style.background = '#f8f9fa'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{tmpl.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{t(tmpl.nameKey)}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{t(tmpl.descKey)}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                  {tmpl.roomWidth}×{tmpl.roomDepth}m · {totalItems} {t('templates.items')}
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={closeTemplates}
          style={{
            width: '100%', marginTop: 16,
            background: '#f8f9fa', color: '#6b7280',
            border: '1px solid rgba(0,0,0,0.1)',
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
