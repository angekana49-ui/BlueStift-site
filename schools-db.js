// ==========================================
// SCHOOLS-DB.JS - Dual Mode Data Layer
// Mode 'demo' = schools-data.json (mock)
// Mode 'live' = Supabase (real DB)
// ==========================================

const SchoolsDB = (() => {
  // ------------------------------------
  // PRIVATE STATE
  // ------------------------------------
  let mode = 'demo'; // 'demo' | 'live'
  let supabase = null;
  let mockData = null;
  let _currentSchool = null;
  let _currentAdmin = null;
  let _currentClassYearId = null;
  let _pendingSetupEmail = null; // Set when landing from email confirmation link

  // Demo credentials (kept for investor pitches)
  const DEMO_CREDENTIALS = {
    email: 'admin@test.com',
    password: 'Test1234!'
  };

  // ------------------------------------
  // INITIALIZATION
  // ------------------------------------

  async function init() {
    // Check URL param: ?demo=true forces demo mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      mode = 'demo';
      console.log('🎭 SchoolsDB: DEMO mode (forced by URL)');
      return;
    }

    // Try to init Supabase (with 5s timeout to avoid blocking)
    if (typeof window.supabase !== 'undefined' && typeof SUPABASE_CONFIG !== 'undefined') {
      try {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        ]);
        const session = sessionResult?.data?.session;
        if (session) {
          // Email confirmation redirect: skip school load, let UI show step 2
          const _pk = `bs_pending_${session.user.email}`;
          if (localStorage.getItem(_pk)) {
            mode = 'live';
            _pendingSetupEmail = session.user.email;
            console.log('📧 Email confirmed — pending school setup');
            return;
          }
          mode = 'live';
          await _loadLiveUserData(session.user);
          const _pc = _checkPilotExpiry();
          if (_pc) {
            await _rejectExpiredPilot(_pc.pilotUntil);
            window._pilotExpired = { pilotUntil: _pc.pilotUntil };
            console.log('🔒 Pilot period expired (session restore)');
            return;
          }
          console.log('🔐 SchoolsDB: LIVE mode (authenticated)');
          return;
        }
      } catch (e) {
        console.warn('⚠️ Supabase init failed, falling back to demo:', e.message);
      }
    }

    mode = 'demo';
    console.log('🎭 SchoolsDB: DEMO mode (default)');
  }

  // Load user/school data from Supabase after auth
  async function _loadLiveUserData(authUser) {
    // Get user record with school info
    const { data: user, error } = await supabase
      .from('users')
      .select('*, schools(*)')
      .eq('auth_user_id', authUser.id)
      .in('role', ['school_admin', 'god'])
      .single();

    if (error || !user) {
      console.error('❌ Not a school admin:', error?.message);
      mode = 'demo';
      return;
    }

    _currentAdmin = {
      id: user.id,
      authUserId: user.auth_user_id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    if (user.schools) {
      _currentSchool = user.schools;
    }
  }

  // ------------------------------------
  // AUTHENTICATION
  // ------------------------------------

  // Returns { pilotUntil } if expired, null if OK or no pilot set
  function _checkPilotExpiry() {
    if (!_currentSchool?.pilot_until) return null;
    const pilotEnd = new Date(_currentSchool.pilot_until);
    pilotEnd.setHours(23, 59, 59, 999); // end of that day
    return pilotEnd < new Date() ? { pilotUntil: _currentSchool.pilot_until } : null;
  }

  // Shared: sign out + reset state + return pilotExpired error
  async function _rejectExpiredPilot(pilotUntil) {
    await supabase.auth.signOut();
    _currentSchool = null;
    _currentAdmin = null;
    mode = 'demo';
    return { success: false, pilotExpired: true, pilotUntil };
  }

  async function login(email, password) {
    // Try demo credentials first
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      mode = 'demo';
      localStorage.setItem('schools_authenticated', 'true');
      localStorage.setItem('schools_auth_email', email);
      localStorage.setItem('schools_mode', 'demo');
      console.log('🎭 Demo login successful');
      return { success: true, mode: 'demo' };
    }

    // Try Supabase auth
    if (!supabase) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check if users record exists (may not exist yet if email confirmation was required)
    const { data: user } = await supabase
      .from('users')
      .select('role, school_id')
      .eq('auth_user_id', data.user.id)
      .maybeSingle();

    // First login after email confirmation — link users record to already-created school
    const pendingKey = `bs_pending_${email}`;
    const pendingRaw = localStorage.getItem(pendingKey);
    // Detect pending setup — fires even if handle_email_confirmed already created
    // a 'student' row (the RPC will upgrade it to 'school_admin' via ON CONFLICT DO UPDATE)
    if (pendingRaw && (!user || user.role !== 'school_admin')) {
      try {
        const pending = JSON.parse(pendingRaw);
        if (pending.rpcComplete && pending.schoolId) {
          // Step 2 already ran — just load the session and go to dashboard
          localStorage.removeItem(pendingKey);
          mode = 'live';
          localStorage.setItem('schools_mode', 'live');
          await _loadLiveUserData(data.user);
          { const _pc = _checkPilotExpiry(); if (_pc) return _rejectExpiredPilot(_pc.pilotUntil); }
          return { success: true, mode: 'live' };
        } else {
          // Step 2 never done — tell the UI to show step 2 for class setup.
          // Do NOT auto-run the RPC with empty classes here.
          mode = 'live';
          localStorage.setItem('schools_mode', 'live');
          return { success: true, mode: 'live', pendingSetup: true };
        }
      } catch (e) {
        console.error('First-login setup error:', e);
      }
    }

    if (!user || !['school_admin', 'god'].includes(user.role)) {
      await supabase.auth.signOut();
      return { success: false, error: 'This account does not have school admin access.' };
    }

    mode = 'live';
    localStorage.setItem('schools_mode', 'live');
    await _loadLiveUserData(data.user);
    console.log('🔐 Live login successful');
    { const _pc = _checkPilotExpiry(); if (_pc) return _rejectExpiredPilot(_pc.pilotUntil); }
    return { success: true, mode: 'live' };
  }

  async function loginWithDemo() {
    return login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  async function logout() {
    if (mode === 'live' && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('schools_authenticated');
    localStorage.removeItem('schools_auth_email');
    localStorage.removeItem('schools_mode');
    _currentSchool = null;
    _currentAdmin = null;
    mode = 'demo';
  }

  function isAuthenticated() {
    if (mode === 'live' && supabase) {
      return supabase.auth.getSession().then(({ data }) => !!data.session);
    }
    return Promise.resolve(localStorage.getItem('schools_authenticated') === 'true');
  }

  // ------------------------------------
  // SCHOOL INFO
  // ------------------------------------

  async function getSchoolInfo() {
    if (mode === 'demo') {
      if (!mockData) await _loadMockData();
      if (!mockData) return null;
      return mockData.school;
    }

    // Live: school already loaded in _currentSchool
    if (!_currentSchool) return null;

    return {
      name: _currentSchool.name,
      country: _currentSchool.country_name,
      city: _currentSchool.city,
      location: _currentSchool.city,
      type: _currentSchool.school_type,
      planType: _currentSchool.subscription_tier || 'none',
      expiryDate: _currentSchool.subscription_expires_at,
      rayaMessagesLeft: 50,
      contributionsLeft: -1,
      email: _currentSchool.email,
      phone: _currentSchool.phone,
      adminName: _currentAdmin?.fullName || 'Admin',
      adminEmail: _currentAdmin?.email || '',
      adminKey: _currentSchool.admin_key
    };
  }

  // ------------------------------------
  // GLOBAL STATS
  // ------------------------------------

  async function getGlobalStats() {
    if (mode === 'demo') {
      if (!mockData) await _loadMockData();
      if (!mockData) return _emptyGlobalStats();
      return mockData.global;
    }

    // Live: query school_global_overview (includes streak + lessons from users)
    const { data, error } = await supabase
      .from('school_global_overview')
      .select('*')
      .eq('school_id', _currentSchool.id)
      .single();

    if (error || !data) {
      console.error('❌ getGlobalStats error:', error?.message);
      return _emptyGlobalStats();
    }

    // Get subjects overview
    const subjects = await getSubjects();

    return {
      students: data.total_students || 0,
      pkm: parseFloat(data.avg_pkm) || 0,
      avgTime: 'N/A', // No time tracking yet
      completion: 'N/A', // No completion tracking yet
      avgStreak: data.avg_streak || 0,
      lessonsCompleted: data.total_lessons_completed || 0,
      subjects
    };
  }

  // ------------------------------------
  // SUBJECTS & INSIGHTS
  // ------------------------------------

  async function getSubjects(classYearId = null) {
    if (mode === 'demo') {
      if (!mockData) await _loadMockData();
      if (!mockData) return [];
      return classYearId ? mockData.class.subjects : mockData.global.subjects;
    }

    // Live: query school_subject_overview (pre-aggregated by subject)
    let query = supabase
      .from('school_subject_overview')
      .select('*')
      .eq('school_id', _currentSchool.id);

    if (classYearId) {
      query = query.eq('class_year_id', classYearId);
    } else {
      // Global view: no class filter, but we need to aggregate across classes
      // The view groups by class_year_id, so we get all and merge in JS
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    // Transform view rows to the format expected by the UI
    return _subjectOverviewToSubjects(data, classYearId);
  }

  async function getSubjectDetail(subjectName, isGlobal = true) {
    if (mode === 'demo') {
      if (!mockData) await _loadMockData();
      if (!mockData) return null;
      const source = isGlobal ? mockData.global : mockData.class;
      return source.subjects.find(s => s.name === subjectName) || null;
    }

    // Live: query school_subject_overview for this subject
    let query = supabase
      .from('school_subject_overview')
      .select('*')
      .eq('school_id', _currentSchool.id)
      .eq('subject', subjectName);

    if (!isGlobal && _currentClassYearId) {
      query = query.eq('class_year_id', _currentClassYearId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    const subjects = _subjectOverviewToSubjects(data, isGlobal ? null : _currentClassYearId);
    return subjects.find(s => s.name === subjectName) || null;
  }

  // ------------------------------------
  // CLASS DATA
  // ------------------------------------

  async function getClassStats(classYearId) {
    if (mode === 'demo') {
      if (!mockData) await _loadMockData();
      if (!mockData) return _emptyGlobalStats();
      return mockData.class;
    }

    _currentClassYearId = classYearId;

    // Get student count for this class
    const { data: classYear } = await supabase
      .from('class_years')
      .select('student_count, expected_size, classes(name)')
      .eq('id', classYearId)
      .single();

    // Get insights for this class
    const subjects = await getSubjects(classYearId);

    // Compute aggregated stats
    const avgPkm = subjects.length > 0
      ? subjects.reduce((sum, s) => sum + s.pkm, 0) / subjects.length
      : 0;

    return {
      students: classYear?.student_count || 0,
      pkm: avgPkm,
      avgTime: 'N/A',
      completion: 'N/A',
      avgStreak: 0,
      lessonsCompleted: 0,
      subjects
    };
  }

  async function searchClass(query) {
    if (mode === 'demo') {
      // In demo, any search returns the mock class data
      return { classYearId: 'demo', className: query };
    }

    // Live: search class_years joined with classes
    const currentYear = await _getCurrentSchoolYear();

    // PostgREST doesn't support ilike on related tables — query classes first, then class_years
    const { data: classMatches } = await supabase
      .from('classes')
      .select('id, name')
      .eq('school_id', _currentSchool.id)
      .ilike('name', `%${query}%`);

    if (!classMatches?.length) return null;

    const { data: cyData } = await supabase
      .from('class_years')
      .select('id')
      .eq('class_id', classMatches[0].id)
      .eq('school_year_id', currentYear?.id)
      .single();

    if (!cyData) return null;

    _currentClassYearId = cyData.id;
    return { classYearId: cyData.id, className: classMatches[0].name };
  }

  async function getClasses() {
    if (mode === 'demo') {
      return [
        { id: 'demo-1', name: 'Terminale C', studentCount: 45 },
        { id: 'demo-2', name: 'Terminale D', studentCount: 38 },
        { id: 'demo-3', name: '1ère C', studentCount: 42 },
        { id: 'demo-4', name: '3ème A', studentCount: 50 }
      ];
    }

    const currentYear = await _getCurrentSchoolYear();
    if (!currentYear) return [];

    const { data, error } = await supabase
      .from('class_years')
      .select('id, student_count, expected_size, promo_code, classes(name)')
      .eq('school_id', _currentSchool.id)
      .eq('school_year_id', currentYear.id)
      .eq('is_active', true);

    if (error || !data) return [];

    return data.map(cy => ({
      id: cy.id,
      name: cy.classes?.name || 'Unknown',
      studentCount: cy.student_count,
      expectedSize: cy.expected_size,
      promoCode: cy.promo_code
    }));
  }

  // ------------------------------------
  // SCHOOL YEARS
  // ------------------------------------

  async function getSchoolYears() {
    if (mode === 'demo') {
      return [{ id: 'demo', label: '2025-2026', isCurrent: true }];
    }

    const { data, error } = await supabase
      .from('school_years')
      .select('id, label, is_current')
      .order('start_date', { ascending: false });

    if (error || !data) return [];

    return data.map(sy => ({
      id: sy.id,
      label: sy.label,
      isCurrent: sy.is_current
    }));
  }

  // ------------------------------------
  // CONTRIBUTIONS
  // ------------------------------------

  async function submitContribution(formData, files) {
    if (mode === 'demo') {
      await new Promise(r => setTimeout(r, 2000));
      return { success: true };
    }

    // Insert contribution record
    const { data: contrib, error } = await supabase
      .from('contributions')
      .insert({
        email: formData.email,
        contributor_name: formData.name,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        school_id: _currentSchool?.id || null
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Upload files to storage
    for (const file of files) {
      const filePath = `${contrib.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('contributions')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('contributions')
        .getPublicUrl(filePath);

      // Insert file record
      await supabase.from('contribution_files').insert({
        contribution_id: contrib.id,
        file_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        mime_type: file.type,
        file_size: file.size
      });
    }

    return { success: true, contributionId: contrib.id };
  }

  // ------------------------------------
  // CONTACT / SUPPORT
  // ------------------------------------

  async function submitContactMessage(data) {
    if (mode === 'demo') {
      await new Promise(r => setTimeout(r, 1500));
      return { success: true };
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        source: 'schools_dashboard',
        school_id: _currentSchool?.id || null
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Send email notification (fire-and-forget: message is already saved in DB)
    try {
      await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        })
      });
    } catch (emailErr) {
      // Non-blocking: log warning but don't fail the user action
      console.warn('Email notification failed (message was saved in DB):', emailErr);
    }

    return { success: true };
  }

  // ------------------------------------
  // SUBSCRIPTION PLANS
  // ------------------------------------

  // Save Web Push subscription to Supabase (live mode only)
  async function savePushSubscription(subscription) {
    if (mode !== 'live' || !supabase) return { success: false };
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        user_id: _currentAdmin?.id || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'endpoint' });
    if (error) {
      console.warn('savePushSubscription error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async function getPlans() {
    if (mode === 'demo') {
      // Return mock plans with zone pricing for demo
      return _getDemoPlans();
    }

    // Query subscription_plans directly (zone pricing removed — fixed USD pricing)
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .eq('category', 'school_b2b')
      .order('price');

    if (error) {
      console.error('❌ getPlans error:', error.message);
      return null;
    }

    return data.map(p => ({ ...p, currency: 'USD' }));
  }

  function _getDemoPlans() {
    // T1 (US/Premium) prices — default for demo/investor pitches
    return [
      {
        plan_id:              'b2b_standard',
        plan_name:            'Standard',
        tier:                 'standard',
        description:          'Essential analytics for growing schools',
        price:                1500,
        yearly_price:         16200,
        extra_student_price:  1.05,
        currency:             'USD',
        zone_name:            'Premium (>$50K GDP/cap)',
        features:             null
      },
      {
        plan_id:              'b2b_pro',
        plan_name:            'Pro',
        tier:                 'pro',
        description:          'Full analytics power for ambitious schools',
        price:                2300,
        yearly_price:         24840,
        extra_student_price:  1.61,
        currency:             'USD',
        zone_name:            'Premium (>$50K GDP/cap)',
        features:             null
      },
      {
        plan_id:              'b2b_custom',
        plan_name:            'Custom',
        tier:                 'custom',
        description:          'Tailored solution for large institutions & networks',
        price:                null,
        yearly_price:         null,
        extra_student_price:  null,
        currency:             null,
        zone_name:            null,
        features:             null
      }
    ];
  }

  // ------------------------------------
  // PROFILE UPDATE
  // ------------------------------------

  async function updateSchoolProfile(updates) {
    if (mode === 'demo') {
      await new Promise(r => setTimeout(r, 800));
      // Update local mock
      if (mockData?.school) {
        Object.assign(mockData.school, updates);
      }
      return { success: true };
    }

    const { error } = await supabase
      .from('schools')
      .update({
        name:        updates.name,
        email:       updates.email,
        phone:       updates.phone,
        city:        updates.city,
        school_type: updates.school_type || null
      })
      .eq('id', _currentSchool.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Refresh local data
    Object.assign(_currentSchool, updates);
    return { success: true };
  }

  // ------------------------------------
  // RAYA RESPONSES (demo only)
  // ------------------------------------

  function getRayaResponse(keyword) {
    if (mode === 'demo' && mockData?.rayaResponses) {
      const key = Object.keys(mockData.rayaResponses).find(k =>
        keyword.toLowerCase().includes(k)
      );
      return mockData.rayaResponses[key] || mockData.rayaResponses.default;
    }
    return null;
  }

  // ------------------------------------
  // PRIVATE HELPERS
  // ------------------------------------

  async function _loadMockData() {
    if (mockData) return mockData; // Already loaded
    try {
      const response = await fetch('schools-data.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      mockData = await response.json();
      console.log('📦 Mock data loaded');
      return mockData;
    } catch (error) {
      console.error('❌ Failed to load mock data:', error.message);
      console.error('💡 If using file://, try a local server: npx serve');
      return null;
    }
  }

  async function _getCurrentSchoolYear() {
    const { data } = await supabase
      .from('school_years')
      .select('id, label')
      .eq('is_current', true)
      .single();
    return data;
  }

  const SUBJECT_ICONS = {
    'Mathematics': 'calculator', 'Maths': 'calculator', 'Mathématiques': 'calculator',
    'Physics': 'atom', 'Physique': 'atom',
    'Chemistry': 'flask', 'Chimie': 'flask',
    'French': 'book', 'Français': 'book',
    'English': 'language', 'Anglais': 'language',
    'Biology': 'leaf', 'Biologie': 'leaf', 'Biology / Life Sciences': 'leaf', 'SVT': 'leaf'
  };

  function _subjectOverviewToSubjects(rows, classYearId) {
    // If global view (no classYearId), merge rows across all classes by subject
    const grouped = {};
    for (const row of rows) {
      if (classYearId && row.class_year_id !== classYearId) continue;
      const key = row.subject;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(row);
    }

    return Object.entries(grouped).map(([subject, items]) => {
      // Average PKM across class entries for this subject
      const avgPkm = items.reduce((sum, i) => sum + (parseFloat(i.avg_pkm) || 0), 0) / items.length;

      // Merge arrays from all class entries
      const allDifficulties = items.flatMap(i => i.all_difficulties || []);
      const allConcepts = items.flatMap(i => i.all_concepts_acquired || []);
      const allRecommendations = items.flatMap(i => i.all_recommendations || []);
      const totalSample = items.reduce((sum, i) => sum + (i.total_sample_size || 0), 0);

      // Effort level from dominant_effort
      const effort = _normalizeEffort(items[0]?.dominant_effort);

      return {
        name: subject,
        icon: SUBJECT_ICONS[subject] || 'book-open',
        pkm: avgPkm,
        difficulty: [...new Set(allDifficulties)].slice(0, 2).join(', ') || 'N/A',
        effort,
        details: {
          difficulties: [...new Set(allDifficulties)],
          mastered: [...new Set(allConcepts)],
          recommendations: [...new Set(allRecommendations)],
          effortLevel: effort.charAt(0).toUpperCase() + effort.slice(1),
          effortDesc: `Based on ${totalSample} student interactions`
        }
      };
    });
  }

  function _normalizeEffort(raw) {
    if (!raw) return 'medium';
    const lower = raw.toLowerCase();
    if (lower.includes('elev') || lower.includes('high') || lower.includes('élevé')) return 'high';
    if (lower.includes('faible') || lower.includes('low')) return 'low';
    return 'medium';
  }

  function _emptyGlobalStats() {
    return {
      students: 0, pkm: 0, avgTime: 'N/A', completion: 'N/A',
      avgStreak: 0, lessonsCompleted: 0, subjects: []
    };
  }

  // ------------------------------------
  // SIGNUP
  // ------------------------------------

  // Step 1 of signup: create auth user only, store school info for step 2
  async function signup({ schoolName, country, countryCode, city, adminName, email, password }) {
    if (!supabase) {
      // Demo mode: simulate step 1 success, store fake pending so step 2 works
      await new Promise(r => setTimeout(r, 800));
      localStorage.setItem(`bs_pending_${email}`, JSON.stringify({
        schoolName, country, countryCode, city, adminName,
        authUserId: null, rpcComplete: false, schoolId: null, classes: [], demo: true
      }));
      return { success: true, needsConfirmation: false };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: adminName, school_name: schoolName },
        // Redirect to schools.html so user lands on the login page after confirmation
        emailRedirectTo: window.location.origin + '/schools.html'
      }
    });

    if (authError) return { success: false, error: authError.message };

    const authUser = authData.user;
    if (!authUser) return { success: false, error: 'Signup failed. Please try again.' };

    // Store school data for step 2 (class setup)
    localStorage.setItem(`bs_pending_${email}`, JSON.stringify({
      schoolName, country, countryCode, city, adminName,
      authUserId: authUser.id,
      rpcComplete: false, schoolId: null, classes: []
    }));

    return { success: true, needsConfirmation: !authData.session };
  }

  // Step 2 of signup: add classes and call the RPC to create school + classes
  async function completeSetup({ email, classes, planId = 'b2b_standard' }) {
    const pendingKey = `bs_pending_${email}`;
    const pendingRaw = localStorage.getItem(pendingKey);
    if (!pendingRaw) return { success: false, error: 'Setup data not found. Please sign up again.' };

    const pending = JSON.parse(pendingRaw);
    const classesPayload = (classes || []).filter(c => c.name?.trim()).map(c => ({
      name: c.name.trim(),
      size: parseInt(c.size) || 30
    }));

    // Demo mode: simulate success, load demo dashboard
    if (!supabase || pending.demo) {
      await new Promise(r => setTimeout(r, 800));
      localStorage.removeItem(pendingKey);
      return {
        success: true,
        needsConfirmation: false,
        adminKey: 'DEMO1234',
        promoCodes: classesPayload.map(c => ({
          class_name: c.name,
          code: Math.random().toString(36).substring(2, 8).toUpperCase()
        })),
        setupComplete: false  // show success screen, don't auto-login
      };
    }

    // Use current session user ID — avoids FK violation if pending.authUserId is stale
    // (happens when auth user was deleted/recreated between test runs)
    const { data: _sd } = await supabase.auth.getSession();
    const authUserId = _sd?.session?.user?.id || pending.authUserId;
    if (!authUserId) return { success: false, error: 'Session expired. Please sign up again.' };

    // Call RPC (SECURITY DEFINER — works without a session)
    const { data: rpcData, error: rpcError } = await supabase.rpc('register_school_complete', {
      p_school_name: pending.schoolName,
      p_country: pending.country,
      p_country_code: pending.countryCode || null,
      p_city: pending.city,
      p_admin_name: pending.adminName,
      p_admin_email: email,
      p_auth_user_id: authUserId,
      p_classes: classesPayload,
      p_plan_id: planId
    });

    if (rpcError) {
      return { success: false, error: 'Setup failed: ' + rpcError.message };
    }
    if (!rpcData?.success) {
      return { success: false, error: rpcData?.error || 'Setup failed. Please try again.' };
    }

    // Save completed state (needed for first-login users record insert)
    const updatedPending = {
      ...pending,
      classes: classesPayload,
      rpcComplete: true,
      schoolId: rpcData.school_id
    };
    localStorage.setItem(pendingKey, JSON.stringify(updatedPending));

    // RPC handles users record (SECURITY DEFINER — no RLS issues)
    // Just need to boot the live session if one exists
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (session) {
      localStorage.removeItem(pendingKey);
      mode = 'live';
      localStorage.setItem('schools_mode', 'live');
      await _loadLiveUserData(session.user);
    }

    return {
      success: true,
      needsConfirmation: !session,
      adminKey: rpcData?.admin_key || null,
      promoCodes: rpcData?.promo_codes || [],
      setupComplete: !!rpcData?.success && !!session
    };
  }

  // ------------------------------------
  // GET COUNTRIES (for signup dropdown)
  // ------------------------------------

  function getCountries() {
    // Always return full world list grouped by region.
    // zone_countries is used for billing only, not for school registration.
    return [
      { group: 'Africa', countries: [
        { country_code: 'DZ', country_name: 'Algeria' },
        { country_code: 'AO', country_name: 'Angola' },
        { country_code: 'BJ', country_name: 'Benin' },
        { country_code: 'BW', country_name: 'Botswana' },
        { country_code: 'BF', country_name: 'Burkina Faso' },
        { country_code: 'BI', country_name: 'Burundi' },
        { country_code: 'CV', country_name: 'Cabo Verde' },
        { country_code: 'CM', country_name: 'Cameroon' },
        { country_code: 'CF', country_name: 'Central African Republic' },
        { country_code: 'TD', country_name: 'Chad' },
        { country_code: 'KM', country_name: 'Comoros' },
        { country_code: 'CG', country_name: 'Congo' },
        { country_code: 'CI', country_name: 'Côte d\'Ivoire' },
        { country_code: 'CD', country_name: 'DR Congo' },
        { country_code: 'DJ', country_name: 'Djibouti' },
        { country_code: 'EG', country_name: 'Egypt' },
        { country_code: 'GQ', country_name: 'Equatorial Guinea' },
        { country_code: 'ER', country_name: 'Eritrea' },
        { country_code: 'SZ', country_name: 'Eswatini' },
        { country_code: 'ET', country_name: 'Ethiopia' },
        { country_code: 'GA', country_name: 'Gabon' },
        { country_code: 'GM', country_name: 'Gambia' },
        { country_code: 'GH', country_name: 'Ghana' },
        { country_code: 'GN', country_name: 'Guinea' },
        { country_code: 'GW', country_name: 'Guinea-Bissau' },
        { country_code: 'KE', country_name: 'Kenya' },
        { country_code: 'LS', country_name: 'Lesotho' },
        { country_code: 'LR', country_name: 'Liberia' },
        { country_code: 'LY', country_name: 'Libya' },
        { country_code: 'MG', country_name: 'Madagascar' },
        { country_code: 'MW', country_name: 'Malawi' },
        { country_code: 'ML', country_name: 'Mali' },
        { country_code: 'MR', country_name: 'Mauritania' },
        { country_code: 'MU', country_name: 'Mauritius' },
        { country_code: 'MA', country_name: 'Morocco' },
        { country_code: 'MZ', country_name: 'Mozambique' },
        { country_code: 'NA', country_name: 'Namibia' },
        { country_code: 'NE', country_name: 'Niger' },
        { country_code: 'NG', country_name: 'Nigeria' },
        { country_code: 'RW', country_name: 'Rwanda' },
        { country_code: 'ST', country_name: 'São Tomé & Príncipe' },
        { country_code: 'SN', country_name: 'Senegal' },
        { country_code: 'SC', country_name: 'Seychelles' },
        { country_code: 'SL', country_name: 'Sierra Leone' },
        { country_code: 'SO', country_name: 'Somalia' },
        { country_code: 'ZA', country_name: 'South Africa' },
        { country_code: 'SS', country_name: 'South Sudan' },
        { country_code: 'SD', country_name: 'Sudan' },
        { country_code: 'TZ', country_name: 'Tanzania' },
        { country_code: 'TG', country_name: 'Togo' },
        { country_code: 'TN', country_name: 'Tunisia' },
        { country_code: 'UG', country_name: 'Uganda' },
        { country_code: 'ZM', country_name: 'Zambia' },
        { country_code: 'ZW', country_name: 'Zimbabwe' },
      ]},
      { group: 'Americas', countries: [
        { country_code: 'AR', country_name: 'Argentina' },
        { country_code: 'BO', country_name: 'Bolivia' },
        { country_code: 'BR', country_name: 'Brazil' },
        { country_code: 'CA', country_name: 'Canada' },
        { country_code: 'CL', country_name: 'Chile' },
        { country_code: 'CO', country_name: 'Colombia' },
        { country_code: 'CU', country_name: 'Cuba' },
        { country_code: 'DO', country_name: 'Dominican Republic' },
        { country_code: 'EC', country_name: 'Ecuador' },
        { country_code: 'GT', country_name: 'Guatemala' },
        { country_code: 'HT', country_name: 'Haiti' },
        { country_code: 'HN', country_name: 'Honduras' },
        { country_code: 'JM', country_name: 'Jamaica' },
        { country_code: 'MX', country_name: 'Mexico' },
        { country_code: 'NI', country_name: 'Nicaragua' },
        { country_code: 'PA', country_name: 'Panama' },
        { country_code: 'PY', country_name: 'Paraguay' },
        { country_code: 'PE', country_name: 'Peru' },
        { country_code: 'TT', country_name: 'Trinidad & Tobago' },
        { country_code: 'US', country_name: 'United States' },
        { country_code: 'UY', country_name: 'Uruguay' },
        { country_code: 'VE', country_name: 'Venezuela' },
      ]},
      { group: 'Asia & Middle East', countries: [
        { country_code: 'AM', country_name: 'Armenia' },
        { country_code: 'AZ', country_name: 'Azerbaijan' },
        { country_code: 'BD', country_name: 'Bangladesh' },
        { country_code: 'KH', country_name: 'Cambodia' },
        { country_code: 'CN', country_name: 'China' },
        { country_code: 'GE', country_name: 'Georgia' },
        { country_code: 'IN', country_name: 'India' },
        { country_code: 'ID', country_name: 'Indonesia' },
        { country_code: 'IR', country_name: 'Iran' },
        { country_code: 'IQ', country_name: 'Iraq' },
        { country_code: 'JP', country_name: 'Japan' },
        { country_code: 'JO', country_name: 'Jordan' },
        { country_code: 'KZ', country_name: 'Kazakhstan' },
        { country_code: 'KW', country_name: 'Kuwait' },
        { country_code: 'LB', country_name: 'Lebanon' },
        { country_code: 'MY', country_name: 'Malaysia' },
        { country_code: 'MN', country_name: 'Mongolia' },
        { country_code: 'MM', country_name: 'Myanmar' },
        { country_code: 'NP', country_name: 'Nepal' },
        { country_code: 'OM', country_name: 'Oman' },
        { country_code: 'PK', country_name: 'Pakistan' },
        { country_code: 'PH', country_name: 'Philippines' },
        { country_code: 'QA', country_name: 'Qatar' },
        { country_code: 'SA', country_name: 'Saudi Arabia' },
        { country_code: 'SG', country_name: 'Singapore' },
        { country_code: 'KR', country_name: 'South Korea' },
        { country_code: 'LK', country_name: 'Sri Lanka' },
        { country_code: 'SY', country_name: 'Syria' },
        { country_code: 'TH', country_name: 'Thailand' },
        { country_code: 'TR', country_name: 'Turkey' },
        { country_code: 'AE', country_name: 'United Arab Emirates' },
        { country_code: 'UZ', country_name: 'Uzbekistan' },
        { country_code: 'VN', country_name: 'Vietnam' },
        { country_code: 'YE', country_name: 'Yemen' },
      ]},
      { group: 'Europe', countries: [
        { country_code: 'AL', country_name: 'Albania' },
        { country_code: 'AT', country_name: 'Austria' },
        { country_code: 'BE', country_name: 'Belgium' },
        { country_code: 'BA', country_name: 'Bosnia & Herzegovina' },
        { country_code: 'BG', country_name: 'Bulgaria' },
        { country_code: 'HR', country_name: 'Croatia' },
        { country_code: 'CY', country_name: 'Cyprus' },
        { country_code: 'CZ', country_name: 'Czech Republic' },
        { country_code: 'DK', country_name: 'Denmark' },
        { country_code: 'EE', country_name: 'Estonia' },
        { country_code: 'FI', country_name: 'Finland' },
        { country_code: 'FR', country_name: 'France' },
        { country_code: 'DE', country_name: 'Germany' },
        { country_code: 'GR', country_name: 'Greece' },
        { country_code: 'HU', country_name: 'Hungary' },
        { country_code: 'IE', country_name: 'Ireland' },
        { country_code: 'IT', country_name: 'Italy' },
        { country_code: 'LV', country_name: 'Latvia' },
        { country_code: 'LT', country_name: 'Lithuania' },
        { country_code: 'LU', country_name: 'Luxembourg' },
        { country_code: 'NL', country_name: 'Netherlands' },
        { country_code: 'NO', country_name: 'Norway' },
        { country_code: 'PL', country_name: 'Poland' },
        { country_code: 'PT', country_name: 'Portugal' },
        { country_code: 'RO', country_name: 'Romania' },
        { country_code: 'RU', country_name: 'Russia' },
        { country_code: 'RS', country_name: 'Serbia' },
        { country_code: 'SK', country_name: 'Slovakia' },
        { country_code: 'SI', country_name: 'Slovenia' },
        { country_code: 'ES', country_name: 'Spain' },
        { country_code: 'SE', country_name: 'Sweden' },
        { country_code: 'CH', country_name: 'Switzerland' },
        { country_code: 'UA', country_name: 'Ukraine' },
        { country_code: 'GB', country_name: 'United Kingdom' },
      ]},
      { group: 'Oceania', countries: [
        { country_code: 'AU', country_name: 'Australia' },
        { country_code: 'FJ', country_name: 'Fiji' },
        { country_code: 'NZ', country_name: 'New Zealand' },
        { country_code: 'PG', country_name: 'Papua New Guinea' },
      ]},
    ];
  }

  // ------------------------------------
  // PASSWORD RESET
  // ------------------------------------

  async function resetPassword(email) {
    // Block demo account — no real Supabase user exists for it
    if (email === DEMO_CREDENTIALS.email) {
      return { success: false, error: 'Password reset is not available in demo mode.' };
    }

    // Build a temporary client if the main one isn't initialised yet
    // (user is on the login screen — no active session, mode is still 'demo')
    const client = supabase ?? (
      typeof window.supabase !== 'undefined' && typeof SUPABASE_CONFIG !== 'undefined'
        ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
        : null
    );

    if (!client) {
      return { success: false, error: 'Service not available. Please try again later.' };
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/schools.html'
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // ------------------------------------
  // RESEND CONFIRMATION EMAIL
  // ------------------------------------

  async function resendConfirmation(email) {
    if (!supabase) return { success: false, error: 'Not available in demo mode.' };
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // ------------------------------------
  // PUBLIC API
  // ------------------------------------

  function hasPendingSetup() { return _pendingSetupEmail; }

  return {
    init,
    login,
    loginWithDemo,
    logout,
    signup,
    completeSetup,
    hasPendingSetup,
    resendConfirmation,
    getCountries,
    resetPassword,
    isAuthenticated,
    getSchoolInfo,
    getGlobalStats,
    getSubjects,
    getSubjectDetail,
    getClassStats,
    searchClass,
    getClasses,
    getSchoolYears,
    submitContribution,
    submitContactMessage,
    savePushSubscription,
    getPlans,
    updateSchoolProfile,
    getRayaResponse,

    get mode() { return mode; },
    get currentSchool() { return _currentSchool; },
    get currentAdmin() { return _currentAdmin; },
    get currentClassYearId() { return _currentClassYearId; },
    get isDemo() { return mode === 'demo'; },
    get isLive() { return mode === 'live'; }
  };
})();

console.log('🗄️ SchoolsDB loaded');
