-- ==========================================
-- BlueStift — DB patch
-- 1. Fix set_waitlist_position: COUNT+1 instead of MAX+1 (no gaps on delete)
-- 2. Drop duplicate trigger set_waitlist_position_trigger
-- 3. Fix handle_email_confirmed: ON CONFLICT DO NOTHING (preserve school_admin rows)
-- 4. Add missing feedback_type enum values (suggestion, bug, appreciation, feature)
-- 5. Fix contributions RLS: allow anonymous INSERT, SELECT, UPDATE + storage bucket
-- 6. Fix register_school_complete: subscriptions INSERT had both school_id AND user_id set
--    → violates subscriptions_check (mutual exclusivity: one or the other, never both)
-- ==========================================


-- ── 1. Fix set_waitlist_position ──────────────────────────────────────────
-- Was: MAX(position) + 1 → gaps when test entries are deleted
-- Fix: COUNT(*) + 1 → always sequential based on actual row count

CREATE OR REPLACE FUNCTION public.set_waitlist_position()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT COUNT(*) + 1 INTO NEW.position FROM waitlist;
  RETURN NEW;
END;
$$;


-- ── 2. Drop duplicate trigger ──────────────────────────────────────────────
-- Both set_waitlist_position_trigger and trigger_waitlist_position run the
-- same function — each INSERT would assign position twice, second overwriting
-- the first. Keep only trigger_waitlist_position.

DROP TRIGGER IF EXISTS set_waitlist_position_trigger ON public.waitlist;


-- ── 3. Fix handle_email_confirmed ─────────────────────────────────────────
-- register_school_complete (SECURITY DEFINER) may have already inserted a
-- school_admin row before email confirmation fires.
-- DO NOTHING preserves the school_admin role.

CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Link waitlist entry to this auth user (if they signed up via waitlist)
  UPDATE waitlist
  SET auth_user_id = NEW.id
  WHERE email = NEW.email
    AND auth_user_id IS NULL;

  -- Create users row only if one doesn't exist yet.
  INSERT INTO users (auth_user_id, email, role, account_type)
  VALUES (NEW.id, NEW.email, 'student', 'free')
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
END;
$$;


-- ── 4. Add missing enum values ─────────────────────────────────────────────
-- feedback_type enum is missing all four values the form sends.
-- IF NOT EXISTS is safe to run multiple times.

ALTER TYPE public.feedback_type ADD VALUE IF NOT EXISTS 'suggestion';
ALTER TYPE public.feedback_type ADD VALUE IF NOT EXISTS 'bug';
ALTER TYPE public.feedback_type ADD VALUE IF NOT EXISTS 'appreciation';
ALTER TYPE public.feedback_type ADD VALUE IF NOT EXISTS 'feature';


-- ── 5. Fix contributions RLS ────────────────────────────────────────────────
-- The contribute form is public (no login required).
-- Flow: INSERT row → upload files to storage → UPDATE row with storage_path.
-- All three steps need anon permissions.

-- 5a. Table policies -----------------------------------------------------------

DROP POLICY IF EXISTS "public_insert_contributions"        ON public.contributions;
DROP POLICY IF EXISTS "public_select_contributions"        ON public.contributions;
DROP POLICY IF EXISTS "public_update_contributions_storage" ON public.contributions;

-- Anyone can submit a contribution
CREATE POLICY "public_insert_contributions" ON public.contributions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- SELECT is required so INSERT...RETURNING can hand back the new id
CREATE POLICY "public_select_contributions" ON public.contributions
  FOR SELECT TO anon, authenticated
  USING (true);

-- UPDATE is required to set storage_path + file_count after upload.
-- Lock it down to rows not yet finalised (storage_path IS NULL).
CREATE POLICY "public_update_contributions_storage" ON public.contributions
  FOR UPDATE TO anon, authenticated
  USING (storage_path IS NULL)
  WITH CHECK (true);

-- 5b. Storage bucket policies --------------------------------------------------
-- Bucket: "Contributions"  (case-sensitive, matches bluestift-db.js)

DROP POLICY IF EXISTS "public_upload_contributions_bucket"  ON storage.objects;
DROP POLICY IF EXISTS "admin_select_contributions_bucket"   ON storage.objects;

-- Anyone can upload files into the Contributions bucket
CREATE POLICY "public_upload_contributions_bucket" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'Contributions');

-- Only authenticated users (admins/reviewers) can download / list files
CREATE POLICY "admin_select_contributions_bucket" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'Contributions');


-- ── 6. Fix register_school_complete ─────────────────────────────────────────
-- Bug: step 5 inserted subscription avec BOTH school_id AND user_id set.
-- La contrainte subscriptions_check impose l'exclusivité mutuelle :
--   user_id = abonnement B2C individuel (étudiant)
--   school_id = abonnement B2B institution (école)
-- Fix: school_id uniquement. Pour tracer qui a créé l'abonnement → colonne created_by.

