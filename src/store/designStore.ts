import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { temporal } from 'zundo'
import type { PlacedItem, Equipment, CartItem, SavedDesignEntry } from '../types'

export type FloorTexture = 'rubber' | 'wood' | 'concrete' | 'turf'
export type RoomShape = 'rectangle' | 'L' | 'U' | 'T'

interface DesignStore {
  // Room
  roomWidth: number
  roomDepth: number
  roomHeight: number
  floorTexture: FloorTexture
  roomShape: RoomShape
  roomCutWidth: number
  roomCutDepth: number
  setRoom: (w: number, d: number, h: number) => void
  setFloorTexture: (texture: FloorTexture) => void
  setRoomShape: (shape: RoomShape) => void
  setRoomCut: (cutW: number, cutD: number) => void

  // Design name
  designName: string
  setDesignName: (name: string) => void

  // Placed items
  placedItems: PlacedItem[]
  selectedId: string | null

  // Actions
  addItem: (equipment: Equipment) => void
  removeItem: (instanceId: string) => void
  moveItem: (instanceId: string, position: [number, number, number]) => void
  rotateItem: (instanceId: string) => void
  selectItem: (instanceId: string | null) => void
  updateQuantity: (instanceId: string, qty: number) => void
  clearDesign: () => void
  loadFromSaved: (items: PlacedItem[], room: { width: number; depth: number; height: number }) => void
  cloneItem: (instanceId: string) => void
  setItemNote: (instanceId: string, note: string) => void

