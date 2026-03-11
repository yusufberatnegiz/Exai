-- Add is_premium flag to courses table.
-- When true, this course bypasses free-plan limits:
--   - question generation count limit
--   - OCR / image upload limit
--   - material file size limit
--
-- Default false so all existing courses stay on the free plan.
-- Payments are NOT wired up yet — this column is the architecture hook
-- that the future billing integration will toggle.

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN courses.is_premium IS
  'When true, free-plan limits are bypassed for this course. '
  'Set by the billing system when a paid upgrade is active.';
