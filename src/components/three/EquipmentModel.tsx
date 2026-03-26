import * as THREE from 'three'

interface ModelProps {
  w: number  // width in meters
  d: number  // depth in meters
  h: number  // height in meters
  color: string
  isSelected: boolean
}

function Box({ pos, size, color, roughness = 0.6, metalness = 0.3 }: {
  pos: [number, number, number]
  size: [number, number, number]
  color: string
  roughness?: number
  metalness?: number
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

function Cyl({ pos, r, h, color }: { pos: [number, number, number]; r: number; h: number; color: string }) {
  return (
    <mesh position={pos} castShadow>
      <cylinderGeometry args={[r, r, h, 12]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
    </mesh>
  )
}

// ─── TREADMILL ────────────────────────────────────────────────────────────────
function TreadmillModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  const belt = '#3a3a3a'
  return (
    <group>
      {/* Belt deck */}
      <Box pos={[0, 0, 0]} size={[w, 0.1, d * 0.75]} color={belt} roughness={0.9} metalness={0} />
      {/* Side rails */}
      <Box pos={[-w / 2 + 0.04, 0.1, 0]} size={[0.06, 0.08, d * 0.75]} color={color} />
      <Box pos={[w / 2 - 0.04, 0.1, 0]} size={[0.06, 0.08, d * 0.75]} color={color} />
      {/* Left upright */}
      <Box pos={[-w / 2 + 0.06, h * 0.45, -d * 0.3]} size={[0.06, h * 0.9, 0.06]} color={color} />
      {/* Right upright */}
      <Box pos={[w / 2 - 0.06, h * 0.45, -d * 0.3]} size={[0.06, h * 0.9, 0.06]} color={color} />
      {/* Crossbar / handlebars */}
      <Box pos={[0, h * 0.85, -d * 0.3]} size={[w * 0.8, 0.05, 0.05]} color={dark} />
      {/* Console */}
      <Box pos={[0, h * 0.9, -d * 0.32]} size={[w * 0.55, 0.22, 0.06]} color={dark} roughness={0.3} metalness={0.1} />
      {/* Motor housing */}
      <Box pos={[0, 0.08, d * 0.4]} size={[w * 0.4, 0.12, 0.15]} color={dark} />
    </group>
  )
}

// ─── ELLIPTICAL ───────────────────────────────────────────────────────────────
function EllipticalModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  return (
    <group>
      {/* Base frame */}
      <Box pos={[0, 0.05, 0]} size={[w, 0.1, d * 0.9]} color={dark} />
      {/* Main vertical column */}
      <Box pos={[0, h * 0.45, -d * 0.25]} size={[0.1, h * 0.9, 0.1]} color={color} />
      {/* Console */}
      <Box pos={[0, h * 0.88, -d * 0.27]} size={[w * 0.5, 0.2, 0.08]} color={dark} roughness={0.3} />
      {/* Rear flywheel housing */}
      <Cyl pos={[0, 0.3, d * 0.35]} r={w * 0.28} h={0.12} color={color} />
      {/* Left arm */}
      <Box pos={[-w * 0.35, h * 0.45, 0]} size={[0.06, h * 0.7, 0.06]} color={color} />
      {/* Right arm */}
      <Box pos={[w * 0.35, h * 0.45, 0]} size={[0.06, h * 0.7, 0.06]} color={color} />
      {/* Left pedal */}
      <Box pos={[-w * 0.3, 0.08, d * 0.2]} size={[0.18, 0.05, 0.35]} color={dark} roughness={0.9} />
      {/* Right pedal */}
      <Box pos={[w * 0.3, 0.08, -d * 0.2]} size={[0.18, 0.05, 0.35]} color={dark} roughness={0.9} />
    </group>
  )
}

// ─── SPINNING BIKE ────────────────────────────────────────────────────────────
function SpinningBikeModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  return (
    <group>
      {/* Main frame diagonal */}
      <Box pos={[0, h * 0.3, 0]} size={[0.08, h * 0.55, d * 0.7]} color={color} />
      {/* Flywheel */}
      <Cyl pos={[0, h * 0.2, d * 0.35]} r={w * 0.35} h={0.1} color={dark} />
      {/* Seat post */}
      <Box pos={[0, h * 0.4, -d * 0.28]} size={[0.06, h * 0.45, 0.06]} color={color} />
      {/* Seat */}
      <Box pos={[0, h * 0.62, -d * 0.28]} size={[w * 0.35, 0.05, 0.22]} color={dark} roughness={0.8} />
      {/* Handlebar post */}
      <Box pos={[0, h * 0.5, d * 0.3]} size={[0.06, h * 0.5, 0.06]} color={color} />
      {/* Handlebars */}
      <Box pos={[0, h * 0.73, d * 0.3]} size={[w * 0.6, 0.05, 0.05]} color={dark} />
      {/* Base L */}
      <Box pos={[-w * 0.35, 0.04, 0]} size={[0.06, 0.08, d * 0.6]} color={dark} />
      {/* Base R */}
      <Box pos={[w * 0.35, 0.04, 0]} size={[0.06, 0.08, d * 0.6]} color={dark} />
    </group>
  )
}

