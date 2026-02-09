# BlueStift Schools - Plan Base de Données & Authentification

> Document de référence pour l'implémentation de la DB Supabase pour le dashboard Schools

---

## 1. Architecture Actuelle

### Fichiers Concernés

| Fichier | Rôle |
|---------|------|
| `schools.html` | Dashboard principal avec toutes les sections UI |
| `schools.js` | Logique principale, charge les données mock |
| `schools-data.json` | Données mock (école, stats globales, par classe) |
| `schools-utils.js` | Utilitaires (notifications, langues, dates) |
| `schools/sections/index.js` | Système de chargement des sections dynamiques |
| `schools/sections/export.js` | Section export de données |
| `schools/sections/settings.js` | Section paramètres |
| `schools/sections/subscription.js` | Section abonnement |
| `schools/sections/contact.js` | Section support |
| `supabase-client.js` | Client Supabase existant (waitlist, contributions générales) |

### Flux Actuel (Sans Auth)

```
[Utilisateur] → schools.html → schools.js → schools-data.json (MOCK)
```

### Flux Cible (Avec Auth)

```
[Utilisateur] → schools-login.html → [Auth Supabase]
                     ↓
              schools.html → schools-db.js → [Supabase Tables]
                     ↓
              Vérification session active
```

---

## 2. Schéma de Base de Données Supabase

### 2.1 Table `schools`

```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,  -- Ex: "VOGT-HS-001"
    country TEXT DEFAULT 'Cameroon',
    city TEXT,
    school_type TEXT CHECK (school_type IN ('primary', 'secondary', 'high', 'mixed')),

    -- Subscription
    plan_type TEXT DEFAULT 'standard' CHECK (plan_type IN ('standard', 'pro', 'custom')),
    subscription_expires_at TIMESTAMPTZ,
    raya_messages_limit INT DEFAULT 50,
    raya_messages_used INT DEFAULT 0,

    -- Contact
    admin_email TEXT,
    admin_phone TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Table `school_admins`

```sql
CREATE TABLE school_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'viewer')),

    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(school_id, user_id)
);
```

### 2.3 Table `classes`

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    name TEXT NOT NULL,  -- Ex: "12th Grade A"
    grade_level TEXT,
    academic_year TEXT DEFAULT '2025-2026',

    student_count INT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Table `students` (Optionnel pour MVP)

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,

    student_code TEXT,
    full_name TEXT,
    email TEXT,

    -- Métriques globales
    pkm_score DECIMAL(4,3) DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    total_time_minutes INT DEFAULT 0,
    current_streak INT DEFAULT 0,

    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.5 Table `subjects`

```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,  -- FontAwesome icon name (calculator, atom, flask, etc.)
    category TEXT  -- sciences, languages, humanities
);

-- Seed data
INSERT INTO subjects (name, icon, category) VALUES
('Mathematics', 'calculator', 'sciences'),
('Physics', 'atom', 'sciences'),
('Chemistry', 'flask', 'sciences'),
('Biology / Life Sciences', 'leaf', 'sciences'),
('French', 'book', 'languages'),
('English', 'language', 'languages'),
('History & Geography', 'globe', 'humanities'),
('Philosophy', 'brain', 'humanities'),
('Computer Science', 'laptop-code', 'sciences');
```

### 2.6 Table `class_subject_stats`

```sql
CREATE TABLE class_subject_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year TEXT DEFAULT '2025-2026',

    -- Métriques
    avg_pkm DECIMAL(4,3) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_minutes INT DEFAULT 0,
    effort_level TEXT CHECK (effort_level IN ('low', 'medium', 'high')),

    -- Insights (JSON)
    difficulties JSONB DEFAULT '[]',
    mastered_concepts JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(class_id, subject_id, academic_year)
);
```

### 2.7 Table `school_global_stats`

```sql
CREATE TABLE school_global_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    academic_year TEXT DEFAULT '2025-2026',

    total_students INT DEFAULT 0,
    avg_pkm DECIMAL(4,3) DEFAULT 0,
    avg_completion_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_per_week TEXT,  -- Ex: "3h45"
    avg_streak INT DEFAULT 0,
    total_lessons_completed INT DEFAULT 0,

    -- Stats par matière (pré-agrégées)
    subjects_stats JSONB DEFAULT '[]',

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(school_id, academic_year)
);
```

### 2.8 Table `school_contributions`

```sql
CREATE TABLE school_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES school_admins(id),

    contributor_name TEXT,
    contributor_email TEXT,
    contributor_phone TEXT,
    title TEXT NOT NULL,
    category TEXT,  -- mathematics, physics, etc.
    target_class TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all')),
    description TEXT,

    file_count INT DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.9 Table `school_contribution_files`