-- 6a. Ajouter created_by sur subscriptions (nullable, FK vers users.id) ---------
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.register_school_complete(
  p_school_name   text,
  p_country       text,
  p_country_code  text,
  p_city          text,
  p_admin_name    text,
  p_admin_email   text,
  p_auth_user_id  uuid,
  p_classes       jsonb DEFAULT '[]'::jsonb,
  p_plan_id       text  DEFAULT 'b2b_standard'::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id     UUID;
  v_admin_key     TEXT;
  v_year_id       UUID;
  v_year_end_date DATE;
  v_class_id      UUID;
  v_class         JSONB;
  v_promo_code    TEXT;
  v_year_label    TEXT;
  v_start_date    DATE;
  v_end_date      DATE;
  v_size          INT;
  v_promo_codes   JSONB := '[]'::JSONB;
  v_auth_user_id  UUID := p_auth_user_id;
  v_admin_id      UUID;
  v_tier          subscription_tier;
BEGIN

  -- 0. Resolve auth user
  IF v_auth_user_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = v_auth_user_id
  ) THEN
    SELECT id INTO v_auth_user_id FROM auth.users
    WHERE email = p_admin_email LIMIT 1;
  END IF;

  IF v_auth_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error',
      'Auth user not found for ' || p_admin_email || '. Complete email confirmation first.');
  END IF;

  -- Resolve plan → subscription_tier
  v_tier := CASE p_plan_id
    WHEN 'b2b_pro'    THEN 'pro'
    WHEN 'b2b_custom' THEN 'custom'
    ELSE 'standard'
  END::subscription_tier;

  -- 1. Create school
  v_admin_key := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));

  INSERT INTO schools (
    name, country_name, country_code, city, admin_key,
    subscription_tier, pilot_until, subscription_expires_at
  ) VALUES (
    p_school_name, p_country, p_country_code, p_city, v_admin_key,
    v_tier,
    CURRENT_DATE + INTERVAL '30 days',
    NOW()         + INTERVAL '30 days'
  )
  RETURNING id INTO v_school_id;

  -- 2. Find or create current school year
  SELECT id, end_date INTO v_year_id, v_year_end_date
  FROM school_years WHERE is_current = true LIMIT 1;

  IF v_year_id IS NULL THEN
    v_year_label := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-'
                 || (EXTRACT(YEAR FROM CURRENT_DATE) + 1)::TEXT;
    v_start_date := DATE_TRUNC('year', CURRENT_DATE)::DATE;
    v_end_date   := (DATE_TRUNC('year', CURRENT_DATE + INTERVAL '1 year')
                      - INTERVAL '1 day')::DATE;
    v_year_end_date := v_end_date;

    INSERT INTO school_years (label, start_date, end_date, is_current)
    VALUES (v_year_label, v_start_date, v_end_date, true)
    RETURNING id INTO v_year_id;
  END IF;

  UPDATE schools SET current_school_year_id = v_year_id WHERE id = v_school_id;

  -- 3. Create classes + class_years (trigger auto-creates promo_codes)
  FOR v_class IN SELECT * FROM jsonb_array_elements(p_classes) LOOP
    v_size       := COALESCE((v_class->>'size')::INT, 30);
    v_promo_code := generate_promo_code();

    INSERT INTO classes (school_id, name, expected_size)
    VALUES (v_school_id, v_class->>'name', v_size)
    RETURNING id INTO v_class_id;

    INSERT INTO class_years (
      class_id, school_id, school_year_id,
      promo_code, initial_size, expected_size, is_active
    ) VALUES (
      v_class_id, v_school_id, v_year_id,
      v_promo_code, v_size, v_size, true
    );

    v_promo_codes := v_promo_codes || jsonb_build_object(
      'class_name', v_class->>'name',
      'code',       v_promo_code
    );
  END LOOP;

  -- 4. Create/update admin user
  DELETE FROM users
  WHERE email = p_admin_email
    AND auth_user_id IS DISTINCT FROM v_auth_user_id;

  INSERT INTO users (auth_user_id, email, full_name, role, school_id, account_type)
  VALUES (v_auth_user_id, p_admin_email, p_admin_name, 'school_admin', v_school_id, 'standard')
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email        = EXCLUDED.email,
    full_name    = EXCLUDED.full_name,
    role         = EXCLUDED.role,
    school_id    = EXCLUDED.school_id,
    account_type = EXCLUDED.account_type
  RETURNING id INTO v_admin_id;

  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM users WHERE auth_user_id = v_auth_user_id;
  END IF;

  -- 5. Create trial subscription — school_id only, user_id doit rester NULL.
  --    created_by = admin qui a créé l'abonnement (audit trail, multi-admin safe).
  INSERT INTO subscriptions (
    school_id, plan_id, status,
    start_date, end_date, auto_renew, created_by
  ) VALUES (
    v_school_id, p_plan_id, 'trial',
    NOW(), NOW() + INTERVAL '30 days', false, v_admin_id
  );

  RETURN jsonb_build_object(
    'success',     true,
    'school_id',   v_school_id,
    'year_id',     v_year_id,
    'admin_key',   v_admin_key,
    'promo_codes', v_promo_codes,
    'plan_id',     p_plan_id,
    'pilot_until', (CURRENT_DATE + INTERVAL '30 days')::TEXT
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
