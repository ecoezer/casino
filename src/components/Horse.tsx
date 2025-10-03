import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Horse as HorseType } from '../lib/supabase'

interface HorseProps {
  horse: HorseType
  lane: number
  position: number
  speed: number
  isRunning: boolean
}

export function Horse({ horse, lane, position, speed, isRunning }: HorseProps) {
  const groupRef = useRef<THREE.Group>(null)
  const legPhaseRef = useRef(0)
  const bodyBounceRef = useRef(0)

  const laneZ = -10 + lane * 4

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    if (isRunning) {
      legPhaseRef.current += delta * speed * 15
      bodyBounceRef.current += delta * speed * 20
    }
  })

  return (
    <group ref={groupRef} position={[position, 0, laneZ]}>
      <group position={[0, Math.abs(Math.sin(bodyBounceRef.current)) * 0.15 + 0.8, 0]}>
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.6]} />
          <meshStandardMaterial color={horse.color} />
        </mesh>

        <mesh castShadow position={[0.5, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={horse.color} />
        </mesh>

        <mesh castShadow position={[0.7, 0.6, 0.15]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh castShadow position={[0.7, 0.6, -0.15]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        <mesh castShadow position={[-0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.3, 0.6, 0.2]} />
          <meshStandardMaterial color={horse.color} />
        </mesh>

        <group position={[-0.4, -0.3, 0.25]}>
          <mesh castShadow rotation={[Math.sin(legPhaseRef.current) * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color={horse.color} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        <group position={[-0.4, -0.3, -0.25]}>
          <mesh castShadow rotation={[Math.sin(legPhaseRef.current + Math.PI) * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color={horse.color} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        <group position={[0.3, -0.3, 0.25]}>
          <mesh castShadow rotation={[Math.sin(legPhaseRef.current + Math.PI / 2) * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color={horse.color} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        <group position={[0.3, -0.3, -0.25]}>
          <mesh castShadow rotation={[Math.sin(legPhaseRef.current + Math.PI * 1.5) * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color={horse.color} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
