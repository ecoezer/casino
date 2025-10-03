import { useState, useEffect, useRef } from 'react'
import { RaceScene } from './components/RaceScene'
import { BettingPanel } from './components/BettingPanel'
import { supabase, Horse, Race, RaceResult } from './lib/supabase'

function App() {
  const [horses, setHorses] = useState<Horse[]>([])
  const [currentRace, setCurrentRace] = useState<Race | null>(null)
  const [isRaceRunning, setIsRaceRunning] = useState(false)
  const [positions, setPositions] = useState<number[]>([])
  const [speeds, setSpeeds] = useState<number[]>([])
  const [raceResults, setRaceResults] = useState<RaceResult[]>([])
  const [winner, setWinner] = useState<Horse | null>(null)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    loadHorses()
    createNewRace()
  }, [])

  const loadHorses = async () => {
    const { data, error } = await supabase
      .from('horses')
      .select('*')
      .order('name')

    if (data && !error) {
      setHorses(data)
      setPositions(new Array(data.length).fill(-40))
      setSpeeds(new Array(data.length).fill(0))
    }
  }

  const createNewRace = async () => {
    const { data: races } = await supabase
      .from('races')
      .select('race_number')
      .order('race_number', { ascending: false })
      .limit(1)

    const nextRaceNumber = races && races.length > 0 ? races[0].race_number + 1 : 1

    const { data, error } = await supabase
      .from('races')
      .insert({
        race_number: nextRaceNumber,
        status: 'pending'
      })
      .select()
      .single()

    if (data && !error) {
      setCurrentRace(data)
      setRaceResults([])
      setWinner(null)
    }
  }

  const startRace = async () => {
    if (!currentRace || horses.length === 0) return

    await supabase
      .from('races')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', currentRace.id)

    setIsRaceRunning(true)
    setRaceResults([])
    setWinner(null)

    const initialSpeeds = horses.map(horse => {
      const baseSpeed = (horse.speed_rating + horse.stamina_rating) / 20
      const variance = 0.15
      return baseSpeed * (1 + (Math.random() - 0.5) * variance)
    })
    setSpeeds(initialSpeeds)

    startTimeRef.current = Date.now()
    animateRace(initialSpeeds)
  }

  const animateRace = (raceSpeeds: number[]) => {
    const finishLine = 38
    let currentPositions = [...positions]
    const results: { horseIndex: number; finishTime: number }[] = []

    const animate = () => {
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000
      let raceComplete = true

      currentPositions = currentPositions.map((pos, index) => {
        if (pos < finishLine) {
          raceComplete = false

          const fatigueStart = 5
          const fatigueFactor = elapsedTime > fatigueStart
            ? 1 - ((elapsedTime - fatigueStart) * (1 - horses[index].stamina_rating / 12))
            : 1

          const currentSpeed = raceSpeeds[index] * Math.max(0.3, fatigueFactor)

          const randomVariance = (Math.random() - 0.5) * 0.02
          const newPos = pos + currentSpeed + randomVariance

          if (newPos >= finishLine && !results.find(r => r.horseIndex === index)) {
            results.push({ horseIndex: index, finishTime: elapsedTime })
            return finishLine
          }

          return newPos
        }
        return pos
      })

      setPositions([...currentPositions])

      if (raceComplete) {
        completeRace(results)
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }

  const completeRace = async (results: { horseIndex: number; finishTime: number }[]) => {
    setIsRaceRunning(false)

    if (!currentRace) return

    results.sort((a, b) => a.finishTime - b.finishTime)

    const raceResultsData = results.map((result, index) => ({
      race_id: currentRace.id,
      horse_id: horses[result.horseIndex].id,
      position: index + 1,
      finish_time: result.finishTime
    }))

    await supabase.from('race_results').insert(raceResultsData)

    const winnerHorse = horses[results[0].horseIndex]
    setWinner(winnerHorse)

    await supabase
      .from('races')
      .update({
        status: 'completed',
        winner_id: winnerHorse.id,
        completed_at: new Date().toISOString()
      })
      .eq('id', currentRace.id)

    const { data: bets } = await supabase
      .from('bets')
      .select('*')
      .eq('race_id', currentRace.id)

    if (bets) {
      for (const bet of bets) {
        const payout = bet.horse_id === winnerHorse.id
          ? bet.amount * bet.odds
          : 0

        await supabase
          .from('bets')
          .update({ payout })
          .eq('id', bet.id)
      }
    }

    setRaceResults(raceResultsData as RaceResult[])
  }

  const resetRace = async () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setPositions(new Array(horses.length).fill(-40))
    setSpeeds(new Array(horses.length).fill(0))
    setIsRaceRunning(false)
    await createNewRace()
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🐎 Horse Racing Arena</h1>
        {currentRace && (
          <div className="race-info">
            Race #{currentRace.race_number} - {currentRace.status.toUpperCase()}
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="race-container">
          <RaceScene
            horses={horses}
            positions={positions}
            speeds={speeds}
            isRunning={isRaceRunning}
          />

          <div className="race-controls">
            <button
              onClick={startRace}
              disabled={isRaceRunning || !currentRace}
              className="start-button"
            >
              {isRaceRunning ? 'Race in Progress...' : 'Start Race'}
            </button>

            <button
              onClick={resetRace}
              disabled={isRaceRunning}
              className="reset-button"
            >
              New Race
            </button>
          </div>

          {winner && (
            <div className="winner-announcement">
              🏆 Winner: {winner.name}!
            </div>
          )}

          {raceResults.length > 0 && (
            <div className="results-panel">
              <h3>Race Results</h3>
              <div className="results-list">
                {raceResults.map((result) => {
                  const horse = horses.find(h => h.id === result.horse_id)
                  return (
                    <div key={result.horse_id} className="result-item">
                      <span className="position">#{result.position}</span>
                      <span className="horse-name">{horse?.name}</span>
                      <span className="time">{result.finish_time.toFixed(2)}s</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <BettingPanel
          horses={horses}
          currentRaceId={currentRace?.id || null}
          isRaceRunning={isRaceRunning}
          onBetPlaced={() => {}}
        />
      </div>
    </div>
  )
}

export default App
