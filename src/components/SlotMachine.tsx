import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import Reel from './Reel'

export default function SlotMachine() {
  const machineRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (machineRef.current) {
      machineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03
    }
  })

  return (
    <group ref={machineRef}>
      <RoundedBox args={[6, 4.5, 1]} radius={0.1} position={[0, 0, -0.5]} castShadow>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      <RoundedBox args={[5.5, 2.5, 0.3]} radius={0.05} position={[0, 0.3, 0.1]} castShadow>
        <meshStandardMaterial
          color="#0f0f1e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      <Reel position={[-1.6, 0.3, 0.3]} reelIndex={0} />
      <Reel position={[0, 0.3, 0.3]} reelIndex={1} />
      <Reel position={[1.6, 0.3, 0.3]} reelIndex={2} />

      <Text
        position={[0, 2, 0.1]}
        fontSize={0.4}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/bold.woff"
        outlineWidth={0.02}
        outlineColor="#ff1493"
      >
        SLOT MACHINE
      </Text>

      <RoundedBox args={[0.6, 0.6, 0.3]} radius={0.05} position={[2.5, -1.5, 0.1]} castShadow>
        <meshStandardMaterial
          color="#ff1493"
          metalness={0.7}
          roughness={0.3}
          emissive="#ff1493"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      <pointLight position={[0, 2, 1]} intensity={2} color="#ffd700" />
      <pointLight position={[-2.5, 0, 1]} intensity={1} color="#4169e1" />
      <pointLight position={[2.5, 0, 1]} intensity={1} color="#ff1493" />
    </group>
  )
}