  // Cart (Step 1)
  cartItems: CartItem[]
  addToCart: (equipment: Equipment) => void
  removeFromCart: (equipmentId: string) => void
  updateCartQty: (equipmentId: string, qty: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number

  // Design history
  savedDesigns: SavedDesignEntry[]
  saveToHistory: () => void
  loadFromHistory: (id: string) => void
  deleteFromHistory: (id: string) => void

  // Computed
  totalPrice: () => number
}

export const useDesignStore = create<DesignStore>()(
  temporal(
    persist((set, get) => ({
      roomWidth: 10,
      roomDepth: 8,
      roomHeight: 3,
      floorTexture: 'rubber' as FloorTexture,
      roomShape: 'rectangle' as RoomShape,
      roomCutWidth: 4,
      roomCutDepth: 4,
      designName: 'עיצוב חדש',

      placedItems: [],
      selectedId: null,
      cartItems: [],
      savedDesigns: [],

      addToCart: (equipment) =>
        set((s) => {
          const existing = s.cartItems.find((c) => c.equipment.id === equipment.id)
          if (existing) {
            return { cartItems: s.cartItems.map((c) => c.equipment.id === equipment.id ? { ...c, quantity: c.quantity + 1 } : c) }
          }
          return { cartItems: [...s.cartItems, { equipment, quantity: 1 }] }
        }),

      removeFromCart: (equipmentId) =>
        set((s) => ({ cartItems: s.cartItems.filter((c) => c.equipment.id !== equipmentId) })),

      updateCartQty: (equipmentId, qty) =>
        set((s) => ({ cartItems: s.cartItems.map((c) => c.equipment.id === equipmentId ? { ...c, quantity: Math.max(1, qty) } : c) })),

      clearCart: () => set({ cartItems: [] }),

      cartTotal: () => get().cartItems.reduce((sum, c) => sum + (c.equipment.price ?? 0) * c.quantity, 0),
      cartCount: () => get().cartItems.reduce((sum, c) => sum + c.quantity, 0),

      setRoom: (w, d, h) => set({ roomWidth: w, roomDepth: d, roomHeight: h }),
      setFloorTexture: (texture) => set({ floorTexture: texture }),
      setRoomShape: (shape) => set({ roomShape: shape }),
      setRoomCut: (cutW, cutD) => set({ roomCutWidth: cutW, roomCutDepth: cutD }),
      setDesignName: (name) => set({ designName: name }),

      addItem: (equipment) => {
        const { roomWidth, roomDepth, placedItems } = get()
        const offset = placedItems.length * 0.6
        const x = Math.min(offset - (placedItems.length > 0 ? offset / 2 : 0), roomWidth / 2 - 1)
        const z = Math.min(offset * 0.3, roomDepth / 2 - 1)
        const instanceId = `${equipment.id}-${Date.now()}`
        set((s) => ({
          placedItems: [
            ...s.placedItems,
            { instanceId, equipment, position: [x, 0, z], rotationY: 0, quantity: 1 },
          ],
          selectedId: instanceId,
        }))
      },

      removeItem: (instanceId) =>
        set((s) => ({
          placedItems: s.placedItems.filter((i) => i.instanceId !== instanceId),
          selectedId: s.selectedId === instanceId ? null : s.selectedId,
        })),

      moveItem: (instanceId, position) =>
        set((s) => ({
          placedItems: s.placedItems.map((i) =>
            i.instanceId === instanceId ? { ...i, position } : i
          ),
        })),

      rotateItem: (instanceId) =>
        set((s) => ({
          placedItems: s.placedItems.map((i) =>
            i.instanceId === instanceId
              ? { ...i, rotationY: i.rotationY + Math.PI / 2 }
              : i
          ),
        })),

      selectItem: (id) => set({ selectedId: id }),

      updateQuantity: (instanceId, qty) =>
        set((s) => ({
          placedItems: s.placedItems.map((i) =>
            i.instanceId === instanceId ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),

      cloneItem: (instanceId) => {
        const item = get().placedItems.find((i) => i.instanceId === instanceId)
        if (!item) return
        const newId = `${item.equipment.id}-${Date.now()}`
        const [px, py, pz] = item.position
        set((s) => ({
          placedItems: [
            ...s.placedItems,
            { ...item, instanceId: newId, position: [px + 0.8, py, pz + 0.8] as [number, number, number] },
          ],
          selectedId: newId,
        }))
      },

      setItemNote: (instanceId, note) =>
        set((s) => ({
          placedItems: s.placedItems.map((i) =>
            i.instanceId === instanceId ? { ...i, note } : i
          ),
        })),

      clearDesign: () => set({ placedItems: [], selectedId: null }),

      loadFromSaved: (items, room) =>
        set({
          placedItems: items,
          roomWidth: room.width,
          roomDepth: room.depth,
          roomHeight: room.height,
          selectedId: null,
        }),

      saveToHistory: () => {
        const s = get()
        const entry: SavedDesignEntry = {
          id: `design-${Date.now()}`,
          name: s.designName,
          date: new Date().toISOString(),
          roomWidth: s.roomWidth,
          roomDepth: s.roomDepth,
          roomHeight: s.roomHeight,
          itemCount: s.placedItems.length,
          totalPrice: s.totalPrice(),
          placedItems: s.placedItems,
          cartItems: s.cartItems,
        }
        set((state) => ({
          savedDesigns: [entry, ...state.savedDesigns].slice(0, 20),
        }))
      },

      loadFromHistory: (id) => {
        const entry = get().savedDesigns.find((d) => d.id === id)
        if (!entry) return
        set({
          designName: entry.name,
          placedItems: entry.placedItems,
          cartItems: entry.cartItems,
          roomWidth: entry.roomWidth,
          roomDepth: entry.roomDepth,
          roomHeight: entry.roomHeight,
          selectedId: null,
        })
      },

      deleteFromHistory: (id) =>
        set((s) => ({ savedDesigns: s.savedDesigns.filter((d) => d.id !== id) })),

      totalPrice: () =>
        get().placedItems.reduce((sum, item) => sum + (item.equipment.price ?? 0) * item.quantity, 0),
    }), {
      name: 'abir-gym-design',
      partialize: (s) => ({
        cartItems: s.cartItems,
        placedItems: s.placedItems,
        roomWidth: s.roomWidth,
        roomDepth: s.roomDepth,
        roomHeight: s.roomHeight,
        designName: s.designName,
        floorTexture: s.floorTexture,
        roomShape: s.roomShape,
        roomCutWidth: s.roomCutWidth,
        roomCutDepth: s.roomCutDepth,
        savedDesigns: s.savedDesigns,
      }),
    }),
    {
      limit: 50,
      partialize: (s) => ({
        placedItems: s.placedItems,
        roomWidth: s.roomWidth,
        roomDepth: s.roomDepth,
        roomHeight: s.roomHeight,
      }),
    }
  )
)