// ─── ROWING MACHINE ───────────────────────────────────────────────────────────
function RowingModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  return (
    <group>
      {/* Rail */}
      <Box pos={[0, 0.12, 0]} size={[w * 0.3, 0.06, d]} color={color} />
      {/* Foot rest box */}
      <Box pos={[0, 0.18, d * 0.37]} size={[w * 0.55, 0.18, 0.22]} color={dark} />
      {/* Seat */}
      <Box pos={[0, 0.24, 0]} size={[w * 0.25, 0.06, 0.22]} color={dark} roughness={0.8} />
      {/* Monitor arm */}
      <Box pos={[0, 0.5, d * 0.4]} size={[0.04, 0.6, 0.04]} color={color} />
      {/* Monitor */}
      <Box pos={[0, 0.75, d * 0.4]} size={[w * 0.4, 0.22, 0.06]} color={dark} roughness={0.3} />
      {/* Handle (oar) */}
      <Box pos={[0, 0.3, d * 0.25]} size={[w * 0.55, 0.04, 0.04]} color={dark} />
      {/* Rear legs */}
      <Box pos={[-w * 0.2, 0.06, -d * 0.45]} size={[0.04, 0.12, 0.04]} color={color} />
      <Box pos={[w * 0.2, 0.06, -d * 0.45]} size={[0.04, 0.12, 0.04]} color={color} />
    </group>
  )
}

// ─── CABLE MACHINE / FUNCTIONAL TRAINER ───────────────────────────────────────
function CableMachineModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  const stack = '#404050'
  return (
    <group>
      {/* Left tower */}
      <Box pos={[-w * 0.4, h * 0.5, 0]} size={[w * 0.15, h, d * 0.25]} color={color} />
      {/* Right tower */}
      <Box pos={[w * 0.4, h * 0.5, 0]} size={[w * 0.15, h, d * 0.25]} color={color} />
      {/* Top crossbar */}
      <Box pos={[0, h * 0.97, 0]} size={[w, 0.08, d * 0.22]} color={dark} />
      {/* Weight stack L */}
      <Box pos={[-w * 0.4, h * 0.45, 0]} size={[w * 0.09, h * 0.8, d * 0.18]} color={stack} />
      {/* Weight stack R */}
      <Box pos={[w * 0.4, h * 0.45, 0]} size={[w * 0.09, h * 0.8, d * 0.18]} color={stack} />
      {/* Center base */}
      <Box pos={[0, 0.06, 0]} size={[w * 0.5, 0.12, d]} color={dark} />
    </group>
  )
}

// ─── MULTI GYM ────────────────────────────────────────────────────────────────
function MultiGymModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  const pad = '#4a3020'
  return (
    <group>
      {/* Main frame */}
      <Box pos={[0, h * 0.5, 0]} size={[0.08, h, 0.08]} color={color} />
      {/* Left frame */}
      <Box pos={[-w * 0.4, h * 0.5, 0]} size={[0.08, h, 0.08]} color={color} />
      {/* Right frame */}
      <Box pos={[w * 0.4, h * 0.5, 0]} size={[0.08, h, 0.08]} color={color} />
      {/* Top rail */}
      <Box pos={[0, h, 0]} size={[w, 0.08, 0.08]} color={dark} />
      {/* Cable pulley top */}
      <Cyl pos={[0, h * 0.98, 0]} r={0.08} h={0.06} color={color} />
      {/* Lat pulldown bar */}
      <Box pos={[0, h * 0.85, -d * 0.1]} size={[w * 0.7, 0.04, 0.04]} color={dark} />
      {/* Seat/pad station */}
      <Box pos={[0, h * 0.3, d * 0.1]} size={[0.35, 0.08, 0.45]} color={pad} roughness={0.9} />
      {/* Weight stack */}
      <Box pos={[w * 0.38, h * 0.4, 0]} size={[0.1, h * 0.65, 0.2]} color='#2a2a2a' />
      {/* Base */}
      <Box pos={[0, 0.06, 0]} size={[w, 0.12, d]} color={dark} />
    </group>
  )
}

