-- ==========================================
-- BlueStift — DB patch 2026-03-04
-- 1. Fix search_path mutable: set search_path = public on all public functions
-- 2. Fix RLS WITH CHECK (true) on contributions UPDATE
-- ==========================================


-- ==========================================
-- 1. SET search_path = public ON ALL PUBLIC FUNCTIONS
--    Prevents search_path injection attacks
-- ==========================================

DO $$
DECLARE
  func_record record;
BEGIN
  FOR func_record IN
    SELECT p.oid::regprocedure AS func_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prokind IN ('f', 'p')
  LOOP
    BEGIN
      EXECUTE 'ALTER FUNCTION ' || func_record.func_sig || ' SET search_path = public';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not alter function %: %', func_record.func_sig, SQLERRM;
    END;
  END LOOP;
END $$;


-- ==========================================
-- 2. FIX RLS: contributions UPDATE WITH CHECK
--    USING (storage_path IS NULL) mais WITH CHECK (true) trop permissif
--    → forcer que l'update sette bien un storage_path non-null
-- ==========================================

DROP POLICY IF EXISTS public_update_contributions_storage ON public.contributions;

CREATE POLICY public_update_contributions_storage ON public.contributions
  FOR UPDATE
  TO anon, authenticated
  USING (storage_path IS NULL)
  WITH CHECK (storage_path IS NOT NULL);


-- ==========================================
-- NOTE: 3 autres policies "WITH CHECK (true)" sont intentionnelles
--    contributions INSERT : soumissions publiques anonymes
--    feedbacks INSERT     : formulaire public
--    waitlist INSERT      : inscription publique
-- Pas de fix nécessaire — le lint est un faux positif dans ce contexte.
-- ==========================================


-- ==========================================
-- TODO (dashboard Supabase — pas SQL) :
--    Authentication → Security → "Enable leaked password protection" → ON
-- ==========================================
