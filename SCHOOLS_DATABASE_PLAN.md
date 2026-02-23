# BlueStift Schools Dashboard - Plan Connexion DB

> Remplacement de toutes les données mock par Supabase (DB existante, 19 tables)
> `supabase-client.js` est OBSOLÈTE et à supprimer.

---

## 1. Inventaire Complet: Chaque Point Mock à Remplacer

### 1.1 `schools.js` - Fichier Principal (738 lignes)

| Ligne(s) | Fonction | Ce qu'elle fait actuellement (MOCK) | Remplacement DB |
|-----------|----------|-------------------------------------|-----------------|
| 11-13 | Variables globales | `currentSchool`, `selectedClassName`, `mockData` | Garder `currentSchool`, `selectedClassName`. Supprimer `mockData`. |
| 19-29 | `loadMockData()` | `fetch('schools-data.json')` | **Supprimer entièrement.** Remplacer par `SchoolsDB.init()` |
| 35-67 | `DOMContentLoaded` | Appelle `loadMockData()` puis `loadSchoolData()` | Ajouter **auth guard** en premier. Si pas connecté → redirect `schools-login.html` |
| 96-108 | `loadSchoolData()` | `mockData.school` → peuple `#school-name`, `#plan-type`, `#expiry-date`, `#raya-messages-left`, `#raya-count`, `#contributions-left` | `SchoolsDB.getSchoolInfo()` → query `schools` + `users` |
| — | **BUG actuel** | `#admin-name` n'est JAMAIS peuplé (reste "Admin") | Ajouter: `#admin-name` ← `users.full_name` |
| 110-122 | `loadGlobalData()` | `mockData.global` → peuple `#stat-students`, `#stat-pkm`, `#stat-time`, `#stat-completion`, `#stat-streak`, `#stat-lessons` + appelle `populateSubjectsTable()` | `SchoolsDB.getGlobalStats()` → vue `school_global_overview` + `SchoolsDB.getSubjectOverview()` |
| 124-141 | `loadClassData()` | `mockData.class` → même pattern mais données de classe | `SchoolsDB.getClassInsights(classYearId)` → query `insights` filtrés par `class_year_id` |
| 143-182 | `populateSubjectsTable()` | Itère sur `subjects[]` array (name, icon, pkm, difficulty, effort) | **Garder la fonction**, juste changer la source de données (DB au lieu de mock) |
| 184-193 | `showSubjectDetails()` | `mockData.global.subjects` ou `mockData.class.subjects` | `SchoolsDB.getClassSubjectDetail(classYearId, subject)` |
| 199-253 | `openInsightsDrawer()` | Peuple le drawer: PKM, difficulties, mastered, recommendations depuis `subject.details` | Même structure, données venant de `insights` table |
| 405-423 | `handleClassSearch()` | Stocke juste `selectedClassName` en string, appelle `loadClassData()` | `SchoolsDB.searchClass(query)` → query `class_years` JOIN `classes` WHERE name ILIKE. Retourne `class_year_id` pour les queries suivantes. |
| 538-573 | `initContributeForm()` | Setup du form (drag&drop, etc.) | **Garder tel quel** (c'est du UI) |
| 575-585 | `prefillContributeForm()` | Utilise `currentSchool.email/phone/adminName` | Utiliser données de `SchoolsDB.currentAdmin` et `SchoolsDB.currentSchool` |
| 613-657 | `handleContributeSubmit()` | **FAKE** - `setTimeout(2000)`, aucun upload réel | `SchoolsDB.submitContribution(formData, files)` → INSERT `contributions` + upload Storage `Contribute` bucket |
| 693-706 | Event listener menu | `#menu-logout` existe dans le HTML mais **AUCUN handler** | Ajouter: `SchoolsDB.logout()` → redirect `schools-login.html` |
| 728-734 | `window.SchoolsDashboard` | Expose `currentSchool`, `selectedClassName` | Garder, adapter |

### 1.2 `schools.html` (719 lignes)

| Ligne(s) | Élément | Problème | Fix |
|-----------|---------|----------|-----|
| — | `<head>` | **Pas de Supabase SDK** | Ajouter `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` |
| — | `<head>` | **Pas de schools-db.js** | Ajouter `<script src="schools-db.js"></script>` après Supabase SDK |
| 66 | `#school-name` | "Loading..." par défaut | OK (sera remplacé par DB) |
| 75 | `#admin-name` | "Admin" par défaut, **jamais mis à jour** | Fix dans `loadSchoolData()` |
| 83 | `#plan-type` | "Pro" par défaut | Sera remplacé par DB |
| 84 | `#expiry-date` | "--" par défaut | Sera remplacé par DB |
| 113 | `#raya-messages-left` | "50" hardcodé | Sera remplacé par DB |
| 130 | `#contributions-left` | "∞" hardcodé | OK (unlimited) |
| 161-167 | `#menu-logout` | **Aucun handler JS** | Ajouter logout dans `initEventListeners()` |
| 174-177 | `#select-year` | Hardcodé "2025-2026" seulement | `SchoolsDB.getSchoolYears()` → populate dynamiquement depuis `school_years` |
| 326-343 | Section RAYA | Redirect vers `raya.thebluestift.com` | OK (pas de changement, RAYA est externe) |
| 707-717 | Scripts | Charge `schools-utils.js`, sections, `schools.js` | Ajouter Supabase SDK + `schools-db.js` AVANT `schools.js` |

### 1.3 `schools-utils.js` (172 lignes)

| Fonction | État | Action |
|----------|------|--------|
| `generateRayaResponse()` | Match keyword → réponse mock | **Peut être supprimée** (RAYA est maintenant externe à `raya.thebluestift.com`) |
| `initLanguageSelector()` | Fonctionne avec localStorage | **Garder tel quel** (pas lié à la DB) |
| `changeLanguage()` | Google Translate | **Garder tel quel** |
| `showSchoolNotification()` | Notifications toast | **Garder tel quel** |
| `updateCurrentDate()` | Date locale | **Garder tel quel** |
| `formatDate()` | Formatage de date | **Garder tel quel** |

### 1.4 `schools/sections/settings.js` (717 lignes)

| Ligne(s) | Fonction | MOCK actuel | Remplacement DB |
|-----------|----------|-------------|-----------------|
| 33 | `render()` | `window.SchoolsDashboard?.currentSchool` (mock) | Utiliser `SchoolsDB.currentSchool` (données réelles) |
| 34 | Langue | `localStorage.getItem('preferredLang')` | **Garder localStorage** (préférence locale) |
| 35 | Notifications | `localStorage.getItem('settings_notifications')` | **Garder localStorage** pour MVP (ou table `user_preferences` plus tard) |
| 63 | `#settings-school-name` | `school.name` du mock | `SchoolsDB.currentSchool.name` |
| 67 | `#settings-school-code` | `school.schoolCode` (N'EXISTE PAS dans le mock!) | `SchoolsDB.currentSchool.admin_key` ou `school.id` |
| 75 | `#settings-admin-email` | `school.adminEmail` (N'EXISTE PAS dans le mock!) | `SchoolsDB.currentSchool.email` |
| 79 | `#settings-admin-phone` | `school.phone` | `SchoolsDB.currentSchool.phone` |
| 86 | `#settings-school-location` | `school.location` (N'EXISTE PAS) | `SchoolsDB.currentSchool.city` |
| 90-94 | `#settings-school-type` | `school.type` (N'EXISTE PAS) | Pas dans la table `schools` actuelle → **ajouter colonne `school_type`** OU ignorer pour MVP |
| 521-538 | `initProfileForm()` | Sauve dans **localStorage** | `SchoolsDB.updateSchoolProfile({name, email, phone, city})` → UPDATE `schools` |
| 543-559 | `initNotifications()` | Sauve dans **localStorage** | **Garder localStorage** pour MVP |
| 569-609 | `initSecurity()` | Tout "demo mode" / "coming soon" | **Garder tel quel** pour MVP. Change password fonctionnera quand auth est en place via `supabase.auth.updateUser()` |
| 614-672 | `initDataPrivacy()` | Tout "demo mode" | **Garder tel quel** pour MVP |
| 677-711 | `initDangerZone()` | Reset localStorage, "demo mode" | **Garder tel quel** pour MVP |

### 1.5 `schools/sections/contact.js` (539 lignes)

| Ligne(s) | Fonction | MOCK actuel | Remplacement DB |
|-----------|----------|-------------|-----------------|
| 117-156 | Contact cards | WhatsApp/Email/Phone hardcodés | **Garder tel quel** (infos de contact BlueStift, pas de l'école) |
| 405-445 | `initSupportForm()` | **FAKE** - `setTimeout(1500)`, log console | `SchoolsDB.submitSupportTicket(data)` → INSERT `contact_messages` avec `school_id` + `source='form'` |
| 447-521 | `initFileUpload()` | Upload de screenshot fonctionnel (UI only) | Ajouter upload vers Supabase Storage bucket |
| 524-533 | `prefillFormFromSchool()` | `window.SchoolsDashboard?.currentSchool.adminName/email` | `SchoolsDB.currentAdmin.full_name` / `SchoolsDB.currentSchool.email` |

### 1.6 `schools/sections/subscription.js` (443 lignes)

| Ligne(s) | Fonction | MOCK actuel | Remplacement DB |
|-----------|----------|-------------|-----------------|
| 12-72 | `plansData` | **Hardcodé** en JS (Standard 80k, Pro 120k, Custom) | `SchoolsDB.getPlans()` → SELECT `subscription_plans` WHERE `category = 'school_b2b'` |
| 75-79 | `billingHistory` | **Hardcodé** 3 factures mock | `SchoolsDB.getAdjustmentsHistory()` → SELECT `class_adjustments` + `subscriptions` |
| 82-84 | `render()` | `window.SchoolsDashboard?.currentSchool` pour planType, expiryDate, rayaLeft | `SchoolsDB.currentSchool` (données réelles) |
| 342-356 | `initUpgradeButton()`, `initRenewButton()` | "Coming soon" notifications | **Garder tel quel** pour MVP (paiement pas encore intégré) |
| 358-382 | `initPlanButtons()` | "Demo mode" notifications | **Garder tel quel** pour MVP |
| 384-408 | `initInvoiceButtons()` | "Downloading..." fake | Connecter quand billing est réel |
| 419-437 | `initDangerButtons()` | Confirm dialog + notification | Connecter à `SchoolsDB.cancelSubscription()` plus tard |

### 1.7 `schools/sections/export.js` (495 lignes)

| Ligne(s) | Fonction | MOCK actuel | Remplacement DB |
|-----------|----------|-------------|-----------------|
| 239-249 | `populateClassFilter()` | **Hardcodé**: `['12th Grade A', '12th Grade B', ...]` | `SchoolsDB.getClasses()` → SELECT `class_years` JOIN `classes` |
| 355-411 | `generateCSVContent()` | **Hardcodé** données fictives pour chaque type de rapport | Remplacer par données réelles de la DB (insights, users, etc.) |
| 334-353 | `simulateDownload()` | Génère un CSV blob et le télécharge | **Garder le mécanisme**, changer les données source |

### 1.8 `schools/sections/index.js` (103 lignes)

**Rien à changer.** C'est un loader de templates, pas de données.

### 1.9 `schools-data.json` (313 lignes)

**À SUPPRIMER** quand tout est connecté à la DB. C'est le fichier mock principal.

### 1.10 `supabase-client.js` (528 lignes)

**À SUPPRIMER.** Obsolète et inutilisé. Le nouveau `schools-db.js` sera autonome.

---

## 2. Tables Existantes Utilisées

| Table DB | Utilisée par | Données fournies |
|----------|-------------|------------------|
| `schools` | `loadSchoolData()`, Settings, Subscription | name, city, country, email, phone, subscription_tier, subscription_expires_at, admin_key, actual_enrolled_count |
| `users` (role=school_admin) | Auth, `#admin-name`, prefill forms | full_name, email, school_id, auth_user_id |
| `users` (role=student) | Stats globales | current_streak_days, total_lessons_completed, school_id |
| `school_years` | Year selector, filtrage insights | label, is_current |
| `classes` | Class search, export filter | name, expected_size, school_id |
| `class_years` | Class search, class stats | class_id, school_year_id, student_count, promo_code, school_id |
| `insights` | Subjects table, drawer, global stats | subject, mastery_score, critical_gap, concepts_acquired, recommended_action, student_effort_level, sample_size, class_year_id |
| `contributions` + `contribution_files` | Contribute form | Réutiliser le même flow que l'existant, ajouter school_id |
| `contact_messages` | Support form | INSERT avec school_id |
| `subscriptions` + `subscription_plans` | Subscription section | Plan actif, prix, features, dates |
| `class_adjustments` | Billing history | Historique d'ajustements payants |

---

## 3. Vues SQL à Créer dans Supabase

### Vue 1: `school_global_overview`

Stats globales d'une école pour les 6 stat cards du dashboard.

```sql
CREATE OR REPLACE VIEW school_global_overview
WITH (security_invoker = true) AS
SELECT
    s.id AS school_id,
    s.name AS school_name,
    s.subscription_tier,
    s.subscription_expires_at,
    s.actual_enrolled_count AS total_students,
    sy.label AS academic_year,
    COALESCE(AVG(u.current_streak_days), 0)::int AS avg_streak,
    COALESCE(SUM(u.total_lessons_completed), 0)::int AS total_lessons_completed,
    COALESCE(AVG(i.mastery_score), 0)::numeric(4,3) AS avg_pkm
FROM schools s
LEFT JOIN school_years sy ON sy.is_current = true
LEFT JOIN users u ON u.school_id = s.id AND u.role = 'student'
LEFT JOIN class_years cy ON cy.school_id = s.id AND cy.school_year_id = sy.id
LEFT JOIN insights i ON i.class_year_id = cy.id AND i.school_id = s.id
GROUP BY s.id, s.name, s.subscription_tier, s.subscription_expires_at,
         s.actual_enrolled_count, sy.label;
```

### Vue 2: `school_subject_overview`

Stats par matière agrégées au niveau école (pour la table "Insights by Subject").

```sql
CREATE OR REPLACE VIEW school_subject_overview
WITH (security_invoker = true) AS
SELECT
    i.school_id,
    i.subject,
    sy.label AS academic_year,
    COUNT(*)::int AS insight_count,
    AVG(i.mastery_score)::numeric(4,3) AS avg_pkm,
    SUM(i.sample_size)::int AS total_sample_size,
    MODE() WITHIN GROUP (ORDER BY i.student_effort_level) AS dominant_effort_level,
    ARRAY_AGG(DISTINCT i.critical_gap) FILTER (WHERE i.critical_gap IS NOT NULL) AS all_difficulties,
    ARRAY_AGG(DISTINCT i.recommended_action) FILTER (WHERE i.recommended_action IS NOT NULL) AS all_recommendations
FROM insights i
JOIN class_years cy ON i.class_year_id = cy.id
JOIN school_years sy ON cy.school_year_id = sy.id AND sy.is_current = true
WHERE i.sample_size >= 5
GROUP BY i.school_id, i.subject, sy.label;
```

### Modification mineure: `contact_messages`

```sql
ALTER TABLE contact_messages ADD COLUMN school_id UUID REFERENCES schools(id);
```

---

## 4. Authentification

### Flux choisi: Supabase Auth (email/password)

```
schools-login.html → email + password
    ↓
supabase.auth.signInWithPassword()
    ↓
SELECT * FROM users WHERE auth_user_id = auth.uid()
    ↓
Vérifier role = 'school_admin'
    ↓  OUI                          ↓  NON
Stocker school_id              Afficher erreur
Redirect → schools.html       "Accès non autorisé"
    ↓
schools.js: vérifier session
Si pas de session → redirect login
```

### Prérequis DB pour tester

```sql
-- 1. Créer un user dans Supabase Auth (via Dashboard > Authentication > Add User)
-- Email: admin@vogt-highschool.edu
-- Password: Test1234!

-- 2. Insérer l'école de test (si pas déjà fait)
INSERT INTO schools (name, city, country, email, phone, subscription_tier, admin_key, actual_enrolled_count)
VALUES ('Mary High School', 'Yaounde', 'Cameroon', 'admin@vogt-highschool.edu', '+237 699 123 456', 'pro', 'MARY2025-ADMIN', 1247)
RETURNING id;

-- 3. Lier le user auth à la table users
INSERT INTO users (auth_user_id, email, full_name, role, school_id, account_type)
VALUES (
    'UUID-DU-USER-AUTH',  -- Copier depuis Auth > Users
    'admin@vogt-highschool.edu',
    'Jean-Paul Kamga',
    'school_admin',
    'UUID-DE-LECOLE',     -- Copier depuis étape 2
    'pro'
);
```

---

## 5. Structure de `schools-db.js` (Nouveau Fichier)

```javascript
/*
 * SCHOOLS-DB.JS - Client Supabase pour le Dashboard Schools
 * Autonome (ne dépend PAS de supabase-client.js)
 */

const SUPABASE_URL = 'https://xyxsuoeldkfznodblgvp.supabase.co';
const SUPABASE_ANON_KEY = '...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SchoolsDB {

    constructor() {
        this.supabase = supabase;
        this.currentAdmin = null;   // { id, full_name, email, role, school_id }
        this.currentSchool = null;  // { id, name, city, ... }
    }

    // === AUTH ===
    async login(email, password) { ... }
    async logout() { ... }
    async checkSession() { ... }     // Retourne admin ou null
    async isAuthenticated() { ... }

    // === SCHOOL INFO ===
    async getSchoolInfo() { ... }                    // SELECT schools WHERE id = school_id
    async updateSchoolProfile(data) { ... }          // UPDATE schools

    // === GLOBAL STATS ===
    async getGlobalStats() { ... }                   // SELECT school_global_overview
    async getSubjectOverview() { ... }               // SELECT school_subject_overview

    // === CLASSES ===
    async getClasses() { ... }                       // SELECT class_years JOIN classes
    async searchClass(query) { ... }                 // ILIKE classes.name
    async getSchoolYears() { ... }                   // SELECT school_years ORDER BY label DESC

    // === INSIGHTS (per class) ===
    async getClassStats(classYearId) { ... }         // Agrégation: student_count, avg PKM, etc.
    async getClassSubjects(classYearId) { ... }      // insights GROUP BY subject
    async getSubjectDetail(classYearId, subject) { } // insights détaillés pour le drawer

    // === CONTRIBUTIONS ===
    async submitContribution(formData, files) { ... } // INSERT contributions + upload Storage
    async getContributions() { ... }                   // SELECT contributions WHERE school_id

    // === SUPPORT ===
    async submitSupportTicket(data) { ... }           // INSERT contact_messages

    // === SUBSCRIPTION ===
    async getPlans() { ... }                          // SELECT subscription_plans WHERE school_b2b
    async getCurrentSubscription() { ... }            // SELECT subscriptions WHERE school_id
    async getBillingHistory() { ... }                 // SELECT class_adjustments WHERE school_id
}

window.SchoolsDB = new SchoolsDB();
```

---

## 6. Fichiers Finaux

### À CRÉER

| Fichier | Rôle |
|---------|------|
| `schools-login.html` | Page de connexion (email + password) |
| `schools-login.js` | Logique auth (login, redirect) |
| `schools-db.js` | Client Supabase autonome pour Schools |

### À MODIFIER

| Fichier | Modifications |
|---------|---------------|
| `schools.html` | Ajouter scripts Supabase SDK + schools-db.js. Supprimer référence à supabase-client.js si présente. |
| `schools.js` | Auth guard + remplacer toutes les fonctions mock par SchoolsDB |
| `schools/sections/settings.js` | `initProfileForm()` → SchoolsDB.updateSchoolProfile() |
| `schools/sections/contact.js` | `initSupportForm()` → SchoolsDB.submitSupportTicket() |
| `schools/sections/subscription.js` | Plans + billing depuis DB |
| `schools/sections/export.js` | `populateClassFilter()` + `generateCSVContent()` depuis DB |

### À SUPPRIMER

| Fichier | Raison |
|---------|--------|
| `supabase-client.js` | Obsolète, inutilisé |
| `schools-data.json` | Remplacé par DB (après migration complète) |

---

## 7. Ordre d'Implémentation

```
PHASE 1: AUTH (Critique)
├── 1.1  Créer schools-db.js (classe vide + init Supabase)
├── 1.2  Créer schools-login.html + schools-login.js
├── 1.3  Créer user test dans Supabase (Auth + users table)
├── 1.4  Ajouter auth guard dans schools.js (redirect si pas connecté)
├── 1.5  Connecter bouton logout (#menu-logout)
└── 1.6  Ajouter scripts dans schools.html (<script> tags)

PHASE 2: DONNÉES ÉCOLE (Critique)
├── 2.1  Implémenter SchoolsDB.getSchoolInfo()
├── 2.2  Remplacer loadSchoolData() → données DB
├── 2.3  Fix #admin-name (jamais peuplé actuellement)
├── 2.4  Créer les 2 vues SQL dans Supabase
├── 2.5  Implémenter SchoolsDB.getGlobalStats() + getSubjectOverview()
├── 2.6  Remplacer loadGlobalData() → données DB
├── 2.7  Implémenter SchoolsDB.getSchoolYears()
└── 2.8  Peupler dynamiquement #select-year

PHASE 3: CLASSES & INSIGHTS (Important)
├── 3.1  Implémenter SchoolsDB.searchClass()
├── 3.2  Remplacer handleClassSearch() → recherche DB (retourne class_year_id)
├── 3.3  Implémenter SchoolsDB.getClassSubjects()
├── 3.4  Remplacer loadClassData() → données DB
├── 3.5  Implémenter SchoolsDB.getSubjectDetail()
├── 3.6  Connecter openInsightsDrawer() → données DB
└── 3.7  Insérer données test (insights) dans Supabase

PHASE 4: SECTIONS (Moyen)
├── 4.1  Connecter Contribute form → SchoolsDB.submitContribution()
├── 4.2  Connecter Settings profile → SchoolsDB.updateSchoolProfile()
├── 4.3  Connecter Support form → SchoolsDB.submitSupportTicket()
├── 4.4  Connecter Subscription plans → SchoolsDB.getPlans()
├── 4.5  Connecter Billing history → SchoolsDB.getBillingHistory()
└── 4.6  Connecter Export class filter → SchoolsDB.getClasses()

PHASE 5: CLEANUP
├── 5.1  Supprimer supabase-client.js
├── 5.2  Supprimer schools-data.json
├── 5.3  Supprimer generateRayaResponse() de schools-utils.js
└── 5.4  Test complet du flux
```

---

## 8. Mapping Précis: Mock → DB

### `schools-data.json` → Tables

| Chemin JSON | Table.colonne | Notes |
|-------------|---------------|-------|
| `school.name` | `schools.name` | Direct |
| `school.country` | `schools.country` | Direct |
| `school.city` | `schools.city` | Direct |
| `school.planType` | `schools.subscription_tier` | "Pro" → "pro" |
| `school.expiryDate` | `schools.subscription_expires_at` | ISO date |
| `school.rayaMessagesLeft` | Calculé | Plan limite - usage (pas de colonne dédiée dans schools, vient de subscription_plans.message_limit) |
| `school.contributionsLeft` | — | Toujours "∞" (unlimited) |
| `school.email` | `schools.email` | Direct |
| `school.phone` | `schools.phone` | Direct |
| `school.adminName` | `users.full_name` | WHERE role='school_admin' AND school_id=X |
| `global.students` | `schools.actual_enrolled_count` | Direct |
| `global.pkm` | `AVG(insights.mastery_score)` | Agrégé par école |
| `global.avgTime` | `users` agrégé | Pas de colonne directe → à calculer ou stocker |
| `global.completion` | `users` agrégé | Ratio lessons_completed |
| `global.avgStreak` | `AVG(users.current_streak_days)` | WHERE school_id=X AND role='student' |
| `global.lessonsCompleted` | `SUM(users.total_lessons_completed)` | WHERE school_id=X AND role='student' |
| `global.subjects[].name` | `insights.subject` | Texte libre |
| `global.subjects[].icon` | — | Mapping côté client (subject name → icon) |
| `global.subjects[].pkm` | `AVG(insights.mastery_score)` | GROUP BY subject |
| `global.subjects[].difficulty` | `insights.critical_gap` | Agrégé (premier ou plus fréquent) |
| `global.subjects[].effort` | `insights.student_effort_level` | MODE() = le plus fréquent |
| `global.subjects[].details.difficulties` | `insights.critical_gap` | ARRAY_AGG(DISTINCT) |
| `global.subjects[].details.mastered` | `insights.concepts_acquired` | ARRAY_AGG(DISTINCT unnest) |
| `global.subjects[].details.recommendations` | `insights.recommended_action` | ARRAY_AGG(DISTINCT) |
| `global.subjects[].details.effortLevel` | `insights.student_effort_level` | MODE() |
| `global.subjects[].details.effortDesc` | — | **N'existe pas en DB** → générer côté client ou ignorer |
| `class.*` | Même que `global.*` | Mais filtré par `class_year_id` au lieu de `school_id` |
| `rayaResponses.*` | — | **Inutilisé** (RAYA est externe à raya.thebluestift.com) |

### Icon Mapping (côté client)

```javascript
const SUBJECT_ICONS = {
    'Mathematics': 'calculator',
    'Physics': 'atom',
    'Chemistry': 'flask',
    'Biology / Life Sciences': 'leaf',
    'French': 'book',
    'English': 'language',
    'History & Geography': 'globe',
    'Philosophy': 'brain',
    'Computer Science': 'laptop-code'
};
```

---

## 9. Données Manquantes dans la DB Actuelle

| Donnée mock | Existe en DB? | Solution |
|-------------|---------------|----------|
| `global.avgTime` ("3h45") | **NON** - Pas de tracking temps dans `users` ni `insights` | Option A: Ignorer pour MVP. Option B: Ajouter colonne `avg_weekly_minutes` à `users`. Option C: Calculer depuis `conversations` (created_at → updated_at) |
| `global.completion` ("72%") | **PARTIEL** - `users.total_lessons_completed` existe mais pas le total de leçons disponibles | Option A: Hardcoder "—" pour MVP. Option B: Calculer depuis un autre metric |
| `school.contributionsLeft` | **NON** | Toujours "∞", OK |
| `subjects[].details.effortDesc` | **NON** | Générer côté client: "High" → "Strong engagement", etc. |
| `settings.school_type` | **NON** - Pas de colonne dans `schools` | Option A: Ajouter `ALTER TABLE schools ADD COLUMN school_type TEXT`. Option B: Ignorer |

---

## 10. Résumé des Modifications DB

### À exécuter dans Supabase SQL Editor

```sql
-- 1. Vue school_global_overview
-- (voir section 3)

-- 2. Vue school_subject_overview
-- (voir section 3)

-- 3. Colonne school_id sur contact_messages
ALTER TABLE contact_messages ADD COLUMN school_id UUID REFERENCES schools(id);

-- 4. (Optionnel) Colonne school_type sur schools
ALTER TABLE schools ADD COLUMN school_type TEXT CHECK (school_type IN ('primary', 'secondary', 'high', 'mixed'));

-- 5. Données de test
-- (voir section 4 - Prérequis DB pour tester)
```

**Total: 2 vues + 1-2 colonnes. Zéro nouvelle table.**

---

*Document final - 10 février 2026*
*Basé sur lecture exhaustive de tous les fichiers du projet*
*Aligné avec DOCUMENTATION_COMPLETE.md (19 tables existantes)*
