import type { CartItem, PlacedItem } from '../../types'

const WALL_GAP = 0.4   // meters from wall
const ITEM_GAP = 0.5   // meters between items

export function autoArrange(
  cartItems: CartItem[],
  roomWidth: number,
  roomDepth: number
): PlacedItem[] {
  // Expand cart quantities into individual instances
  const instances: { equipment: CartItem['equipment'] }[] = []
  for (const cartItem of cartItems) {
    for (let i = 0; i < cartItem.quantity; i++) {
      instances.push({ equipment: cartItem.equipment })
    }
  }

  // Sort largest footprint first for better row packing
  instances.sort((a, b) => {
    const aArea = (a.equipment.width_cm ?? 100) * (a.equipment.depth_cm ?? 80)
    const bArea = (b.equipment.width_cm ?? 100) * (b.equipment.depth_cm ?? 80)
    return bArea - aArea
  })

  const placed: PlacedItem[] = []
  // Start from top-left in Three.js world space
  let curX = -roomWidth / 2 + WALL_GAP
  let curZ = -roomDepth / 2 + WALL_GAP
  let rowMaxDepth = 0

  for (const instance of instances) {
    const eq = instance.equipment
    const w = (eq.width_cm ?? 100) / 100
    const d = (eq.depth_cm ?? 80) / 100

    // Check if item fits in current row (X direction)
    if (curX + w > roomWidth / 2 - WALL_GAP) {
      // Start new row
      curX = -roomWidth / 2 + WALL_GAP
      curZ += rowMaxDepth + ITEM_GAP
      rowMaxDepth = 0
    }

    // Check if new row fits in room depth
    if (curZ + d > roomDepth / 2 - WALL_GAP) {
      // Room full — place remaining at center with jitter so they're visible
      const jitter = placed.length * 0.3
      placed.push({
        instanceId: `${eq.id}-auto-${Date.now()}-${Math.random()}`,
        equipment: eq,
        position: [jitter - 1, 0, jitter],
        rotationY: 0,
        quantity: 1,
      })
      continue
    }

    placed.push({
      instanceId: `${eq.id}-auto-${Date.now()}-${Math.random()}`,
      equipment: eq,
      position: [curX + w / 2, 0, curZ + d / 2],
      rotationY: 0,
      quantity: 1,
    })

    curX += w + ITEM_GAP
    rowMaxDepth = Math.max(rowMaxDepth, d)
  }

  return placed
}
