import { useEffect, useState, useCallback, Suspense, Component, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Header } from './components/layout/Header'
import { CatalogPanel } from './components/catalog/CatalogPanel'
import { QuotePanel } from './components/quote/QuotePanel'
import { CartPanel } from './components/steps/CartPanel'
import { Scene } from './components/three/Scene'
import { RoomSetupModal } from './components/room/RoomSetupModal'
import { ShareModal } from './components/shared/ShareModal'
import { TemplatesModal } from './components/shared/TemplatesModal'
import { DesignHistoryModal } from './components/shared/DesignHistoryModal'
import { SplashScreen } from './components/shared/SplashScreen'
import type { Template } from './components/shared/TemplatesModal'
import { useUiStore } from './store/uiStore'
import { useDesignStore } from './store/designStore'
import { loadDesign, fetchEquipment } from './lib/api'
import toast from 'react-hot-toast'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: '#E30613', padding: 24, background: '#fff5f5', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <div style={{ fontWeight: 700 }}>שגיאה בטעינת הסצנה</div>
          <pre style={{ fontSize: 11, opacity: 0.7, maxWidth: 400, whiteSpace: 'pre-wrap', textAlign: 'center' }}>{this.state.error}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ background: '#E30613', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>נסה שוב</button>
        </div>
      )
    }
    return this.props.children
  }
}

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function App() {
  const { t } = useTranslation()
  const [showSplash, setShowSplash] = useState(true)
  const isRoomSetupOpen = useUiStore((s) => s.isRoomSetupOpen)
  const isShareModalOpen = useUiStore((s) => s.isShareModalOpen)
  const isTemplatesOpen = useUiStore((s) => s.isTemplatesOpen)
  const isHistoryOpen = useUiStore((s) => s.isHistoryOpen)
  const currentStep = useUiStore((s) => s.currentStep)
  const setShareUrl = useUiStore((s) => s.setShareUrl)
  const closeRoomSetup = useUiStore((s) => s.closeRoomSetup)
  const goToStep = useUiStore((s) => s.goToStep)
  const loadFromSaved = useDesignStore((s) => s.loadFromSaved)
  const addToCart = useDesignStore((s) => s.addToCart)

  const hideSplash = useCallback(() => setShowSplash(false), [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const designCode = params.get('design')
    if (designCode) {
      loadDesign(designCode).then((data) => {
        if (!data) return
        const rawItems = (data as any).design_items ?? []
        const items = rawItems.map((di: any) => ({
          instanceId: `${di.equipment_id}-${Date.now()}-${Math.random()}`,
          equipment: di.equipment,
          position: [di.position_x ?? 0, 0, di.position_z ?? 0] as [number, number, number],
          rotationY: di.rotation_y ?? 0,
          quantity: 1,
        }))
        loadFromSaved(items, {
          width: data.room_width,
          depth: data.room_depth,
          height: (data as any).room_height ?? 3,
        })
        setShareUrl(`${window.location.origin}?design=${designCode}`)
        closeRoomSetup()
        goToStep(2)
      })
    }
  }, [])

  const handleTemplate = async (template: Template) => {
    try {
      const allEquipment = await fetchEquipment()
      const placed: any[] = []
      let x = -template.roomWidth / 2 + 1
      let z = -template.roomDepth / 2 + 1
      let rowMaxD = 0

      for (const { type, count } of template.equipmentTypes) {
        const match = allEquipment.find((eq) => eq.model_type?.name === type)
        if (!match) continue
        for (let i = 0; i < count; i++) {
          addToCart(match)
          const w = (match.width_cm ?? 100) / 100
          const d = (match.depth_cm ?? 80) / 100

          if (x + w > template.roomWidth / 2 - 1) {
            x = -template.roomWidth / 2 + 1
            z += rowMaxD + 0.5
            rowMaxD = 0
          }

          placed.push({
            instanceId: `${match.id}-tmpl-${Date.now()}-${Math.random()}`,
            equipment: match,
            position: [x + w / 2, 0, z + d / 2] as [number, number, number],
            rotationY: 0,
            quantity: 1,
          })
          x += w + 0.5
          rowMaxD = Math.max(rowMaxD, d)
        }
      }

      loadFromSaved(placed, {
        width: template.roomWidth,
        depth: template.roomDepth,
        height: template.roomHeight,
      })
      goToStep(2)
      toast.success(t('toast.templateLoaded'))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={hideSplash} />}

      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', background: 'var(--bg-0)', overflow: 'hidden', fontFamily: 'Heebo, sans-serif' }}>
        <Header />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" {...stepVariants} style={{ width: '100%', height: '100%' }}>
                <CatalogPanel />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" {...stepVariants} style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ width: 260, flexShrink: 0, overflow: 'hidden', display: 'flex', position: 'relative', zIndex: 20 }}>
                  <CartPanel />
                </div>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0, zIndex: 1 }}>
                  <ErrorBoundary>
                    <Suspense fallback={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', flexDirection: 'column', gap: 12 }}>
                        <img src="/logo-mark.svg" alt="" style={{ width: 48, height: 48, opacity: 0.3 }} />
                        <div>{t('scene.loading')}</div>
                      </div>
                    }>
                      <Scene />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" {...stepVariants} style={{ width: '100%', height: '100%' }}>
                <QuotePanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isRoomSetupOpen && <RoomSetupModal />}
        {isShareModalOpen && <ShareModal />}
        {isTemplatesOpen && <TemplatesModal onSelectTemplate={handleTemplate} />}
        {isHistoryOpen && <DesignHistoryModal />}

        <Toaster position="top-center" toastOptions={{
          style: { background: 'var(--bg-0)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', fontFamily: 'Heebo, sans-serif', direction: 'rtl', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
        }} />
      </div>
    </>
  )
}
