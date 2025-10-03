import { useState, useEffect } from 'react'
import { Horse, Bet, supabase } from '../lib/supabase'

interface BettingPanelProps {
  horses: Horse[]
  currentRaceId: string | null
  isRaceRunning: boolean
  onBetPlaced: () => void
}

export function BettingPanel({ horses, currentRaceId, isRaceRunning, onBetPlaced }: BettingPanelProps) {
  const [selectedHorse, setSelectedHorse] = useState<string>('')
  const [betAmount, setBetAmount] = useState<string>('10')
  const [playerName, setPlayerName] = useState<string>('')
  const [bets, setBets] = useState<Bet[]>([])
  const [totalPool, setTotalPool] = useState<number>(0)

  useEffect(() => {
    if (currentRaceId) {
      loadBets()
    }
  }, [currentRaceId])

  const loadBets = async () => {
    if (!currentRaceId) return

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('race_id', currentRaceId)

    if (data && !error) {
      setBets(data)
      const total = data.reduce((sum, bet) => sum + Number(bet.amount), 0)
      setTotalPool(total)
    }
  }

  const calculateOdds = (horseId: string) => {
    const horseBets = bets.filter(b => b.horse_id === horseId)
    const horseTotal = horseBets.reduce((sum, bet) => sum + Number(bet.amount), 0)

    if (horseTotal === 0) return 3.0

    const odds = totalPool > 0 ? (totalPool / horseTotal) * 0.85 : 3.0
    return Math.max(1.5, Math.min(odds, 10))
  }

  const placeBet = async () => {
    if (!selectedHorse || !currentRaceId || !playerName || !betAmount) {
      alert('Please fill in all fields')
      return
    }

    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid bet amount')
      return
    }

    const odds = calculateOdds(selectedHorse)

    const { error } = await supabase
      .from('bets')
      .insert({
        race_id: currentRaceId,
        horse_id: selectedHorse,
        player_name: playerName,
        amount: amount,
        odds: odds,
        payout: null
      })

    if (error) {
      alert('Failed to place bet: ' + error.message)
      return
    }

    alert(`Bet placed! ${amount} on ${horses.find(h => h.id === selectedHorse)?.name} at ${odds.toFixed(2)}x odds`)
    setBetAmount('10')
    setSelectedHorse('')
    loadBets()
    onBetPlaced()
  }

  return (
    <div className="betting-panel">
      <h2>Place Your Bet</h2>

      <div className="form-group">
        <label>Your Name:</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          disabled={isRaceRunning}
        />
      </div>

      <div className="horses-list">
        {horses.map((horse, index) => {
          const odds = calculateOdds(horse.id)
          const horseBets = bets.filter(b => b.horse_id === horse.id)
          const horseTotal = horseBets.reduce((sum, bet) => sum + Number(bet.amount), 0)

          return (
            <div
              key={horse.id}
              className={`horse-item ${selectedHorse === horse.id ? 'selected' : ''}`}
              onClick={() => !isRaceRunning && setSelectedHorse(horse.id)}
            >
              <div className="horse-info">
                <div className="horse-color" style={{ backgroundColor: horse.color }}></div>
                <div>
                  <div className="horse-name">#{index + 1} {horse.name}</div>
                  <div className="horse-stats">
                    Speed: {horse.speed_rating.toFixed(1)} | Stamina: {horse.stamina_rating.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="horse-odds">
                <div className="odds">{odds.toFixed(2)}x</div>
                <div className="bet-total">${horseTotal.toFixed(0)}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="form-group">
        <label>Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min="1"
          step="1"
          disabled={isRaceRunning}
        />
      </div>

      <button
        onClick={placeBet}
        disabled={!selectedHorse || !currentRaceId || isRaceRunning || !playerName}
        className="bet-button"
      >
        Place Bet ${betAmount}
      </button>

      <div className="pool-info">
        <div>Total Pool: ${totalPool.toFixed(2)}</div>
        <div>Total Bets: {bets.length}</div>
      </div>
    </div>
  )
}
