-- ==========================================
-- SQL FIXES — BlueStift Supabase
-- Run in Supabase SQL Editor
-- Date: 2026-02-23
-- ==========================================


-- ==========================================
-- 1. WAITLIST — Add profile_type column
-- ==========================================

ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS profile_type TEXT;

COMMENT ON COLUMN waitlist.profile_type IS
  'Profile collected at signup: student / university_student / parent / teacher / self_learner / professional / other';


-- ==========================================
-- 2. CONTACT_MESSAGES — Fix source enum
-- Add ''schools_dashboard'' value so dashboard
-- support messages don''t silently fail
-- ==========================================

ALTER TYPE contact_source ADD VALUE IF NOT EXISTS 'schools_dashboard';


-- ==========================================
-- 3. ORPHANED PRICING ZONES — Cleanup
-- Old named zones have no prices, no country
-- mappings (all countries use T1-T6 now)
-- Safe to delete
-- ==========================================

DELETE FROM pricing_zones
WHERE id IN (
  'central_africa',
  'west_africa',
  'north_africa',
  'east_africa',
  'southern_africa',
  'western_europe',
  'eastern_europe',
  'uk',
  'north_america',
  'latin_america',
  'brazil',
  'middle_east',
  'south_asia',
  'southeast_asia',
  'east_asia',
  'oceania',
  'default'
);


-- ==========================================
-- 4. USAGE_METRICS — Create table
-- Tracks monthly consumption per school:
-- raya_messages, storage_gb, exports
-- ==========================================

CREATE TABLE IF NOT EXISTS usage_metrics (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  period      TEXT        NOT NULL,  -- format: '2026-02'
  metric      TEXT        NOT NULL,  -- 'raya_messages' | 'storage_gb' | 'exports'
  value       NUMERIC     NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id, period, metric)
);

COMMENT ON TABLE usage_metrics IS
  'Monthly consumption tracking per school. period = YYYY-MM. '
  'Metrics: raya_messages (count), storage_gb (decimal), exports (count).';

-- RLS
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "school_admin_select_own_usage"
  ON usage_metrics FOR SELECT
  USING (school_id = get_my_school_id());

-- Only writable by service role (Edge Functions, Netlify Functions)
-- No direct INSERT/UPDATE by school_admin


-- ==========================================
-- VERIFY
-- ==========================================

-- 1. Check waitlist columns:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'waitlist' ORDER BY ordinal_position;

-- 2. Check enum values:
-- SELECT enumlabel FROM pg_enum
-- JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
-- WHERE pg_type.typname = 'contact_source';

-- 3. Check remaining pricing zones:
-- SELECT id, name FROM pricing_zones ORDER BY id;

-- 4. Check usage_metrics exists:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_name = 'usage_metrics';
