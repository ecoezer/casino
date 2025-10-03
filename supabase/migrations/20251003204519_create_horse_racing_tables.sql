/*
  # Horse Racing Game Database Schema

  1. New Tables
    - `horses`
      - `id` (uuid, primary key)
      - `name` (text) - Horse name
      - `color` (text) - Horse color for 3D rendering
      - `speed_rating` (numeric) - Base speed rating (1-10)
      - `stamina_rating` (numeric) - Stamina rating (1-10)
      - `created_at` (timestamptz)
    
    - `races`
      - `id` (uuid, primary key)
      - `race_number` (integer) - Sequential race number
      - `status` (text) - 'pending', 'running', 'completed'
      - `winner_id` (uuid) - Reference to winning horse
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `bets`
      - `id` (uuid, primary key)
      - `race_id` (uuid) - Reference to race
      - `horse_id` (uuid) - Reference to horse
      - `player_name` (text) - Player identifier
      - `amount` (numeric) - Bet amount
      - `odds` (numeric) - Odds at time of bet
      - `payout` (numeric) - Payout amount (null until race completes)
      - `created_at` (timestamptz)
    
    - `race_results`
      - `id` (uuid, primary key)
      - `race_id` (uuid) - Reference to race
      - `horse_id` (uuid) - Reference to horse
      - `position` (integer) - Finishing position
      - `finish_time` (numeric) - Time to complete race
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for inserting bets
*/

-- Create horses table
CREATE TABLE IF NOT EXISTS horses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  speed_rating numeric NOT NULL CHECK (speed_rating >= 1 AND speed_rating <= 10),
  stamina_rating numeric NOT NULL CHECK (stamina_rating >= 1 AND stamina_rating <= 10),
  created_at timestamptz DEFAULT now()
);

-- Create races table
CREATE TABLE IF NOT EXISTS races (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_number integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed')),
  winner_id uuid REFERENCES horses(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id uuid NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  horse_id uuid NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  odds numeric NOT NULL CHECK (odds > 0),
  payout numeric,
  created_at timestamptz DEFAULT now()
);

-- Create race_results table
CREATE TABLE IF NOT EXISTS race_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id uuid NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  horse_id uuid NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position > 0),
  finish_time numeric NOT NULL CHECK (finish_time > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(race_id, horse_id),
  UNIQUE(race_id, position)
);

-- Enable RLS
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE races ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- Policies for horses (public read)
CREATE POLICY "Anyone can view horses"
  ON horses FOR SELECT
  TO anon
  USING (true);

-- Policies for races (public read)
CREATE POLICY "Anyone can view races"
  ON races FOR SELECT
  TO anon
  USING (true);

-- Policies for bets (public read and insert)
CREATE POLICY "Anyone can view bets"
  ON bets FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can place bets"
  ON bets FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policies for race_results (public read)
CREATE POLICY "Anyone can view race results"
  ON race_results FOR SELECT
  TO anon
  USING (true);

-- Insert initial horses
INSERT INTO horses (name, color, speed_rating, stamina_rating) VALUES
  ('Thunder Strike', '#8B4513', 8.5, 7.8),
  ('Lightning Bolt', '#FFFFFF', 9.2, 6.5),
  ('Midnight Shadow', '#000000', 7.8, 9.0),
  ('Golden Arrow', '#FFD700', 8.8, 8.2),
  ('Silver Wind', '#C0C0C0', 8.0, 8.5),
  ('Crimson Blaze', '#DC143C', 9.0, 7.0)
ON CONFLICT DO NOTHING;
