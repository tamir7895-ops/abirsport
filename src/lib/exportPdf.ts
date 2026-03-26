import jsPDF from 'jspdf'
import type { PlacedItem } from '../types'

const VAT = 0.18

export async function exportQuotePdf(
  placedItems: PlacedItem[],
  roomWidth: number,
  roomDepth: number,
  roomHeight: number,
  designName: string,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageW = doc.internal.pageSize.getWidth()
  const margin = 15
  let y = 20

  // Header
  doc.setFillColor(227, 6, 19)
  doc.rect(0, 0, pageW, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Abir Sport', pageW / 2, 15, { align: 'center' })
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Gym Design Quote', pageW / 2, 24, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`Design: ${designName} | Room: ${roomWidth}m x ${roomDepth}m x ${roomHeight}m`, pageW / 2, 31, { align: 'center' })

  y = 45

  // Date
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(9)
  doc.text(`Date: ${new Date().toLocaleDateString('he-IL')}`, margin, y)
  y += 10

  // Table header
  doc.setFillColor(248, 249, 250)
  doc.rect(margin, y, pageW - margin * 2, 8, 'F')
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')

  const cols = [margin + 2, margin + 55, margin + 90, margin + 115, margin + 135, margin + 155]
  doc.text('Equipment', cols[0], y + 5.5)
  doc.text('Brand', cols[1], y + 5.5)
  doc.text('Dimensions', cols[2], y + 5.5)
  doc.text('Unit Price', cols[3], y + 5.5)
  doc.text('Qty', cols[4], y + 5.5)
  doc.text('Total', cols[5], y + 5.5)
  y += 12

  // Table rows
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  for (const item of placedItems) {
    if (y > 260) {
      doc.addPage()
      y = 20
    }

    const eq = item.equipment
    const lineTotal = eq.price * item.quantity

    // Alternating row bg
    if (placedItems.indexOf(item) % 2 === 1) {
      doc.setFillColor(252, 252, 252)
      doc.rect(margin, y - 4, pageW - margin * 2, 8, 'F')
    }

    doc.setTextColor(30, 30, 50)
    doc.text(eq.name_en || eq.name_he, cols[0], y, { maxWidth: 50 })
    doc.setTextColor(120, 120, 120)
    doc.text(eq.brand?.name ?? '-', cols[1], y, { maxWidth: 30 })
    doc.text(`${eq.width_cm}x${eq.depth_cm}x${eq.height_cm}`, cols[2], y)
    doc.text(`${Number(eq.price).toLocaleString()} NIS`, cols[3], y)
    doc.text(String(item.quantity), cols[4], y)
    doc.setTextColor(227, 6, 19)
    doc.setFont('helvetica', 'bold')
    doc.text(`${lineTotal.toLocaleString()} NIS`, cols[5], y)
    doc.setFont('helvetica', 'normal')
    y += 9
  }

  // Summary
  y += 5
  doc.setDrawColor(230, 230, 230)
  doc.line(margin, y, pageW - margin, y)
  y += 10

  const subtotal = placedItems.reduce((sum, i) => sum + i.equipment.price * i.quantity, 0)
  const vatAmount = subtotal * VAT
  const grandTotal = subtotal + vatAmount

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text('Subtotal:', margin, y)
  doc.text(`${subtotal.toLocaleString()} NIS`, pageW - margin, y, { align: 'right' })
  y += 7

  doc.text('VAT (18%):', margin, y)
  doc.text(`${Math.round(vatAmount).toLocaleString()} NIS`, pageW - margin, y, { align: 'right' })
  y += 7

  doc.setDrawColor(227, 6, 19)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  doc.setTextColor(227, 6, 19)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Total incl. VAT:', margin, y)
  doc.text(`${Math.round(grandTotal).toLocaleString()} NIS`, pageW - margin, y, { align: 'right' })

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Abir Sport Ltd. | www.abirsport.co.il | 03-5186372', pageW / 2, footerY, { align: 'center' })

  doc.save(`abir-sport-quote-${Date.now()}.pdf`)
}
