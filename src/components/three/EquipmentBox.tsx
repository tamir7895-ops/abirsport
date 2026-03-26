import React, { useRef, useState, useCallback } from 'react'
import { Html } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useDesignStore } from '../../store/designStore'
import { useUiStore } from '../../store/uiStore'
import type { PlacedItem } from '../../types'
import { EquipmentModel } from './EquipmentModel'

interface Props {
  item: PlacedItem
  allItems: PlacedItem[]
}

function hasCollision(item: PlacedItem, allItems: PlacedItem[], newX: number, newZ: number): boolean {
  const eq = item.equipment
  const hw = (eq.width_cm ?? 100) / 200
  const hd = (eq.depth_cm ?? 80) / 200
  const GAP = 0.15

  for (const other of allItems) {
    if (other.instanceId === item.instanceId) continue
    const oeq = other.equipment
    const ohw = (oeq.width_cm ?? 100) / 200
    const ohd = (oeq.depth_cm ?? 80) / 200
    const [ox, , oz] = other.position

    const overlapX = Math.abs(newX - ox) < hw + ohw + GAP
    const overlapZ = Math.abs(newZ - oz) < hd + ohd + GAP
    if (overlapX && overlapZ) return true
  }
  return false
}

/** Calculate distances to nearby items */
function getDistances(item: PlacedItem, allItems: PlacedItem[]): { target: PlacedItem; dist: number }[] {
  const [px, , pz] = item.position
  return allItems
    .filter((o) => o.instanceId !== item.instanceId)
    .map((o) => {
      const [ox, , oz] = o.position
      const dist = Math.sqrt((px - ox) ** 2 + (pz - oz) ** 2)
      return { target: o, dist }
    })
    .filter((d) => d.dist < 6)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3)
}