```sql
CREATE TABLE school_contribution_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID REFERENCES school_contributions(id) ON DELETE CASCADE,

    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT,
    mime_type TEXT,
    file_size BIGINT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.10 Table `school_support_tickets`

```sql
CREATE TABLE school_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,

    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.11 Table `billing_history`

```sql
CREATE TABLE billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    invoice_number TEXT UNIQUE,
    description TEXT,
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'XAF',
    status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),

    invoice_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Row Level Security (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subject_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_global_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_contribution_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- Fonction helper pour récupérer le school_id de l'utilisateur connecté
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT school_id FROM school_admins
        WHERE user_id = auth.uid() AND is_active = true
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politique pour schools
CREATE POLICY "Users can view their own school"
ON schools FOR SELECT
USING (id = get_user_school_id());

CREATE POLICY "Owners can update their school"
ON schools FOR UPDATE
USING (id = get_user_school_id());

-- Politique pour school_admins
CREATE POLICY "Users can view admins of their school"
ON school_admins FOR SELECT
USING (school_id = get_user_school_id());

-- Politique pour classes
CREATE POLICY "Users can view classes of their school"
ON classes FOR SELECT
USING (school_id = get_user_school_id());

-- Politique pour class_subject_stats
CREATE POLICY "Users can view stats of their school"
ON class_subject_stats FOR SELECT
USING (school_id = get_user_school_id());

-- Politique pour school_global_stats
CREATE POLICY "Users can view global stats of their school"
ON school_global_stats FOR SELECT
USING (school_id = get_user_school_id());

-- Politique pour school_contributions
CREATE POLICY "Users can view and insert contributions for their school"
ON school_contributions FOR ALL
USING (school_id = get_user_school_id());

-- Politique pour billing_history
CREATE POLICY "Users can view billing of their school"
ON billing_history FOR SELECT
USING (school_id = get_user_school_id());
```

---

## 4. Plan d'Implémentation

### Phase 1: Authentification

| Étape | Tâche | Priorité |
|-------|-------|----------|
| 1.1 | Créer tables `schools` et `school_admins` dans Supabase | Critique |
| 1.2 | Configurer RLS de base | Critique |
| 1.3 | Créer `schools-login.html` (page de connexion) | Critique |
| 1.4 | Créer `schools-login.js` (logique auth) | Critique |
| 1.5 | Ajouter vérification session dans `schools.js` | Critique |
| 1.6 | Ajouter bouton logout fonctionnel | Critique |

### Phase 2: Données de l'École

| Étape | Tâche | Priorité |
|-------|-------|----------|
| 2.1 | Créer table `school_global_stats` | Critique |
| 2.2 | Créer `schools-db.js` (client DB) | Critique |
| 2.3 | Remplacer `loadSchoolData()` | Critique |
| 2.4 | Remplacer `loadGlobalData()` | Critique |
| 2.5 | Insérer données de test | Important |

### Phase 3: Classes & Stats

| Étape | Tâche | Priorité |
|-------|-------|----------|
| 3.1 | Créer tables `classes`, `subjects`, `class_subject_stats` | Important |
| 3.2 | Implémenter `loadClassData()` depuis DB | Important |
| 3.3 | Implémenter recherche de classe | Important |
| 3.4 | Connecter drawer insights | Important |

### Phase 4: Fonctionnalités Secondaires

