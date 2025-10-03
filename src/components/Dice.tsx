import { useRef, useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { useSphere } from '@react-three/cannon'

interface DiceProps {
  position: [number, number, number]
  onRollComplete?: (value: number) => void
}

export function Dice({ position, onRollComplete }: DiceProps) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.7],
  }))

  const [isRolling, setIsRolling] = useState(false)
  const rollTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

  const rollDice = () => {
    if (isRolling) return

    setIsRolling(true)
    const force = [
      (Math.random() - 0.5) * 10,
      15,
      (Math.random() - 0.5) * 10
    ]
    const torque = [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ]

    api.velocity.set(force[0], force[1], force[2])
    api.angularVelocity.set(torque[0], torque[1], torque[2])

    if (rollTimeout.current) clearTimeout(rollTimeout.current)
    rollTimeout.current = setTimeout(() => {
      setIsRolling(false)
      const value = Math.floor(Math.random() * 6) + 1
      if (onRollComplete) onRollComplete(value)
    }, 3000)
  }

  return (
    <group>
      <RoundedBox
        ref={ref as any}
        args={[1.5, 1.5, 1.5]}
        radius={0.1}
        smoothness={4}
        onClick={rollDice}
        castShadow
      >
        <meshStandardMaterial color="#ffffff" />
        <Text
          position={[0, 0, 0.76]}
          fontSize={0.5}
          color="black"
        >
          1
        </Text>
        <Text
          position={[0, 0, -0.76]}
          fontSize={0.5}
          color="black"
          rotation={[0, Math.PI, 0]}
        >
          6
        </Text>
        <Text
          position={[0.76, 0, 0]}
          fontSize={0.5}
          color="black"
          rotation={[0, Math.PI / 2, 0]}
        >
          3
        </Text>
        <Text
          position={[-0.76, 0, 0]}
          fontSize={0.5}
          color="black"
          rotation={[0, -Math.PI / 2, 0]}
        >
          4
        </Text>
        <Text
          position={[0, 0.76, 0]}
          fontSize={0.5}
          color="black"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          2
        </Text>
        <Text
          position={[0, -0.76, 0]}
          fontSize={0.5}
          color="black"
          rotation={[Math.PI / 2, 0, 0]}
        >
          5
        </Text>
      </RoundedBox>
    </group>
  )
}
