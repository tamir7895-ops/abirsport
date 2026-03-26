export interface Category {
  id: string
  name_he: string
  name_en: string
  slug: string
  icon_url: string | null
  parent_id: string | null
  sort_order: number
}

export interface Brand {
  id: string
  name: string
  logo_url: string | null
}

export interface ModelType {
  id: string
  name: string
  model_url: string | null
  fallback_color: string
  default_width_cm: number
  default_depth_cm: number
  default_height_cm: number
}

export interface Equipment {
  id: string
  name_he: string
  name_en: string
  description_he: string | null
  category_id: string | null
  brand_id: string | null
  model_type_id: string | null
  price: number | null
  original_price: number | null
  sku: string | null
  width_cm: number | null
  depth_cm: number | null
  height_cm: number | null
  image_url: string | null
  is_active: boolean
  abirsport_url: string | null
  // joined
  category?: Category
  brand?: Brand
  model_type?: ModelType
}

export interface CartItem {
  equipment: Equipment
  quantity: number
}

export interface PlacedItem {
  instanceId: string   // unique per placement
  equipment: Equipment
  position: [number, number, number]
  rotationY: number    // in radians
  quantity: number
  note?: string        // user note/tag
}

export interface SavedDesignEntry {
  id: string
  name: string
  date: string
  roomWidth: number
  roomDepth: number
  roomHeight: number
  itemCount: number
  totalPrice: number
  placedItems: PlacedItem[]
  cartItems: CartItem[]
}

export interface RoomDimensions {
  width: number   // meters
  depth: number   // meters
  height: number  // meters
}

export interface DesignData {
  id?: string
  share_code?: string
  name: string
  room_width: number
  room_depth: number
  room_height: number
  creator_name?: string
  creator_email?: string
  total_price: number
  items: SavedItem[]
}

export interface SavedItem {
  equipment_id: string
  position_x: number
  position_y: number
  position_z: number
  rotation_y: number
}