| Étape | Tâche | Priorité |
|-------|-------|----------|
| 4.1 | Connecter formulaire Contributions | Moyen |
| 4.2 | Connecter formulaire Support | Moyen |
| 4.3 | Connecter Settings (profil) | Moyen |
| 4.4 | Connecter Billing history | Faible |
| 4.5 | Connecter Export (si données réelles) | Faible |

---

## 5. Fichiers à Créer

```
BlueStift Website/
├── schools-login.html      # Page de connexion
├── schools-login.js        # Logique d'authentification
├── schools-db.js           # Client Supabase pour Schools
└── schools-auth.js         # Helpers d'authentification (optionnel)
```

---

## 6. Structure du Client `schools-db.js`

```javascript
class SchoolsDB {
    constructor() {
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        this.currentAdmin = null;
        this.currentSchool = null;
    }

    // ==========================================
    // AUTHENTIFICATION
    // ==========================================

    async loginSchoolAdmin(email, password) { }
    async logoutSchoolAdmin() { }
    async getCurrentSchoolAdmin() { }
    async isAuthenticated() { }

    // ==========================================
    // DONNÉES ÉCOLE
    // ==========================================

    async getSchoolInfo() { }
    async updateSchoolProfile(data) { }

    // ==========================================
    // STATISTIQUES
    // ==========================================

    async getGlobalStats(academicYear = '2025-2026') { }
    async getClassStats(classId, academicYear) { }
    async getSubjectInsights(classId, subjectId) { }

    // ==========================================
    // CLASSES
    // ==========================================

    async getClasses(academicYear) { }
    async searchClass(query) { }

    // ==========================================
    // CONTRIBUTIONS
    // ==========================================

    async submitContribution(formData, files) { }
    async getContributions(status = null) { }

    // ==========================================
    // SUPPORT
    // ==========================================

    async submitSupportTicket(data) { }

    // ==========================================
    // ABONNEMENT
    // ==========================================

    async getSubscriptionInfo() { }
    async getBillingHistory() { }
    async getUsageStats() { }
}

window.SchoolsDB = new SchoolsDB();
```

---

## 7. Mapping Mock Data → Tables

| Champ Mock (schools-data.json) | Table Supabase | Colonne |
|-------------------------------|----------------|---------|
| `school.name` | `schools` | `name` |
| `school.planType` | `schools` | `plan_type` |
| `school.expiryDate` | `schools` | `subscription_expires_at` |
| `school.rayaMessagesLeft` | `schools` | `raya_messages_limit - raya_messages_used` |
| `school.email` | `schools` | `admin_email` |
| `school.phone` | `schools` | `admin_phone` |
| `school.adminName` | `school_admins` | `full_name` |
| `global.students` | `school_global_stats` | `total_students` |
| `global.pkm` | `school_global_stats` | `avg_pkm` |
| `global.avgTime` | `school_global_stats` | `avg_time_per_week` |
| `global.completion` | `school_global_stats` | `avg_completion_rate` |
| `global.avgStreak` | `school_global_stats` | `avg_streak` |
| `global.lessonsCompleted` | `school_global_stats` | `total_lessons_completed` |
| `global.subjects[].name` | `subjects` | `name` |
| `global.subjects[].pkm` | `class_subject_stats` | `avg_pkm` |
| `global.subjects[].difficulty` | `class_subject_stats` | `difficulties` (JSONB) |
| `global.subjects[].effort` | `class_subject_stats` | `effort_level` |
| `global.subjects[].details` | `class_subject_stats` | `difficulties`, `mastered_concepts`, `recommendations` |

---

## 8. Notes Importantes

### Sécurité
- Ne jamais exposer le `service_role` key côté client
- Utiliser uniquement `anon` key avec RLS activé
- Valider les inputs côté serveur (Edge Functions si besoin)

### Performance
- Les tables `*_stats` sont pré-agrégées pour éviter les calculs en temps réel
- Utiliser des index sur `school_id`, `class_id`, `academic_year`
- Pagination pour les listes longues (contributions, billing)

### Migration Future
- Ce schéma est compatible avec une future migration React/Next.js
- Les API Supabase restent les mêmes
- Seul le client-side change

---

*Document créé le 5 février 2026*
*Dernière mise à jour: 5 février 2026*