// ─── BENCH PRESS ──────────────────────────────────────────────────────────────
function BenchPressModel({ w, d, h, color }: ModelProps) {
  const pad = '#3a2010'
  const dark = '#555566'
  return (
    <group>
      {/* Bench pad */}
      <Box pos={[0, h * 0.28, 0]} size={[w * 0.28, 0.1, d * 0.65]} color={pad} roughness={0.9} />
      {/* Bench frame */}
      <Box pos={[0, h * 0.12, 0]} size={[w * 0.18, 0.08, d * 0.55]} color={dark} />
      {/* Left upright */}
      <Box pos={[-w * 0.3, h * 0.5, d * 0.2]} size={[0.06, h, 0.06]} color={color} />
      {/* Right upright */}
      <Box pos={[w * 0.3, h * 0.5, d * 0.2]} size={[0.06, h, 0.06]} color={color} />
      {/* Bar holders */}
      <Box pos={[-w * 0.3, h * 0.92, d * 0.2]} size={[0.12, 0.05, 0.12]} color={dark} />
      <Box pos={[w * 0.3, h * 0.92, d * 0.2]} size={[0.12, 0.05, 0.12]} color={dark} />
      {/* Barbell */}
      <Box pos={[0, h * 0.95, d * 0.2]} size={[w * 0.9, 0.04, 0.04]} color='#888' metalness={0.8} roughness={0.2} />
      {/* Weight plates L */}
      <Cyl pos={[-w * 0.42, h * 0.95, d * 0.2]} r={0.22} h={0.06} color='#444' />
      {/* Weight plates R */}
      <Cyl pos={[w * 0.42, h * 0.95, d * 0.2]} r={0.22} h={0.06} color='#444' />
    </group>
  )
}

// ─── SMITH MACHINE ────────────────────────────────────────────────────────────
function SmithMachineModel({ w, d, h, color }: ModelProps) {
  const dark = '#555566'
  return (
    <group>
      {/* Front left post */}
      <Box pos={[-w * 0.45, h * 0.5, -d * 0.4]} size={[0.08, h, 0.08]} color={color} />
      {/* Front right post */}
      <Box pos={[w * 0.45, h * 0.5, -d * 0.4]} size={[0.08, h, 0.08]} color={color} />
      {/* Back left post */}
      <Box pos={[-w * 0.45, h * 0.5, d * 0.4]} size={[0.08, h, 0.08]} color={color} />
      {/* Back right post */}
      <Box pos={[w * 0.45, h * 0.5, d * 0.4]} size={[0.08, h, 0.08]} color={color} />
      {/* Top frame */}
      <Box pos={[0, h, 0]} size={[w, 0.08, d * 0.85]} color={dark} />
      {/* Smith bar (movable) */}
      <Box pos={[0, h * 0.65, 0]} size={[w * 0.85, 0.05, 0.05]} color='#aaa' metalness={0.9} roughness={0.1} />
      {/* Weight storage pegs */}
      <Box pos={[-w * 0.48, h * 0.2, d * 0.3]} size={[0.1, 0.05, 0.3]} color={dark} />
      <Box pos={[w * 0.48, h * 0.2, d * 0.3]} size={[0.1, 0.05, 0.3]} color={dark} />
      {/* Base */}
      <Box pos={[0, 0.06, 0]} size={[w, 0.12, d]} color={dark} />
    </group>
  )
}

// ─── GENERIC / FALLBACK ───────────────────────────────────────────────────────
function GenericModel({ w, d, h, color }: ModelProps) {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
    </mesh>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function EquipmentModel(props: ModelProps & { modelType: string }) {
  const { modelType, ...rest } = props

  // Center all models vertically (they render from y=0 upward, so offset by -h/2)
  const yOffset = -rest.h / 2

  return (
    <group position={[0, yOffset, 0]}>
      {modelType === 'treadmill' && <TreadmillModel {...rest} />}
      {modelType === 'elliptical' && <EllipticalModel {...rest} />}
      {modelType === 'exercise_bike' && <SpinningBikeModel {...rest} />}
      {modelType === 'spinning_bike' && <SpinningBikeModel {...rest} />}
      {modelType === 'rowing_machine' && <RowingModel {...rest} />}
      {modelType === 'cable_machine' && <CableMachineModel {...rest} />}
      {modelType === 'functional_trainer' && <CableMachineModel {...rest} />}
      {modelType === 'multi_gym' && <MultiGymModel {...rest} />}
      {modelType === 'bench_press' && <BenchPressModel {...rest} />}
      {modelType === 'smith_machine' && <SmithMachineModel {...rest} />}
      {(modelType === 'power_rack' || modelType === 'lat_pulldown') && <SmithMachineModel {...rest} />}
      {!['treadmill','elliptical','exercise_bike','spinning_bike','rowing_machine',
         'cable_machine','functional_trainer','multi_gym','bench_press','smith_machine',
         'power_rack','lat_pulldown'].includes(modelType) && <GenericModel {...rest} />}
    </group>
  )
}
