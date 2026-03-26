import { useMemo } from 'react'
import * as THREE from 'three'
import { useDesignStore, FloorTexture, RoomShape } from '../../store/designStore'

const FLOOR_COLORS: Record<FloorTexture, string> = {
  rubber: '#3a3a3a',
  wood: '#c4956a',
  concrete: '#b8b8b8',
  turf: '#4a8e3b',
}

const FLOOR_ROUGHNESS: Record<FloorTexture, number> = {
  rubber: 0.95,
  wood: 0.7,
  concrete: 0.85,
  turf: 0.98,
}

/**
 * Returns 2D polygon points (x,z) for each room shape, centered at origin.
 * All shapes assume the "cut" is taken from the top-right corner.
 *
 * Rectangle:  full w×d
 * L-shape:    rectangle minus top-right cutout
 * U-shape:    rectangle minus two top corners
 * T-shape:    top bar (full width) + center stem
 */
function getRoomPoints(
  shape: RoomShape,
  w: number,
  d: number,
  cutW: number,
  cutD: number
): THREE.Vector2[] {
  const hw = w / 2
  const hd = d / 2
  const cw = Math.min(cutW, w - 1)
  const cd = Math.min(cutD, d - 1)

  switch (shape) {
    case 'L':
      // L-shape: cut from top-right corner
      return [
        new THREE.Vector2(-hw, -hd),
        new THREE.Vector2(hw, -hd),
        new THREE.Vector2(hw, hd - cd),
        new THREE.Vector2(hw - cw, hd - cd),
        new THREE.Vector2(hw - cw, hd),
        new THREE.Vector2(-hw, hd),
      ]

    case 'U':
      // U-shape: cuts from both top corners
      return [
        new THREE.Vector2(-hw, -hd),
        new THREE.Vector2(hw, -hd),
        new THREE.Vector2(hw, hd - cd),
        new THREE.Vector2(hw - cw, hd - cd),
        new THREE.Vector2(hw - cw, hd),
        new THREE.Vector2(-hw + cw, hd),
        new THREE.Vector2(-hw + cw, hd - cd),
        new THREE.Vector2(-hw, hd - cd),
      ]

    case 'T': {
      // T-shape: full-width top bar + narrower center stem
      const stemHalfW = (w - cw * 2) / 2
      return [
        new THREE.Vector2(-hw, hd - cd),
        new THREE.Vector2(-hw, hd),
        new THREE.Vector2(hw, hd),
        new THREE.Vector2(hw, hd - cd),
        new THREE.Vector2(stemHalfW, hd - cd),
        new THREE.Vector2(stemHalfW, -hd),
        new THREE.Vector2(-stemHalfW, -hd),
        new THREE.Vector2(-stemHalfW, hd - cd),
      ]
    }

    case 'rectangle':
    default:
      return [
        new THREE.Vector2(-hw, -hd),
        new THREE.Vector2(hw, -hd),
        new THREE.Vector2(hw, hd),
        new THREE.Vector2(-hw, hd),
      ]
  }
}

/** Build wall segments from polygon edges */
function WallSegments({
  points,
  height,
  thickness,
}: {
  points: THREE.Vector2[]
  height: number
  thickness: number
}) {
  const walls = useMemo(() => {
    const segs: { pos: [number, number, number]; size: [number, number, number]; rotY: number }[] = []

    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      const b = points[(i + 1) % points.length]
      const dx = b.x - a.x
      const dz = b.y - a.y
      const len = Math.sqrt(dx * dx + dz * dz)
      const angle = Math.atan2(dx, dz)

      segs.push({
        pos: [(a.x + b.x) / 2, height / 2, (a.y + b.y) / 2],
        size: [thickness, height, len],
        rotY: angle,
      })
    }
    return segs
  }, [points, height, thickness])

  return (
    <>
      {walls.map((wall, i) => (
        <mesh
          key={i}
          position={wall.pos}
          rotation={[0, wall.rotY, 0]}
          receiveShadow
        >
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color="#c8cdd5"
            transparent
            opacity={0.55}
            roughness={1}
          />
        </mesh>
      ))}
    </>
  )
}

/** Red border lines on the floor */
function FloorBorder({ points }: { points: THREE.Vector2[] }) {
  const geometry = useMemo(() => {
    const verts: number[] = []
    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      const b = points[(i + 1) % points.length]
      verts.push(a.x, 0.004, a.y)
      verts.push(b.x, 0.004, b.y)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [points])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#E30613" linewidth={1} />
    </lineSegments>
  )
}

export function Room() {
  const w = useDesignStore((s) => s.roomWidth)
  const d = useDesignStore((s) => s.roomDepth)
  const h = useDesignStore((s) => s.roomHeight)
  const floorTexture = useDesignStore((s) => s.floorTexture)
  const roomShape = useDesignStore((s) => s.roomShape)
  const roomCutWidth = useDesignStore((s) => s.roomCutWidth)
  const roomCutDepth = useDesignStore((s) => s.roomCutDepth)

  const t = 0.12

  const floorColor = FLOOR_COLORS[floorTexture]
  const floorRoughness = FLOOR_ROUGHNESS[floorTexture]

  const points = useMemo(
    () => getRoomPoints(roomShape, w, d, roomCutWidth, roomCutDepth),
    [roomShape, w, d, roomCutWidth, roomCutDepth]
  )

  const floorShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y)
    }
    shape.closePath()
    return shape
  }, [points])

  const gridSize = Math.ceil(Math.max(w, d) * 2)

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color={floorColor} roughness={floorRoughness} side={THREE.DoubleSide} />
      </mesh>

      {/* Grid overlay */}
      <gridHelper args={[gridSize, gridSize, '#b0b8c4', '#c4cad2']} position={[0, 0.002, 0]} />

      {/* Floor border */}
      <FloorBorder points={points} />

      {/* Walls */}
      <WallSegments points={points} height={h} thickness={t} />
    </group>
  )
}
