import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { RaceTrack } from './RaceTrack'
import { Horse } from './Horse'
import { Horse as HorseType } from '../lib/supabase'

interface RaceSceneProps {
  horses: HorseType[]
  positions: number[]
  speeds: number[]
  isRunning: boolean
}

export function RaceScene({ horses, positions, speeds, isRunning }: RaceSceneProps) {
  return (
    <div className="race-scene">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[-20, 12, 0]} fov={60} />
        <OrbitControls
          enablePan={false}
          minDistance={15}
          maxDistance={40}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
        />

        <RaceTrack />

        {horses.map((horse, index) => (
          <Horse
            key={horse.id}
            horse={horse}
            lane={index}
            position={positions[index]}
            speed={speeds[index]}
            isRunning={isRunning}
          />
        ))}

        <color attach="background" args={['#87CEEB']} />
      </Canvas>
    </div>
  )
}
