-- ==========================================
-- SQL MIGRATION — Landing Page Tables
-- Run in Supabase SQL Editor
-- Date: 2026-02-28
-- Order: deploy code changes FIRST, then run this
-- ==========================================


-- ==========================================
-- 1. WAITLIST — is_early_bird → colonne générée
-- La position est assignée par trigger (set_waitlist_position).
-- is_early_bird doit toujours être = position <= 500.
-- On la convertit en colonne GENERATED pour garantir la cohérence
-- et supprimer le risque de race condition côté code.
-- Safe: 0 lignes dans la table actuellement.
-- ==========================================

ALTER TABLE waitlist DROP COLUMN is_early_bird;

ALTER TABLE waitlist
  ADD COLUMN is_early_bird BOOLEAN
  GENERATED ALWAYS AS (position IS NOT NULL AND position <= 500) STORED;

COMMENT ON COLUMN waitlist.is_early_bird IS
  'Calculé automatiquement: true si position <= 500. Ne jamais écrire manuellement.';


-- ==========================================
-- 2. WAITLIST — Supprimer position du INSERT côté code
-- Le trigger set_waitlist_position() assigne la position avant INSERT.
-- Le code ne doit plus envoyer position ni is_early_bird.
-- (Rappel: déployer le code avant ce SQL)
-- ==========================================

-- Rien à exécuter ici — c'est un changement de code uniquement.
-- Voir bluestift-db.js → joinWaitlist()


-- ==========================================
-- 3. CONTRIBUTIONS — Simplification
-- Suppression de contribution_files (table inutile).
-- Storage suffit pour les fichiers.
-- On ajoute storage_path + file_count à contributions.
-- Safe: contribution_files a 0 lignes.
-- ==========================================

-- Ajouter les colonnes manquantes
ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_count   INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN contributions.storage_path IS
  'Préfixe dans le bucket Contributions: "{contribution_id}/". '
  'Lister les fichiers via Storage API: list(storage_path)';

COMMENT ON COLUMN contributions.file_count IS
  'Nombre de fichiers uploadés dans le bucket pour cette contribution.';

-- Supprimer la table contribution_files (0 lignes, safe)
DROP TABLE IF EXISTS contribution_files;


-- ==========================================
-- VERIFY
-- ==========================================

-- 1. Vérifier que is_early_bird est bien generated:
-- SELECT column_name, generation_expression
-- FROM information_schema.columns
-- WHERE table_name = 'waitlist' AND column_name = 'is_early_bird';

-- 2. Vérifier les nouvelles colonnes de contributions:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'contributions'
-- ORDER BY ordinal_position;

-- 3. Vérifier que contribution_files n'existe plus:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_name = 'contribution_files';
