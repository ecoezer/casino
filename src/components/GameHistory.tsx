import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAccount } from 'wagmi'

interface GameRecord {
  id: string
  bet_amount: number
  prediction: number
  result: number
  won: boolean
  payout: number
  created_at: string
}

export function GameHistory() {
  const [history, setHistory] = useState<GameRecord[]>([])
  const { address } = useAccount()

  useEffect(() => {
    if (!address) return

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('game_history')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        setHistory(data)
      }
    }

    fetchHistory()

    const subscription = supabase
      .channel('game_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_history',
          filter: `wallet_address=eq.${address.toLowerCase()}`
        },
        (payload) => {
          setHistory((prev) => [payload.new as GameRecord, ...prev].slice(0, 10))
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [address])

  if (!address) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <h3 style={{ marginBottom: '15px', color: '#fff' }}>Game History</h3>
        <p style={{ color: '#888', textAlign: 'center' }}>Connect wallet to view history</p>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h3 style={{ marginBottom: '15px', color: '#fff' }}>Game History</h3>

      {history.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>No games played yet</p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {history.map((game) => (
            <div
              key={game.id}
              style={{
                padding: '12px',
                marginBottom: '10px',
                background: game.won
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                border: game.won
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span style={{ color: '#888', fontSize: '12px' }}>
                  {new Date(game.created_at).toLocaleString()}
                </span>
                <span style={{
                  color: game.won ? '#10b981' : '#ef4444',
                  fontWeight: 'bold'
                }}>
                  {game.won ? '+' : '-'}{game.won ? game.payout : game.bet_amount} ETH
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                <span>Predicted: {game.prediction}</span>
                <span>Rolled: {game.result}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
