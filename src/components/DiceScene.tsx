import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import { Dice } from './Dice'

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
  }))

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

interface DiceSceneProps {
  onRollComplete: (value: number) => void
}

export function DiceScene({ onRollComplete }: DiceSceneProps) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#0f1419']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics gravity={[0, -30, 0]}>
          <Dice position={[0, 5, 0]} onRollComplete={onRollComplete} />
          <Ground />
        </Physics>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
