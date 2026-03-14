ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS paddle_subscription_id text;

COMMENT ON COLUMN profiles.paddle_subscription_id IS
  'Paddle subscription ID for the monthly premium plan. Null for free users or one-time upgrades.';
