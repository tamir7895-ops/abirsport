import { supabase } from './supabase'
import type { Category, Equipment, DesignData, PlacedItem } from '../types'

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchSubcategories(parentId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchEquipment(categoryId?: string): Promise<Equipment[]> {
  let query = supabase
    .from('equipment')
    .select('*, category:categories(id,name_he,name_en,slug), brand:brands(id,name), model_type:model_types(id,name,fallback_color,default_width_cm,default_depth_cm,default_height_cm)')
    .eq('is_active', true)
    .order('name_he')
    .limit(1000)

  if (categoryId) {
    // Check if this is a parent category with subcategories
    const { data: subs } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', categoryId)

    if (subs && subs.length > 0) {
      // Filter by parent OR any of its children
      const allIds = [categoryId, ...subs.map(s => s.id)]
      query = query.in('category_id', allIds)
    } else {
      query = query.eq('category_id', categoryId)
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function saveDesign(
  name: string,
  room: { width: number; depth: number; height: number },
  placedItems: PlacedItem[],
  creator?: { name?: string; email?: string }
): Promise<string> {
  const shareCode = generateShareCode()
  const totalPrice = placedItems.reduce(
    (sum, item) => sum + (item.equipment.price ?? 0) * item.quantity,
    0
  )

  const { data: design, error: designError } = await supabase
    .from('designs')
    .insert({
      share_code: shareCode,
      name,
      room_width: room.width,
      room_depth: room.depth,
      room_height: room.height,
      creator_name: creator?.name ?? null,
      creator_email: creator?.email ?? null,
      total_price: totalPrice,
      total_items: placedItems.length,
      is_public: true,
    })
    .select('id')
    .single()

  if (designError) throw designError

  if (placedItems.length > 0) {
    const items = placedItems.map((item) => ({
      design_id: design.id,
      equipment_id: item.equipment.id,
      position_x: item.position[0],
      position_y: item.position[1],
      position_z: item.position[2],
      rotation_y: item.rotationY,
    }))

    const { error: itemsError } = await supabase.from('design_items').insert(items)
    if (itemsError) throw itemsError
  }

  return shareCode
}

export async function loadDesign(shareCode: string): Promise<DesignData | null> {
  const { data, error } = await supabase
    .from('designs')
    .select('*, design_items(*, equipment:equipment(*, model_type:model_types(*), brand:brands(*), category:categories(*)))')
    .eq('share_code', shareCode)
    .single()

  if (error) return null
  return data
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
