-- Billing preparation for Paddle integration (no payments wired yet).
-- These fields are nullable stubs; they will be populated by Paddle webhooks
-- once payment is live.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS paddle_customer_id text;

COMMENT ON COLUMN profiles.paddle_customer_id IS
  'Paddle customer ID, set on first successful payment. Null until billing is live.';

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS paddle_transaction_id text;

COMMENT ON COLUMN courses.paddle_transaction_id IS
  'Paddle transaction ID for the one-time $4 course upgrade. Null for free or account-premium courses.';
