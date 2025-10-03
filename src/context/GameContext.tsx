import { createContext, useContext, useState, ReactNode } from 'react'

interface GameContextType {
  credits: number
  betAmount: number
  isSpinning: boolean
  symbols: string[]
  winAmount: number
  speedMode: boolean
  autoSpinMode: boolean
  autoSpinCount: number
  autoSpinsRemaining: number
  setBetAmount: (amount: number) => void
  spin: () => void
  setSpinning: (spinning: boolean) => void
  setSymbols: (symbols: string[]) => void
  setWinAmount: (amount: number) => void
  addCredits: (amount: number) => void
  setSpeedMode: (enabled: boolean) => void
  startAutoSpin: (count: number) => void
  stopAutoSpin: () => void
  decrementAutoSpin: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐']

export function GameProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(1000)
  const [betAmount, setBetAmount] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [symbols, setSymbols] = useState(['🍒', '🍋', '🍊'])
  const [winAmount, setWinAmount] = useState(0)
  const [speedMode, setSpeedMode] = useState(false)
  const [autoSpinMode, setAutoSpinMode] = useState(false)
  const [autoSpinCount, setAutoSpinCount] = useState(0)
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState(0)

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount)
  }

  const spin = () => {
    if (credits < betAmount || isSpinning) return

    setCredits(prev => prev - betAmount)
    setIsSpinning(true)
    setWinAmount(0)
  }

  const startAutoSpin = (count: number) => {
    if (credits < betAmount * count) return
    setAutoSpinMode(true)
    setAutoSpinCount(count)
    setAutoSpinsRemaining(count)
  }

  const stopAutoSpin = () => {
    setAutoSpinMode(false)
    setAutoSpinCount(0)
    setAutoSpinsRemaining(0)
  }

  const decrementAutoSpin = () => {
    setAutoSpinsRemaining(prev => prev - 1)
  }

  return (
    <GameContext.Provider
      value={{
        credits,
        betAmount,
        isSpinning,
        symbols,
        winAmount,
        speedMode,
        autoSpinMode,
        autoSpinCount,
        autoSpinsRemaining,
        setBetAmount,
        spin,
        setSpinning: setIsSpinning,
        setSymbols,
        setWinAmount,
        addCredits,
        setSpeedMode,
        startAutoSpin,
        stopAutoSpin,
        decrementAutoSpin,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
