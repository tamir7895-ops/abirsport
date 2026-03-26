import { Suspense, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Room } from './Room'
import { EquipmentBox } from './EquipmentBox'
import { useDesignStore } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import { assetUrl } from '../../lib/assetUrl'
import toast from 'react-hot-toast'

function TopDownCamera({ active }: { active: boolean }) {
  const { camera } = useThree()
  const roomWidth = useDesignStore((s) => s.roomWidth)
  const roomDepth = useDesignStore((s) => s.roomDepth)

  if (active) {
    camera.position.set(0, Math.max(roomWidth, roomDepth) * 1.2, 0.001)
    camera.lookAt(0, 0, 0)
  }
  return null
}

export function Scene() {
  const { t } = useTranslation()
  const placedItems = useDesignStore((s) => s.placedItems)
  const selectItem = useDesignStore((s) => s.selectItem)
  const addItem = useDesignStore((s) => s.addItem)
  const cartItems = useDesignStore((s) => s.cartItems)
  const roomWidth = useDesignStore((s) => s.roomWidth)
  const roomDepth = useDesignStore((s) => s.roomDepth)
  const roomHeight = useDesignStore((s) => s.roomHeight)

  const isDraggingEquipment = useUiStore((s) => s.isDraggingEquipment)
  const isMeasureMode = useUiStore((s) => s.isMeasureMode)
  const toggleMeasureMode = useUiStore((s) => s.toggleMeasureMode)
  const dragEquipmentId = useUiStore((s) => s.dragEquipmentId)
  const setDragEquipmentId = useUiStore((s) => s.setDragEquipmentId)

  const [topDown, setTopDown] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const usedArea = placedItems.reduce((sum, item) => {
    const w = (item.equipment.width_cm ?? 100) / 100
    const d = (item.equipment.depth_cm ?? 80) / 100
    return sum + w * d
  }, 0)
  const totalArea = roomWidth * roomDepth
  const usedPct = Math.min(100, Math.round((usedArea / totalArea) * 100))

  const toggleTopDown = () => {
    setTopDown((v) => !v)
    if (controlsRef.current && topDown) {
      controlsRef.current.reset()
    }
  }

  // Handle drop from cart
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const equipmentId = e.dataTransfer.getData('equipment-id') || dragEquipmentId
    if (!equipmentId) return

    const eq = cartItems.find((c) => c.equipment.id === equipmentId)?.equipment
    if (eq) {
      addItem(eq)
      toast.success(`${eq.name_he} הוצב בחדר`)
    }
    setDragEquipmentId(null)
  }, [cartItems, addItem, dragEquipmentId, setDragEquipmentId])

  // Export screenshot
  const handleExportImage = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `abir-sport-design-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success(t('toast.imageExported'))
  }, [t])

  const glassOverlay: React.CSSProperties = {
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,0,0,0.1)',
    color: '#6b7280',
    fontSize: 11,
  }

  return (
    <div
      style={{
        width: '100%', height: '100%', position: 'relative',
        background: 'var(--scene-bg, #e8ecf0)', overflow: 'hidden',
        outline: isDragOver ? '3px dashed #E30613' : 'none',
        outlineOffset: '-3px',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [12, 14, 12], fov: 50, near: 0.1, far: 500 }}
        onPointerMissed={() => selectItem(null)}
      >
        <color attach="background" args={['#e8ecf0']} />
        <fog attach="fog" args={['#e8ecf0', 30, 80]} />

        <ambientLight intensity={1.4} />
        <directionalLight castShadow position={[roomWidth * 0.6, roomHeight * 2, roomDepth * 0.6]} intensity={2.0} />
        <directionalLight position={[-roomWidth, roomHeight, -roomDepth]} intensity={1.0} />
        <pointLight position={[0, roomHeight * 0.9, 0]} intensity={0.8} color="#ffffff" />

        <TopDownCamera active={topDown} />

        <Suspense fallback={null}>
          <Room />
          {placedItems.map((item) => (
            <EquipmentBox key={item.instanceId} item={item} allItems={placedItems} />
          ))}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={!isDraggingEquipment}
          enableZoom={!isDraggingEquipment}
          enableRotate={!topDown && !isDraggingEquipment}
          maxPolarAngle={topDown ? 0.01 : Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={50}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Drag over indicator */}
      {isDragOver && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', background: 'rgba(227,6,19,0.06)',
        }}>
          <div style={{
            background: '#E30613', color: '#fff', padding: '12px 24px',
            borderRadius: 12, fontSize: 14, fontWeight: 700,
            fontFamily: 'Heebo, sans-serif',
            boxShadow: '0 4px 20px rgba(227,6,19,0.3)',
          }}>
            {t('scene.dropHere')}
          </div>
        </div>
      )}

      {/* Empty state */}
      {placedItems.length === 0 && !isDragOver && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <img src={assetUrl('logo-mark.svg')} alt="Abir Sport" style={{ width: 56, height: 56, opacity: 0.3 }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{t('scene.addEquipment')}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{t('scene.dragOrAutoArrange')}</div>
          </div>
        </div>
      )}

      {/* Top-left: view toggle + tools */}
      <div style={{ position: 'absolute', top: 12, left: 12, direction: 'ltr', display: 'flex', gap: 6 }}>
        <button
          onClick={toggleTopDown}
          style={{
            ...glassOverlay,
            background: topDown ? '#E30613' : 'rgba(255,255,255,0.9)',
            color: topDown ? '#fff' : '#1a1a2e',
            borderRadius: 10, padding: '8px 16px',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {topDown ? t('scene.threeDView') : t('scene.topDown')}
        </button>

        {/* Measure mode */}
        <button
          onClick={toggleMeasureMode}
          style={{
            ...glassOverlay,
            background: isMeasureMode ? '#f59e0b' : 'rgba(255,255,255,0.9)',
            color: isMeasureMode ? '#fff' : '#1a1a2e',
            borderRadius: 10, padding: '8px 12px',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          title={t('scene.measureMode')}
        >
          📏
        </button>

        {/* Export image */}
        <button
          onClick={handleExportImage}
          style={{
            ...glassOverlay,
            background: 'rgba(255,255,255,0.9)',
            color: '#1a1a2e',
            borderRadius: 10, padding: '8px 12px',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          title={t('scene.exportImage')}
        >
          📷
        </button>
      </div>

      {/* Bottom-left: brand watermark */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, direction: 'ltr', display: 'flex', alignItems: 'center', gap: 6, opacity: 0.4 }}>
        <img src={assetUrl('favicon.svg')} alt="" style={{ width: 20, height: 20 }} />
        <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, fontFamily: 'Heebo, sans-serif' }}>ABIR SPORT</span>
      </div>

      {/* Bottom-right: stats */}
      <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 8, direction: 'ltr', alignItems: 'center' }}>
        {placedItems.length > 0 && (
          <div style={{ ...glassOverlay, padding: '7px 14px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span>{t('scene.usedArea')}:</span>
            <div style={{ width: 60, height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${usedPct}%`, height: '100%', borderRadius: 3,
                background: usedPct > 80 ? '#ef4444' : usedPct > 55 ? '#f59e0b' : '#22c55e',
                transition: 'width 0.3s',
              }} />
            </div>
            <span style={{
              color: usedPct > 80 ? '#ef4444' : usedPct > 55 ? '#f59e0b' : '#22c55e',
              fontWeight: 700,
            }}>
              {usedPct}%
            </span>
          </div>
        )}
        <div style={{ ...glassOverlay, padding: '7px 14px', borderRadius: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {roomWidth}m × {roomDepth}m × {roomHeight}m
        </div>
      </div>
    </div>
  )
}
