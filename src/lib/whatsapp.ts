import type { PlacedItem } from '../types'

const VAT = 0.18

export function sendWhatsApp(
  placedItems: PlacedItem[],
  roomWidth: number,
  roomDepth: number,
  designName: string,
  shareUrl?: string | null,
) {
  const subtotal = placedItems.reduce((sum, i) => sum + i.equipment.price * i.quantity, 0)
  const grandTotal = Math.round(subtotal * (1 + VAT))

  const itemLines = placedItems.map(
    (item) => `• ${item.equipment.name_he} — ₪${Number(item.equipment.price).toLocaleString()} × ${item.quantity}`
  ).join('\n')

  const message = [
    `🏋️ *הצעת מחיר — אביר ספורט*`,
    ``,
    `📐 *${designName}*`,
    `חדר: ${roomWidth}m × ${roomDepth}m`,
    ``,
    `📋 *ציוד נבחר:*`,
    itemLines,
    ``,
    `💰 *סה"כ כולל מע"מ: ₪${grandTotal.toLocaleString()}*`,
    ``,
    shareUrl ? `🔗 צפה בעיצוב: ${shareUrl}` : '',
    ``,
    `📞 אביר ספורט: 03-5186372`,
    `🌐 www.abirsport.co.il`,
  ].filter(Boolean).join('\n')

  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}
