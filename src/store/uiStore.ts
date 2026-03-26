import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Panel = 'catalog' | 'quote'

interface UiStore {
  activePanel: Panel
  setActivePanel: (p: Panel) => void

  // Wizard step
  currentStep: 1 | 2 | 3
  goToStep: (step: 1 | 2 | 3) => void
  goNextStep: () => void
  goPrevStep: () => void

  isRoomSetupOpen: boolean
  openRoomSetup: () => void
  closeRoomSetup: () => void

  isSaveModalOpen: boolean
  openSaveModal: () => void
  closeSaveModal: () => void

  isShareModalOpen: boolean
  openShareModal: () => void
  closeShareModal: () => void

  isTemplatesOpen: boolean
  openTemplates: () => void
  closeTemplates: () => void

  isHistoryOpen: boolean
  openHistory: () => void
  closeHistory: () => void

  shareUrl: string | null
  setShareUrl: (url: string | null) => void

  isSaving: boolean
  setIsSaving: (v: boolean) => void

  isDraggingEquipment: boolean
  setIsDraggingEquipment: (v: boolean) => void

  // Dark mode
  isDarkMode: boolean
  toggleDarkMode: () => void

  // Catalog view
  catalogView: 'grid' | 'list'
  setCatalogView: (v: 'grid' | 'list') => void

  // Measurement mode
  isMeasureMode: boolean
  toggleMeasureMode: () => void

  // Drag from catalog
  dragEquipmentId: string | null
  setDragEquipmentId: (id: string | null) => void

  // Mobile cart drawer
  isMobileCartOpen: boolean
  toggleMobileCart: () => void
  closeMobileCart: () => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      activePanel: 'catalog',
      setActivePanel: (p) => set({ activePanel: p }),

      currentStep: 1,
      goToStep: (step) => set({ currentStep: step }),
      goNextStep: () => set((s) => ({ currentStep: Math.min(3, s.currentStep + 1) as 1 | 2 | 3 })),
      goPrevStep: () => set((s) => ({ currentStep: Math.max(1, s.currentStep - 1) as 1 | 2 | 3 })),

      isRoomSetupOpen: false,
      openRoomSetup: () => set({ isRoomSetupOpen: true }),
      closeRoomSetup: () => set({ isRoomSetupOpen: false }),

      isSaveModalOpen: false,
      openSaveModal: () => set({ isSaveModalOpen: true }),
      closeSaveModal: () => set({ isSaveModalOpen: false }),

      isShareModalOpen: false,
      openShareModal: () => set({ isShareModalOpen: true }),
      closeShareModal: () => set({ isShareModalOpen: false }),

      isTemplatesOpen: false,
      openTemplates: () => set({ isTemplatesOpen: true }),
      closeTemplates: () => set({ isTemplatesOpen: false }),

      isHistoryOpen: false,
      openHistory: () => set({ isHistoryOpen: true }),
      closeHistory: () => set({ isHistoryOpen: false }),

      shareUrl: null,
      setShareUrl: (url) => set({ shareUrl: url }),

      isSaving: false,
      setIsSaving: (v) => set({ isSaving: v }),

      isDraggingEquipment: false,
      setIsDraggingEquipment: (v) => set({ isDraggingEquipment: v }),

      isDarkMode: false,
      toggleDarkMode: () => set((s) => {
        const next = !s.isDarkMode
        document.documentElement.classList.toggle('dark', next)
        return { isDarkMode: next }
      }),

      catalogView: 'grid',
      setCatalogView: (v) => set({ catalogView: v }),

      isMeasureMode: false,
      toggleMeasureMode: () => set((s) => ({ isMeasureMode: !s.isMeasureMode })),

      dragEquipmentId: null,
      setDragEquipmentId: (id) => set({ dragEquipmentId: id }),

      isMobileCartOpen: false,
      toggleMobileCart: () => set((s) => ({ isMobileCartOpen: !s.isMobileCartOpen })),
      closeMobileCart: () => set({ isMobileCartOpen: false }),
    }),
    {
      name: 'abir-ui-settings',
      partialize: (s) => ({
        isDarkMode: s.isDarkMode,
        catalogView: s.catalogView,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)
