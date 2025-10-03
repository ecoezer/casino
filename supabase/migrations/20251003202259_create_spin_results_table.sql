/*
  # Create Spin Results Table

  1. New Tables
    - `spin_results`
      - `id` (uuid, primary key) - Unique identifier for each spin
      - `created_at` (timestamptz) - Timestamp when the spin occurred
      - `symbols` (text array) - The three symbols that appeared on the reels
      - `bet_amount` (integer) - The amount wagered on this spin
      - `win_amount` (integer) - The amount won (0 if lost)
      - `is_winner` (boolean) - Whether this spin resulted in a win

  2. Security
    - Enable RLS on `spin_results` table
    - Add policy to allow anyone to insert spin results
    - Add policy to allow anyone to read spin results (for leaderboard/history)

  3. Indexes
    - Add index on `created_at` for efficient sorting of recent spins
    - Add index on `is_winner` for filtering winning spins
*/

CREATE TABLE IF NOT EXISTS spin_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  symbols text[] NOT NULL,
  bet_amount integer NOT NULL DEFAULT 0,
  win_amount integer NOT NULL DEFAULT 0,
  is_winner boolean DEFAULT false
);

ALTER TABLE spin_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert spin results"
  ON spin_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read spin results"
  ON spin_results
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_spin_results_created_at 
  ON spin_results(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_spin_results_is_winner 
  ON spin_results(is_winner);
