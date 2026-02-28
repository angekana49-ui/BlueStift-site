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
-- 5. WAITLIST — RLS INSERT policy for anon
-- Public signup form: anyone can join
-- (SELECT policy assumed already exists)
-- Date: 2026-02-28
-- ==========================================

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_waitlist" ON waitlist;
CREATE POLICY "anon_insert_waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to SELECT (check dup email + count for position)
DROP POLICY IF EXISTS "anon_select_waitlist" ON waitlist;
CREATE POLICY "anon_select_waitlist"
  ON waitlist FOR SELECT
  TO anon
  USING (true);


-- ==========================================
-- 6. CONTRIBUTIONS — RLS INSERT policy for anon
-- Public form: anyone can contribute resources
-- Date: 2026-02-28
-- ==========================================

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contributions" ON contributions;
CREATE POLICY "anon_insert_contributions"
  ON contributions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to select their own contribution (for .select().single() after insert)
DROP POLICY IF EXISTS "anon_select_own_contributions" ON contributions;
CREATE POLICY "anon_select_own_contributions"
  ON contributions FOR SELECT
  TO anon
  USING (true);


-- ==========================================
-- 7. CONTRIBUTION_FILES — RLS INSERT policy for anon
-- Linked to contributions above
-- Date: 2026-02-28
-- ==========================================

ALTER TABLE contribution_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contribution_files" ON contribution_files;
CREATE POLICY "anon_insert_contribution_files"
  ON contribution_files FOR INSERT
  TO anon
  WITH CHECK (true);


-- ==========================================
-- 8. STORAGE — Create 'contributions' bucket + policies
-- Bucket was missing entirely (Bucket not found error)
-- Date: 2026-02-28
-- ==========================================

-- Bucket 'contributions' already exists (created manually)
-- Just add the storage object policies:

-- Allow anon to upload files to the bucket
DROP POLICY IF EXISTS "anon_upload_contributions" ON storage.objects;
CREATE POLICY "anon_upload_contributions"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'contributions');

-- Allow anon to read their uploaded files (needed for getPublicUrl)
DROP POLICY IF EXISTS "anon_read_contributions" ON storage.objects;
CREATE POLICY "anon_read_contributions"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'contributions');


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

-- 5-7. Check all RLS policies:
-- SELECT tablename, policyname, cmd, roles
-- FROM pg_policies
-- WHERE tablename IN ('waitlist', 'contributions', 'contribution_files')
-- ORDER BY tablename, cmd;
