import { useGame } from '../context/GameContext'
import { useEffect, useState } from 'react'
import { supabase, SpinResult } from '../lib/supabase'

export default function GameUI() {
  const { credits, betAmount, setBetAmount, spin, isSpinning, winAmount } = useGame()
  const [recentSpins, setRecentSpins] = useState<SpinResult[]>([])
  const [showWin, setShowWin] = useState(false)

  useEffect(() => {
    fetchRecentSpins()
  }, [])

  useEffect(() => {
    if (winAmount > 0) {
      setShowWin(true)
      setTimeout(() => setShowWin(false), 3000)
      fetchRecentSpins()
    }
  }, [winAmount])

  const fetchRecentSpins = async () => {
    const { data } = await supabase
      .from('spin_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setRecentSpins(data)
    }
  }

  const handleBetChange = (amount: number) => {
    const newBet = Math.max(10, Math.min(100, betAmount + amount))
    setBetAmount(newBet)
  }

  return (
    <>
      <div style={styles.topBar}>
        <div style={styles.creditsContainer}>
          <div style={styles.label}>Credits</div>
          <div style={styles.credits}>{credits}</div>
        </div>

        <div style={styles.betContainer}>
          <div style={styles.label}>Bet Amount</div>
          <div style={styles.betControls}>
            <button
              style={styles.betButton}
              onClick={() => handleBetChange(-10)}
              disabled={isSpinning}
            >
              -
            </button>
            <div style={styles.betAmount}>{betAmount}</div>
            <button
              style={styles.betButton}
              onClick={() => handleBetChange(10)}
              disabled={isSpinning}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div style={styles.centerContainer}>
        <button
          style={{
            ...styles.spinButton,
            opacity: isSpinning || credits < betAmount ? 0.5 : 1,
            transform: isSpinning ? 'scale(0.95)' : 'scale(1)',
          }}
          onClick={spin}
          disabled={isSpinning || credits < betAmount}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>

        {showWin && winAmount > 0 && (
          <div style={styles.winPopup}>
            <div style={styles.winText}>YOU WIN!</div>
            <div style={styles.winAmount}>+{winAmount}</div>
          </div>
        )}
      </div>

      <div style={styles.historyContainer}>
        <div style={styles.historyTitle}>Recent Spins</div>
        <div style={styles.historyList}>
          {recentSpins.map((spin) => (
            <div key={spin.id} style={styles.historyItem}>
              <div style={styles.historySymbols}>
                {spin.symbols.join(' ')}
              </div>
              <div style={styles.historyResult}>
                <span style={{ color: spin.is_winner ? '#00ff88' : '#888' }}>
                  {spin.is_winner ? `+${spin.win_amount}` : `-${spin.bet_amount}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    zIndex: 100,
  },
  creditsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  betContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '8px',
    letterSpacing: '1px',
  },
  credits: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffd700',
    textShadow: '0 0 20px rgba(255,215,0,0.5)',
  },
  betControls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  betButton: {
    width: '48px',
    height: '48px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
  },
  betAmount: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
    minWidth: '80px',
    textAlign: 'center',
  },
  centerContainer: {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    zIndex: 100,
  },
  spinButton: {
    padding: '24px 80px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(245,87,108,0.6)',
    letterSpacing: '2px',
  },
  winPopup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '48px 64px',
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc88 100%)',
    borderRadius: '24px',
    boxShadow: '0 16px 64px rgba(0,255,136,0.6)',
    animation: 'popIn 0.5s ease',
    textAlign: 'center',
  },
  winText: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
    letterSpacing: '3px',
  },
  winAmount: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#fff',
    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  historyContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '320px',
    background: 'rgba(0,0,0,0.8)',
    borderRadius: '16px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  historyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '16px',
    letterSpacing: '1px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  historySymbols: {
    fontSize: '18px',
    fontWeight: '600',
  },
  historyResult: {
    fontSize: '16px',
    fontWeight: '700',
  },
}