export function EquipmentBox({ item, allItems }: Props) {
  const moveItem = useDesignStore((s) => s.moveItem)
  const rotateItem = useDesignStore((s) => s.rotateItem)
  const selectItem = useDesignStore((s) => s.selectItem)
  const removeItem = useDesignStore((s) => s.removeItem)
  const cloneItem = useDesignStore((s) => s.cloneItem)
  const setItemNote = useDesignStore((s) => s.setItemNote)
  const selectedId = useDesignStore((s) => s.selectedId)
  const setIsDraggingEquipment = useUiStore((s) => s.setIsDraggingEquipment)
  const isMeasureMode = useUiStore((s) => s.isMeasureMode)
  const isSelected = selectedId === item.instanceId

  const [isDragging, setIsDragging] = useState(false)
  const [isColliding, setIsColliding] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const dragOffset = useRef(new THREE.Vector3())

  const eq = item.equipment
  const w = (eq.width_cm ?? eq.model_type?.default_width_cm ?? 100) / 100
  const d = (eq.depth_cm ?? eq.model_type?.default_depth_cm ?? 80) / 100
  const h = (eq.height_cm ?? eq.model_type?.default_height_cm ?? 140) / 100
  const color = eq.model_type?.fallback_color ?? '#5588bb'

  const [px, , pz] = item.position

  const distances = isSelected && isMeasureMode ? getDistances(item, allItems) : []

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      selectItem(item.instanceId)
      setIsDragging(true)
      setIsDraggingEquipment(true)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)

      const intersection = new THREE.Vector3()
      e.ray.intersectPlane(dragPlane.current, intersection)
      dragOffset.current.set(px - intersection.x, 0, pz - intersection.z)
    },
    [item.instanceId, px, pz, selectItem, setIsDraggingEquipment]
  )

  const onPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging) return
      e.stopPropagation()
      const intersection = new THREE.Vector3()
      if (e.ray.intersectPlane(dragPlane.current, intersection)) {
        const newX = intersection.x + dragOffset.current.x
        const newZ = intersection.z + dragOffset.current.z
        const colliding = hasCollision(item, allItems, newX, newZ)
        setIsColliding(colliding)
        moveItem(item.instanceId, [newX, 0, newZ])
      }
    },
    [isDragging, item, allItems, moveItem]
  )

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
    setIsColliding(false)
    setIsDraggingEquipment(false)
  }, [setIsDraggingEquipment])

  const modelColor = isColliding ? '#ff3333' : isSelected ? '#aaddff' : color

  return (
    <group
      position={[px, h / 2, pz]}
      rotation={[0, item.rotationY, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <group>
        <EquipmentModel
          w={w} d={d} h={h}
          color={modelColor}
          isSelected={isSelected}
          modelType={eq.model_type?.name ?? 'generic_machine'}
        />
      </group>

      {/* Selection / collision outline */}
      {(isSelected || isColliding) && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w + 0.05, h + 0.05, d + 0.05)]} />
          <lineBasicMaterial color={isColliding ? '#ff0000' : '#E30613'} linewidth={2} />
        </lineSegments>
      )}

      {/* Name label + note */}
      <Html
        position={[0, h / 2 + 0.15, 0]}
        center
        distanceFactor={8}
        occlude={false}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: isColliding ? 'rgba(200,0,0,0.85)' : isSelected ? '#E30613' : 'rgba(255,255,255,0.92)',
          color: isColliding || isSelected ? '#fff' : '#1a1a2e',
          padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
          fontFamily: 'Heebo, sans-serif', whiteSpace: 'nowrap', fontWeight: isSelected ? 600 : 400,
          border: isSelected ? '1px solid #ff4444' : '1px solid rgba(0,0,0,0.1)',
          maxWidth: '140px', textOverflow: 'ellipsis', overflow: 'hidden', direction: 'rtl',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          {isColliding ? '⚠️ ' : ''}{eq.name_he}
          {item.note && (
            <div style={{ fontSize: '9px', opacity: 0.8, marginTop: 1 }}>📝 {item.note}</div>
          )}
        </div>
      </Html>

      {/* Controls when selected */}
      {isSelected && (
        <Html position={[0, h / 2 + 0.45, 0]} center style={{ pointerEvents: 'all' }}>
          <div style={{ display: 'flex', gap: '3px', direction: 'ltr' }}>
            <button
              onClick={(e) => { e.stopPropagation(); rotateItem(item.instanceId) }}
              style={btnStyle('#ffffff')}
              title="סובב"
            >
              ↺
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); cloneItem(item.instanceId) }}
              style={btnStyle('#ffffff')}
              title="שכפל"
            >
              ⧉
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowNoteInput(!showNoteInput) }}
              style={btnStyle('#ffffff')}
              title="הערה"
            >
              📝
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeItem(item.instanceId) }}
              style={btnStyle('#fee2e2')}
              title="הסר"
            >
              ✕
            </button>
          </div>
          {showNoteInput && (
            <div style={{ marginTop: 4 }}>
              <input
                type="text"
                placeholder="הערה..."
                defaultValue={item.note ?? ''}
                onBlur={(e) => { setItemNote(item.instanceId, e.target.value); setShowNoteInput(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setItemNote(item.instanceId, (e.target as HTMLInputElement).value); setShowNoteInput(false) } }}
                autoFocus
                style={{
                  width: 130, padding: '4px 8px', fontSize: 11,
                  border: '1px solid rgba(0,0,0,0.2)', borderRadius: 4,
                  fontFamily: 'Heebo, sans-serif', direction: 'rtl',
                  background: '#fff', color: '#1a1a2e',
                  outline: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </Html>
      )}

      {/* Distance lines (measurement mode) */}
      {distances.map(({ target, dist }) => {
        const [tx, , tz] = target.position
        const midX = (px + tx) / 2
        const midZ = (pz + tz) / 2
        return (
          <group key={target.instanceId} position={[-px, -h / 2, -pz]}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([px, 0.05, pz, tx, 0.05, tz])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#f59e0b" linewidth={1} />
            </line>
            <Html position={[midX, 0.3, midZ]} center style={{ pointerEvents: 'none' }}>
              <div style={{
                background: 'rgba(245,158,11,0.9)', color: '#fff',
                padding: '2px 6px', borderRadius: 4, fontSize: 10,
                fontWeight: 700, fontFamily: 'Heebo, sans-serif',
                whiteSpace: 'nowrap',
              }}>
                {dist.toFixed(1)}m
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg, color: bg === '#fee2e2' ? '#dc2626' : '#1a1a2e',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '4px', padding: '3px 7px', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
}
