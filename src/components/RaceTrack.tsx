import { useRef } from 'react'
import * as THREE from 'three'

export function RaceTrack() {
  const trackRef = useRef<THREE.Group>(null)

  return (
    <group ref={trackRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 30]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <planeGeometry args={[80, 25]} />
        <meshStandardMaterial color="#8B4513" opacity={0.3} transparent />
      </mesh>

      {[...Array(6)].map((_, i) => {
        const laneZ = -10 + i * 4
        return (
          <group key={i}>
            <mesh position={[-40, -0.48, laneZ]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[80, 0.1]} />
              <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
            </mesh>

            <mesh position={[-42, 0, laneZ]}>
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )
      })}

      <mesh position={[0, -0.48, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 0.3]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[40, 1.5, -12 + (i - 10) * 1.5]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight intensity={0.4} groundColor="#444444" />

      <fog attach="fog" args={['#87CEEB', 30, 80]} />
    </group>
  )
}
