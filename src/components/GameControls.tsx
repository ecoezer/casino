import { useState } from 'react'
import { useAccount } from 'wagmi'

interface GameControlsProps {
  onRollDice: (bet: number, prediction: number) => void
  disabled: boolean
}

export function GameControls({ onRollDice, disabled }: GameControlsProps) {
  const [betAmount, setBetAmount] = useState('0.01')
  const [prediction, setPrediction] = useState(4)
  const { isConnected } = useAccount()

  const handleRoll = () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    onRollDice(parseFloat(betAmount), prediction)
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h3 style={{ marginBottom: '20px', color: '#fff' }}>Game Controls</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
          Bet Amount (ETH)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
          Predict Result: {prediction}
        </label>
        <input
          type="range"
          min="1"
          max="6"
          value={prediction}
          onChange={(e) => setPrediction(parseInt(e.target.value))}
          disabled={disabled}
          style={{ width: '100%' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px',
          color: '#666',
          fontSize: '12px'
        }}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>
      </div>

      <button
        onClick={handleRoll}
        disabled={disabled || !isConnected}
        style={{
          width: '100%',
          padding: '15px',
          background: disabled ? '#555' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '16px',
        }}
      >
        {disabled ? 'Rolling...' : 'Roll Dice'}
      </button>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#888'
      }}>
        Win 5x your bet if you guess correctly!
      </div>
    </div>
  )
}
