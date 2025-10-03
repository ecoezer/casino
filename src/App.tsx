import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import SlotMachine from './components/SlotMachine'
import GameUI from './components/GameUI'
import { GameProvider } from './context/GameContext'

function App() {
  return (
    <GameProvider>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0a0a15']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4169e1" />
        <pointLight position={[10, -10, -5]} intensity={0.5} color="#ff1493" />

        <SlotMachine />

        <Environment preset="night" />
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      <GameUI />
    </GameProvider>
  )
}

export default App
