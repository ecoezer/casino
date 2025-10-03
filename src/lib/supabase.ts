import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Horse {
  id: string
  name: string
  color: string
  speed_rating: number
  stamina_rating: number
  created_at: string
}

export interface Race {
  id: string
  race_number: number
  status: 'pending' | 'running' | 'completed'
  winner_id: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export interface Bet {
  id: string
  race_id: string
  horse_id: string
  player_name: string
  amount: number
  odds: number
  payout: number | null
  created_at: string
}

export interface RaceResult {
  id: string
  race_id: string
  horse_id: string
  position: number
  finish_time: number
  created_at: string
}
