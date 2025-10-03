import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame, SLOT_SYMBOLS } from '../context/GameContext'
import { supabase } from '../lib/supabase'

interface ReelProps {
  position: [number, number, number]
  reelIndex: number
}

export default function Reel({ position, reelIndex }: ReelProps) {
  const { isSpinning, symbols, setSymbols, setSpinning, betAmount, setWinAmount, addCredits, speedMode, autoSpinMode, autoSpinsRemaining, decrementAutoSpin, spin } = useGame()
  const reelRef = useRef<THREE.Group>(null)
  const [currentSymbol, setCurrentSymbol] = useState(symbols[reelIndex])
  const [rotation, setRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [finalSymbol, setFinalSymbol] = useState('')
  const spinStartTime = useRef(0)
  const baseDuration = speedMode ? 800 : 2000
  const spinDuration = baseDuration + reelIndex * (speedMode ? 200 : 500)

  useEffect(() => {
    if (isSpinning) {
      spinStartTime.current = Date.now()
      const randomSymbol = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
      setFinalSymbol(randomSymbol)
      setTargetRotation(rotation + Math.PI * 2 * 5)
    }
  }, [isSpinning])

  useFrame(() => {
    if (isSpinning && reelRef.current) {
      const elapsed = Date.now() - spinStartTime.current

      if (elapsed < spinDuration) {
        const progress = elapsed / spinDuration
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentRot = rotation + (targetRotation - rotation) * easeOut

        reelRef.current.rotation.x = currentRot

        if (Math.floor(currentRot / (Math.PI * 0.5)) % 2 === 0) {
          const randomSymbol = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
          setCurrentSymbol(randomSymbol)
        }
      } else {
        reelRef.current.rotation.x = targetRotation
        setRotation(targetRotation)
        setCurrentSymbol(finalSymbol)

        if (reelIndex === 2) {
          const newSymbols = [
            symbols[0],
            symbols[1],
            finalSymbol
          ]

          if (symbols[0] !== symbols[1]) {
            newSymbols[0] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
            newSymbols[1] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
          }

          setSymbols(newSymbols)
          setSpinning(false)
          checkWin(newSymbols)

          if (autoSpinMode && autoSpinsRemaining > 1) {
            decrementAutoSpin()
            setTimeout(() => spin(), speedMode ? 300 : 800)
          } else if (autoSpinMode) {
            decrementAutoSpin()
          }
        } else if (reelIndex === 0 || reelIndex === 1) {
          const updatedSymbols = [...symbols]
          updatedSymbols[reelIndex] = finalSymbol
          setSymbols(updatedSymbols)
        }
      }
    }
  })

  const checkWin = async (resultSymbols: string[]) => {
    const [s1, s2, s3] = resultSymbols
    let winnings = 0
    let isWinner = false

    if (s1 === s2 && s2 === s3) {
      if (s1 === '💎') {
        winnings = betAmount * 100
      } else if (s1 === '7️⃣') {
        winnings = betAmount * 50
      } else if (s1 === '⭐') {
        winnings = betAmount * 25
      } else {
        winnings = betAmount * 10
      }
      isWinner = true
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      winnings = betAmount * 2
      isWinner = true
    }

    if (winnings > 0) {
      setWinAmount(winnings)
      addCredits(winnings)
    }

    await supabase.from('spin_results').insert({
      symbols: resultSymbols,
      bet_amount: betAmount,
      win_amount: winnings,
      is_winner: isWinner
    })
  }

  return (
    <group position={position} ref={reelRef}>
      <RoundedBox args={[1.2, 1.8, 0.2]} radius={0.05}>
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.7}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.15]}
        fontSize={0.8}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {currentSymbol}
      </Text>

      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.25, 1.85, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}
