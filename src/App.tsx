import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { DiceScene } from './components/DiceScene'
import { WalletConnect } from './components/WalletConnect'
import { GameControls } from './components/GameControls'
import { GameHistory } from './components/GameHistory'
import { supabase } from './lib/supabase'
import { useAccount, useChainId } from 'wagmi'

const queryClient = new QueryClient()

function GameApp() {
  const [isRolling, setIsRolling] = useState(false)
  const [currentBet, setCurrentBet] = useState<{ amount: number; prediction: number } | null>(null)
  const [lastResult, setLastResult] = useState<number | null>(null)
  const { address } = useAccount()
  const chainId = useChainId()

  const handleRollDice = (bet: number, prediction: number) => {
    setIsRolling(true)
    setCurrentBet({ amount: bet, prediction })
    setLastResult(null)
  }

  const handleRollComplete = async (result: number) => {
    setIsRolling(false)
    setLastResult(result)

    if (currentBet && address) {
      const won = result === currentBet.prediction
      const payout = won ? currentBet.amount * 5 : 0

      await supabase.from('game_history').insert({
        wallet_address: address.toLowerCase(),
        bet_amount: currentBet.amount,
        prediction: currentBet.prediction,
        result,
        won,
        payout,
        chain_id: chainId,
      })

      if (won) {
        alert(`You won! Result: ${result}. Payout: ${payout} ETH`)
      } else {
        alert(`You lost. Result: ${result}. Better luck next time!`)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            3D Dice Game
          </h1>
          <p style={{ color: '#888', fontSize: '18px' }}>
            Roll the dice and win with crypto
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <WalletConnect />
          <GameControls onRollDice={handleRollDice} disabled={isRolling} />
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <DiceScene onRollComplete={handleRollComplete} />
          {lastResult !== null && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              Result: {lastResult}
            </div>
          )}
        </div>

        <GameHistory />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
