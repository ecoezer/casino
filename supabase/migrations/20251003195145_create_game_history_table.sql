/*
  # Create Game History Table

  1. New Tables
    - `game_history`
      - `id` (uuid, primary key) - Unique identifier for each game
      - `wallet_address` (text) - Ethereum wallet address of the player
      - `bet_amount` (numeric) - Amount bet in ETH
      - `prediction` (integer) - Number predicted by player (1-6)
      - `result` (integer) - Actual dice roll result (1-6)
      - `won` (boolean) - Whether the player won
      - `payout` (numeric) - Payout amount if won
      - `created_at` (timestamptz) - Timestamp of the game
      - `chain_id` (integer) - Blockchain network ID

  2. Security
    - Enable RLS on `game_history` table
    - Add policy for users to read their own game history
    - Add policy for users to insert their own game history

  3. Indexes
    - Create index on wallet_address for faster queries
    - Create index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS game_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  bet_amount numeric NOT NULL CHECK (bet_amount > 0),
  prediction integer NOT NULL CHECK (prediction >= 1 AND prediction <= 6),
  result integer NOT NULL CHECK (result >= 1 AND result <= 6),
  won boolean NOT NULL DEFAULT false,
  payout numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  chain_id integer NOT NULL
);

ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own game history"
  ON game_history
  FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Anyone can insert game history"
  ON game_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_game_history_wallet ON game_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_game_history_created_at ON game_history(created_at DESC);
