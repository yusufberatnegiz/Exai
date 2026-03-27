-- Add cancel_at_period_end flag to profiles.
-- Set when a user schedules a cancellation but premium access is still active
-- until the current billing period ends. Cleared on re-subscription or full cancel.
alter table profiles
  add column if not exists cancel_at_period_end boolean not null default false;
