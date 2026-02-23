# BlueStift — Architecture Logique
> Document de référence. Toute modification DB ou feature doit partir de ce fichier.
> Dernière mise à jour : 2026-02-22

---

## 1. Raison d'être (First Principles)

```
Élève utilise Raya AI (projet séparé)
        ↓
Conversation fermée → Edge Function analyze-session (repo Raya)
        ↓
Insight anonyme stocké dans Supabase (class_year_id, school_id — jamais user_id)
        ↓
Directeur/admin ouvre BlueStift Schools Dashboard
        ↓
Voit les stats agrégées par classe → prend de meilleures décisions pédagogiques
        ↓
École paie l'abonnement mensuel (Standard / Pro / Custom)
```

**Ce repo (BlueStift Website) ne fait que :**
- Page de landing (acquisition d'écoles)
- Dashboard admin (lecture des insights + gestion abonnement)

**Ce repo ne fait PAS :**
- Générer des insights (→ repo Raya)
- Interface élève (→ repo Raya)
- IA / Edge Functions (→ repo Raya)

---

## 2. Structure des fichiers

```
BlueStift Website/
│
├── index.html              Landing page marketing
├── schools.html            Dashboard admin (app principale)
├── waiting.html            Page confirmation waitlist
│
├── script.js               Logique landing page (carousels, animations, waitlist)
├── schools.js              Logique dashboard (1846 lignes)
├── schools-db.js           Couche data dual-mode (demo ↔ live Supabase)
├── schools-utils.js        Utilitaires (notifications, sons, push, i18n)
├── bluestift-db.js         Couche data landing page (waitlist, feedbacks)
│
├── schools/sections/
│   ├── index.js            Registre/loader des sections dynamiques
│   ├── contact.js          Section Aide & Support
│   ├── export.js           Section Export de données
│   ├── settings.js         Section Paramètres
│   └── subscription.js     Section Abonnement & Facturation
│
├── schools-data.json       Données mock (mode demo)
├── config.js               Supabase URL + anon key (gitignored)
│
├── api/
│   ├── send-contact-email.js   Netlify Function → Resend API
│   └── send-push.js            Netlify Function → Web Push (tous les abonnés)
│
├── sw.js                   Service Worker (Web Push)
│
└── css/
    ├── main.css            Point d'entrée CSS global
    ├── schools/            CSS dashboard (22 fichiers partiels)
    └── ...                 CSS landing page
```

---

## 3. Système dual-mode

`schools-db.js` opère en deux modes transparents pour le reste du code :

| Critère | Mode Demo | Mode Live |
|---------|-----------|-----------|
| Activation | `?demo=true` dans URL | Supabase disponible |
| Données | `schools-data.json` | Supabase DB |
| Auth | `admin@test.com` / `Test1234!` (hardcodé) | Supabase Auth |
| Écriture | Simulée (timeout) | Réelle |
| Fallback | Si Supabase timeout > 5s → demo auto | — |

**localStorage keys utilisées :**
- `schools_authenticated` — session active
- `schools_auth_email` — email mémorisé
- `schools_mode` — 'demo' ou 'live'
- `bs_pending_${email}` — données signup en attente (step 1 → step 2)
- `selectedLanguage` — langue choisie
- `sound_enabled` — sons activés
- `push_enabled` — push activé
- `settings_notifications` — préférences email
- `bluestift_export_history` — historique exports CSV (max 10)

---

## 4. Flux d'authentification

### Login
```
Overlay login affiché (toujours à l'ouverture)
    ↓
handleLoginSubmit()
    ↓
SchoolsDB.login(email, password)
    ├── Demo : vérifie hardcode credentials → OK
    └── Live : supabase.auth.signInWithPassword()
              ↓
              _loadLiveUserData() → SELECT users JOIN schools
              ↓
              _checkPilotExpiry() → pilot_until < today ?
              ├── Oui : signOut + mode demo + pilotExpired: true
              └── Non : OK → bootDashboard()
```

### Signup (2 étapes)
```
ÉTAPE 1 (signup-step1)
  schoolName, country, countryCode, city, adminName, email, password
    ↓
  SchoolsDB.signup()
    ↓
  supabase.auth.signUp() → crée auth.users
  Stocke dans localStorage bs_pending_${email}
  → Avance à signup-step2

ÉTAPE 2 (signup-step2)
  Classes (name + size) + Plan choisi (b2b_standard/b2b_pro/b2b_custom)
    ↓
  SchoolsDB.completeSetup({ email, classes, planId })
    ↓
  Récupère session courante (pour éviter UUID périmé)
    ↓
  RPC register_school_complete() → SECURITY DEFINER
    ├── Crée schools (avec subscription_tier + pilot_until 30j)
    ├── Crée classes + class_years (avec promo_code unique)
    ├── Crée/met à jour users (school_admin)
    └── Crée subscriptions (status: trial, 30j)
    ↓
  Retourne { adminKey, promoCodes, schoolId }
    ↓
  Affiche signup-success (codes à partager avec les élèves)
```

### Pilot expiry
```
login() → _checkPilotExpiry()
  Si pilot_until < aujourd'hui :
    → signOut Supabase
    → mode = 'demo'
    → return { pilotExpired: true, pilotUntil }

  Dans handleLoginSubmit() :
    → showPilotExpiredMessage(pilotUntil)
    → Bloque l'accès au dashboard
    → Message "contacter le support"
```

---

## 5. Dashboard — Sections et données nécessaires

### Section : Dashboard (défaut)
**Ce qu'elle affiche :**
- 6 stat cards : students, PKM moyen, temps/semaine, taux complétion, streak, leçons
- Tableau des matières : nom, PKM, difficulté principale, effort, bouton détails
- Drawer insights : PKM circulaire, graphiques, simulations, recommandations

**Données lues depuis DB :**
- `school_global_overview` VIEW → stats école entière
- `school_subject_overview` VIEW → matières (par classe ou école)
- `class_years` → student_count par classe

**Filtre classe :**
```
searchClass(query) → classes JOIN class_years WHERE is_current=true
→ setCurrentClassYearId
→ getClassStats(classYearId)
→ getSubjects(classYearId) → school_subject_overview WHERE class_year_id=X
```

### Section : Subscription
**Ce qu'elle affiche :**
- Plan actuel (depuis schools.subscription_tier)
- Prix zone-aware (T1→T6 selon GDP pays)
- 3 plans : Standard / Pro / Custom
- Historique factures (mock pour l'instant)
- Toggle mensuel/annuel

**Données lues depuis DB :**
- `school_plan_pricing` VIEW → prix selon zone géographique
- Fallback : `subscription_plans` si view échoue

### Section : Settings
**Formulaire profil écrit dans DB :**
- `schools` : name, email, phone, city, school_type

**Autres settings (localStorage uniquement) :**
- Langue, sons, push, email preferences, apparence

**Sécurité :**
- `supabase.auth.updateUser({ password })` pour changement MDP

### Section : Export
**Données lues :**
- `getGlobalStats()` → school_global_overview
- `getClasses()` → class_years
- `getSubjects()` → school_subject_overview

**Sortie : CSV uniquement** (PDF "coming soon")

### Section : Contact / Support
**Écrit dans DB :**
- `contact_messages` (name, email, phone, subject, message, source: 'schools_dashboard', school_id)

**Déclenche :**
- POST `/api/send-contact-email` → Resend API (email Resend)
- POST `/api/send-push` → Web Push (tous les admins abonnés)

### Section : Contribute
**Écrit dans DB :**
- `contributions` (contributor_name, email, category, title, description, school_id)
- `contribution_files` (contribution_id, file_name, file_url, mime_type, file_size)

**Stockage fichiers :**
- Supabase Storage bucket `contributions` → path `${contribution_id}/${filename}`

### Section : Raya
- Simple redirect vers `raya.thebluestift.com`
- Affiche `rayaMessagesLeft` (hardcodé à 50 pour l'instant)

---

## 6. Système de notifications

### A — In-app toasts (SchoolsUtils.showSchoolNotification)
```
showSchoolNotification(message, type, duration=5000)
  ↓
  Crée div.school-notification.{type}
  Max 4 stacked (supprime le plus ancien)
  Auto-dismiss après duration ms
  Son via SchoolsAudio.play(type)

Types : success | error | warning | info
Sons  : Web Audio API (sine waves, pas de fichiers audio externes)
```

### B — Web Push (SchoolsPush + sw.js + api/send-push.js)
```
Activation :
  SchoolsPush.enable()
    ↓
    Demande permission Notification
    ↓
    Subscribe via PushManager (VAPID)
    ↓
    SchoolsDB.savePushSubscription() → upsert push_subscriptions

Déclenchement :
  /api/send-contact-email.js
    → fire-and-forget POST /api/send-push
       ↓
       Lit push_subscriptions depuis Supabase (via service key)
       ↓
       web-push.sendNotification() pour chaque endpoint
       ↓
       Supprime endpoints expirés (410/404)

Réception (sw.js) :
  push event → showNotification()
  notificationclick → ouvre/focus schools.html
```

**Variables d'environnement requises (Netlify) :**
- `RESEND_API_KEY` — emails Resend
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — Web Push
- `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` — lecture push_subscriptions

### C — Alerte Pilot Expiry
- Vérifiée à chaque login
- Bloque l'accès au dashboard
- Message avec date d'expiration + lien support

---

## 7. Tables Supabase — Ce que le code utilise réellement

### Bloc A : Landing page (bluestift-db.js + script.js)

| Table | Opérations | Colonnes utilisées |
|-------|-----------|-------------------|
| `waitlist` | INSERT, SELECT (count) | full_name, email, phone, position, is_early_bird, joined_at |
| `feedbacks` | INSERT | name, email, rating, type, message, submitted_at |
| `contributions` | INSERT | contributor_name, email, category, title, description |
| `contribution_files` | INSERT | contribution_id, file_name, file_path, file_url, mime_type, file_size |
| `contact_messages` | INSERT | name, email, phone, subject, message, source |

### Bloc B : Dashboard admin (schools-db.js)

| Table/View | Opérations | Colonnes utilisées |
|-----------|-----------|-------------------|
| `users` | SELECT, INSERT (via RPC) | auth_user_id, email, full_name, role, school_id, account_type |
| `schools` | SELECT, UPDATE | id, name, country, country_code, city, admin_key, subscription_tier, subscription_expires_at, pilot_until, school_type, email, phone |
| `school_years` | SELECT | id, label, start_date, end_date, is_current |
| `classes` | SELECT (via RPC + search) | id, school_id, name, expected_size |
| `class_years` | SELECT | id, class_id, school_id, school_year_id, promo_code, student_count, expected_size, is_active |
| `contributions` | INSERT | contributor_name, email, category, title, description, school_id |
| `contribution_files` | INSERT | contribution_id, file_name, file_path, file_url, mime_type, file_size |
| `contact_messages` | INSERT | name, email, phone, subject, message, source, school_id |
| `push_subscriptions` | UPSERT | endpoint, keys, user_id, updated_at |
| `subscription_plans` | SELECT | id, name, price, features, tier, is_active, category |
| `subscriptions` | INSERT (via RPC) | school_id, user_id, plan_id, status, start_date, end_date |

### Bloc C : Vues requises (calculées depuis insights)

| Vue | Agrège | Utilisée par |
|----|--------|-------------|
| `school_global_overview` | PKM moyen, nb élèves, streak, completion PAR school_id | getGlobalStats() |
| `school_subject_overview` | PKM/difficulté/effort PAR matière PAR class_year_id | getSubjects() |
| `school_plan_pricing` | Prix zone-aware PAR school_id | getPlans() |
| `valid_insights` | insights avec sample_size >= 5 | Source de school_global/subject_overview |

---

## 8. Tables Supabase — Colonnes exactes requises

### `schools`
```sql
id                    UUID PRIMARY KEY
name                  TEXT NOT NULL
country               TEXT
country_code          TEXT          -- pour zone pricing
city                  TEXT
school_type           TEXT          -- 'primary','secondary','high','mixed'
email                 TEXT
phone                 TEXT
admin_key             TEXT UNIQUE   -- généré à l'inscription
subscription_tier     ENUM(none, standard, pro, custom)
subscription_expires_at TIMESTAMPTZ
pilot_until           DATE          -- accès trial 30j
created_at            TIMESTAMPTZ
updated_at            TIMESTAMPTZ
```

### `users`
```sql
id                    UUID PRIMARY KEY
auth_user_id          UUID UNIQUE   → auth.users.id
email                 TEXT UNIQUE
full_name             TEXT
role                  ENUM(student, school_admin, god)
account_type          ENUM(free, pro, plus, standard)
school_id             UUID          → schools.id
class_year_id         UUID NULLABLE → class_years.id (pour élèves)
-- Stats élèves (Raya) :
total_lessons_completed INTEGER
current_streak_days   INTEGER
longest_streak_days   INTEGER
last_activity_at      TIMESTAMPTZ
created_at            TIMESTAMPTZ
updated_at            TIMESTAMPTZ
```

### `school_years`
```sql
id           UUID PRIMARY KEY
label        TEXT UNIQUE       -- '2025-2026'
start_date   DATE
end_date     DATE
is_current   BOOLEAN           -- max 1 row true (unique index)
created_at   TIMESTAMPTZ
```

### `classes`
```sql
id             UUID PRIMARY KEY
school_id      UUID → schools.id (CASCADE)
name           TEXT
expected_size  INTEGER
created_at     TIMESTAMPTZ
updated_at     TIMESTAMPTZ
UNIQUE(school_id, name)
```

### `class_years`
```sql
id              UUID PRIMARY KEY
class_id        UUID → classes.id (CASCADE)
school_year_id  UUID → school_years.id (CASCADE)
school_id       UUID → schools.id   -- dénormalisé pour RLS
promo_code      TEXT UNIQUE
student_count   INTEGER DEFAULT 0
initial_size    INTEGER
expected_size   INTEGER
max_overflow    INTEGER DEFAULT 5
is_full         BOOLEAN           -- calculé par trigger
adjustments_count INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
UNIQUE(class_id, school_year_id)
```

### `insights`
```sql
id                  UUID PRIMARY KEY
class_year_id       UUID → class_years.id  -- jamais user_id (privacy)
school_id           UUID → schools.id      -- dénormalisé pour RLS
subject             TEXT
chapter             TEXT
difficulty_level    TEXT
mastery_score       NUMERIC(4,2)           -- 0.00 à 1.00
critical_gap        TEXT
concepts_acquired   TEXT[]
recommended_action  TEXT
student_effort_level TEXT
sample_size         INTEGER                -- min 5 pour affichage
period              TEXT                   -- '2025-12'
created_at          TIMESTAMPTZ
```

### `subscriptions`
```sql
id              UUID PRIMARY KEY
school_id       UUID NULLABLE → schools.id
user_id         UUID NULLABLE → users.id
plan_id         TEXT → subscription_plans.id
status          ENUM(active, cancelled, expired, trial)
start_date      TIMESTAMPTZ
end_date        TIMESTAMPTZ
auto_renew      BOOLEAN DEFAULT false
payment_method  TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
CHECK(school_id IS NOT NULL OR user_id IS NOT NULL)
```

### `push_subscriptions`
```sql
id          UUID PRIMARY KEY
user_id     UUID NULLABLE → users.id
endpoint    TEXT UNIQUE
keys        JSONB     -- { p256dh, auth }
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### `contact_messages`
```sql
id         UUID PRIMARY KEY
school_id  UUID NULLABLE → schools.id
name       TEXT
email      TEXT
phone      TEXT
subject    TEXT
message    TEXT
source     ENUM(form, email, whatsapp) + 'schools_dashboard'  -- À ÉTENDRE
is_read    BOOLEAN DEFAULT false
replied    BOOLEAN DEFAULT false
created_at TIMESTAMPTZ
```

### `contributions` (usage double — landing + B2B)
```sql
id                UUID PRIMARY KEY
school_id         UUID NULLABLE → schools.id  -- NULL = public
contributor_name  TEXT
email             TEXT
category          TEXT
title             TEXT
description       TEXT
file_count        INTEGER DEFAULT 0
status            ENUM(pending, approved, rejected)
submitted_at      TIMESTAMPTZ
```

---

## 8b. Facturation par élève — deux mécanismes distincts

### Mécanisme 1 — Seuil abonnement (1 000 élèves inclus)
```
schools.actual_enrolled_count > 1 000
    ↓
Facturation : extra_student_price × (total - 1000) / mois
    Standard : 1,05 USD / élève supplémentaire
    Pro       : 1,61 USD / élève supplémentaire
    Custom    : négocié (extra_student_price = NULL)
```
- `extra_student_price` stocké dans `subscription_plans` ou `plan_zone_prices`
- `school_plan_pricing` VIEW l'expose déjà : `ROUND(price / 1000 * 0.70, 2)`
- `schools.actual_enrolled_count` est le compteur déclencheur
- Nécessite `usage_metrics` pour tracker mensuellement

### Mécanisme 2 — Ajustements de capacité classe (en cours d'année)
```
Admin augmente capacité d'une classe → class_adjustments
    1er ajustement trim. ≤ 5 élèves     → GRATUIT
    1er ajustement trim. > 5 élèves     → 2€ × (diff-5) × mois_restants
    2ème+ ajustement trimestriel         → 2€ × diff × mois_restants
```
- Stocké dans `class_adjustments` (déjà en place)
- Fonctions : `request_capacity_adjustment()` + `confirm_adjustment_payment()`
- Champs clés : `adjustment_type` (free/paid), `amount_charged`, `payment_status`, `quarter`

---

## 9. Vues à vérifier/créer

### `school_global_overview`
Devrait agréger par `school_id` depuis `insights` + `class_years` :
```sql
-- Colonnes attendues par getGlobalStats() :
school_id, students (count), pkm (avg mastery_score),
avg_time (mock pour l'instant), completion (mock),
avg_streak (mock), lessons_completed (mock)
```
⚠️ PKM, streak, avgTime en temps réel requièrent des données from Raya.
Pour l'instant : PKM depuis insights, reste peut rester mock.

### `school_subject_overview`
Agrège par `school_id` + `class_year_id` + `subject` depuis `insights` :
```sql
-- Colonnes attendues par getSubjects() :
school_id, class_year_id, subject_name,
avg_mastery_score (→ pkm),
difficulty_level,
student_effort_level,
critical_gap[] (agrégé),
concepts_acquired[] (agrégé),
recommended_action[] (agrégé)
```

### `school_plan_pricing`
Déjà créée dans 13_fixes.sql. Joint :
`schools → zone_countries → pricing_zones → plan_zone_prices`

---

## 10. RPCs (Fonctions SECURITY DEFINER)

### `register_school_complete(...)` — DÉJÀ EN PLACE
Crée en une transaction : school + classes + class_years + users + subscription (trial 30j)
Dernier état : sql/14_subscription_signup.sql

### `get_my_school_id()` — DÉJÀ EN PLACE
Helper RLS : retourne school_id de l'utilisateur courant sans récursion

---

## 11. Ce qui manque ou est incohérent

### ❌ Colonne `profile_type` manquante dans `waitlist`
`index.html` collecte un champ "Profile Type" (student / parent / teacher / professional...)
mais `bluestift-db.js` ne l'insère pas dans la table.
→ Ajouter `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS profile_type TEXT`
→ Mettre à jour `bluestift-db.js` pour inclure ce champ dans le INSERT

### ❌ Incohérence nom de bucket Supabase Storage
- Landing page (`bluestift-db.js`) → bucket `Contribute` (majuscule C)
- Schools dashboard (`schools-db.js`) → bucket `contributions` (minuscule)
→ Supabase est case-sensitive. Vérifier le nom réel du bucket et harmoniser les deux

### ❌ Source enum `contact_source` incomplète
`contact_messages.source` est ENUM(form, email, whatsapp)
Mais le code écrit `'schools_dashboard'` → **violation d'enum à corriger**
→ Ajouter `'schools_dashboard'` à l'enum ou changer le champ en TEXT

### ❌ `school_type` probablement absent de `schools`
settings.js écrit school_type mais la table d'origine ne l'a pas
→ Vérifier et `ALTER TABLE schools ADD COLUMN IF NOT EXISTS school_type TEXT`

### ❌ `subscription_tier` enum manque 'custom'
sql/11_subscription_tier_custom.sql l'ajoute — vérifier qu'il est appliqué

### ❌ `account_type` enum manquait 'standard'
sql/13_fixes.sql l'ajoute — vérifier qu'il est appliqué

### ❌ Vues `school_global_overview` + `school_subject_overview` non documentées
Elles existent dans Supabase (créées dans sql/06_missing_views.sql)
Mais le SQL n'est plus dans le repo → les documenter ici une fois vérifiées

### ⚠️ `rayaMessagesLeft` hardcodé à 50
Pas de table de comptage de messages dans ce repo
→ Requiert une colonne ou vue du côté Raya

### ⚠️ Historique factures entièrement mock
`subscription.js` génère 3 factures fictives
→ Requiert table `invoices` ou données réelles dans `subscriptions`

### ⚠️ `school_years` est global (toutes les écoles partagent)
Problème pour les écoles de fuseaux horaires différents
→ Acceptable pour MVP si cible est une seule région
→ À noter pour scale international

---

## 12. RLS — Politique par table (état cible)

| Table | anon | school_admin | service_role |
|-------|------|-------------|-------------|
| `waitlist` | INSERT | — | ALL |
| `feedbacks` | INSERT | — | ALL |
| `contributions` | INSERT (school_id IS NULL) | INSERT (own) + SELECT (own) | ALL |
| `contribution_files` | — | — | ALL |
| `contact_messages` | INSERT (school_id IS NULL) | INSERT (own) | ALL |
| `schools` | — | SELECT + UPDATE (own) | ALL |
| `users` | — | SELECT (own + school) + UPDATE (own) | ALL |
| `school_years` | SELECT | SELECT | ALL |
| `classes` | — | SELECT (own school) | ALL |
| `class_years` | SELECT (active, pour promo code) | SELECT (own school) | ALL |
| `insights` | — | SELECT (own school) via view | ALL |
| `subscriptions` | — | SELECT (own school) | ALL |
| `push_subscriptions` | — | ALL (own user) | ALL |
| `subscription_plans` | SELECT (active) | SELECT | ALL |

---

## 13. Variables d'environnement requises

### Netlify (production)
```
RESEND_API_KEY          Resend → envoi emails contact
VAPID_PUBLIC_KEY        Web Push
VAPID_PRIVATE_KEY       Web Push
SUPABASE_URL            Supabase project URL
SUPABASE_SERVICE_KEY    Service role key (pour send-push.js)
```

### Client (config.js — gitignored)
```javascript
window.SUPABASE_URL = 'https://jkcztwqxvmsrfqiwvyxp.supabase.co'
window.SUPABASE_ANON_KEY = '...'
window.VAPID_PUBLIC_KEY = '...'   // pour SchoolsPush.enable()
```

---

## 14. Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Vanilla HTML/CSS/JS (aucun framework) |
| Charts | Chart.js (CDN) |
| Icons | Font Awesome (CDN) |
| Hébergement | Netlify |
| Serverless | Netlify Functions (api/) |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (bucket: contributions) |
| Emails | Resend API (via Netlify Function) |
| Push | Web Push API + VAPID + service worker |
| AI Student (séparé) | Raya → Gemini 2.0 Flash (repo Raya) |
