/*
  # Add write policies for races and race_results

  1. Changes
    - Add INSERT policy for races table (anyone can create races)
    - Add UPDATE policy for races table (anyone can update races)
    - Add INSERT policy for race_results table (anyone can add results)
    - Add UPDATE policy for bets table (anyone can update payouts)

  2. Security
    - These policies allow the racing game to function without authentication
    - In production, these should be restricted to authenticated users or service role
*/

-- Allow anyone to insert races
CREATE POLICY "Anyone can create races"
  ON races FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to update races
CREATE POLICY "Anyone can update races"
  ON races FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anyone to insert race results
CREATE POLICY "Anyone can add race results"
  ON race_results FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to update bets (for payouts)
CREATE POLICY "Anyone can update bets"
  ON bets FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);