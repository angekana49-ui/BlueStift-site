// ==========================================
// SCHOOLS.JS - Dashboard Analytics Logic
// Version: Dual Mode (Demo + Live Supabase)
// Dependencies: schools-utils.js, schools-db.js
// ==========================================

// ==========================================
// GLOBAL STATE
// ==========================================

let currentSchool = null;
let selectedClassName = null;
let mockData = null; // Loaded from JSON (demo mode fallback)

// Chart instances (destroyed/recreated on drawer open/close)
let charts = { pkm: null, topics: null, time: null };

// Current data source (populated by SchoolsDB or mock)
let globalData = null;
let classData = null;

// ==========================================
// DATA LOADING
// ==========================================

async function loadMockData() {
  try {
    const response = await fetch('schools-data.json');
    mockData = await response.json();
    console.log('📦 Mock data loaded from JSON');
    return mockData;
  } catch (error) {
    console.error('Failed to load mock data:', error);
    return null;
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏫 Schools Dashboard loading...');

  // ALWAYS show login first — no exceptions
  showLoginOverlay();
  initLoginForm();

  // Init SchoolsDB in background (never blocks UI)
  if (typeof SchoolsDB !== 'undefined') {
    try {
      await SchoolsDB.init();
    } catch (e) {
      console.warn('⚠️ SchoolsDB init failed (non-blocking):', e.message);
    }
  }

  // Check if already authenticated (auto-login from previous session)
  let isAuth = false;
  if (typeof SchoolsDB !== 'undefined') {
    try {
      isAuth = await SchoolsDB.isAuthenticated();
    } catch (e) {
      // Supabase unreachable — check localStorage fallback
      isAuth = localStorage.getItem('schools_authenticated') === 'true';
    }
  } else {
    isAuth = localStorage.getItem('schools_authenticated') === 'true';
  }

  if (isAuth) {
    // Check if pilot expired while restoring session
    if (window._pilotExpired) {
      showPilotExpiredMessage(window._pilotExpired.pilotUntil);
      return;
    }
    hideLoginOverlay();
    await bootDashboard();
  }
});

// ==========================================
// LOGIN OVERLAY
// ==========================================

const REMEMBER_KEY = 'schools_remember_email';
const DEMO_CREDENTIALS = { email: 'admin@test.com', password: 'Test1234!' };

function showLoginOverlay() {
  const overlay = document.getElementById('login-overlay');
  const dashboard = document.getElementById('dashboard-container');
  if (overlay) overlay.style.display = 'flex';
  if (dashboard) dashboard.style.display = 'none';
}

function hideLoginOverlay() {
  const overlay = document.getElementById('login-overlay');
  const dashboard = document.getElementById('dashboard-container');
  if (overlay) overlay.style.display = 'none';
  if (dashboard) dashboard.style.display = '';
}

function initLoginForm() {
  // Load remembered email
  const remembered = localStorage.getItem(REMEMBER_KEY);
  if (remembered) {
    document.getElementById('login-email').value = remembered;
    document.getElementById('login-remember').checked = true;
    document.getElementById('login-password').focus();
  } else {
    document.getElementById('login-email').focus();
  }

  document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
  document.getElementById('login-email').addEventListener('input', clearLoginError);
  document.getElementById('login-password').addEventListener('input', clearLoginError);

  // Login → Signup step 1
  document.getElementById('show-signup-link').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthView('signup');
  });
  // Signup step 1 → Login
  document.getElementById('show-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthView('login');
  });
  // Login → Forgot
  document.getElementById('login-forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthView('forgot');
    const loginEmail = document.getElementById('login-email').value.trim();
    if (loginEmail) document.getElementById('forgot-email').value = loginEmail;
  });
  // Forgot → Login
  document.getElementById('back-to-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthView('login');
  });

  // Signup step 1 form (Next button)
  document.getElementById('signup-form-step1').addEventListener('submit', handleSignupStep1Next);

  // Signup step 2 buttons
  document.getElementById('btn-add-class').addEventListener('click', () => addClassRow('', 30));
  document.getElementById('signup-btn').addEventListener('click', handleSignupFinalSubmit);
  document.getElementById('signup-back-link').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthView('signup');
  });

  // Success → Login
  document.getElementById('goto-login-btn').addEventListener('click', () => {
    const email = document.getElementById('signup-email')?.value?.trim() || '';
    showAuthView('login');
    if (email) document.getElementById('login-email').value = email;
    document.getElementById('login-password').focus();
  });

  // Country dropdown (synchronous)
  loadCountryDropdown();

  // Add one empty class row to step 2 by default
  addClassRow('', 30);

  // Forgot form
  document.getElementById('forgot-form').addEventListener('submit', handleForgotSubmit);

  // Apply default language
  setOverlayLang('en');

  // Show Try Demo button only if ?demo=true in URL
  if (new URLSearchParams(window.location.search).get('demo') === 'true') {
    const demoHint = document.getElementById('demo-hint');
    if (demoHint) demoHint.style.display = '';
  }

  document.getElementById('btn-try-demo')?.addEventListener('click', async () => {
    clearLoginError();
    const loginBtn = document.getElementById('login-btn');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading demo...</span>';

    const result = typeof SchoolsDB !== 'undefined'
      ? await SchoolsDB.loginWithDemo()
      : { success: false, error: 'Demo not available.' };

    if (result.success) {
      loginBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Demo loaded!</span>';
      loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(async () => { hideLoginOverlay(); await bootDashboard(); }, 600);
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span data-i18n="btn_signin">Sign In</span>';
      loginBtn.style.background = '';
      showLoginError(result.error || 'Demo login failed.');
    }
  });
}

function showAuthView(view) {
  clearLoginError();
  const authBox = document.getElementById('auth-box');

  document.getElementById('login-view').style.display       = view === 'login'          ? '' : 'none';
  document.getElementById('signup-step1').style.display     = view === 'signup'          ? '' : 'none';
  document.getElementById('signup-step2').style.display     = view === 'signup-step2'    ? '' : 'none';
  document.getElementById('signup-success').style.display   = view === 'signup-success'  ? '' : 'none';
  document.getElementById('forgot-view').style.display      = view === 'forgot'          ? '' : 'none';

  // Make tall views scrollable
  const tallViews = ['signup', 'signup-step2'];
  if (authBox) {
    authBox.style.maxHeight = tallViews.includes(view) ? '88vh' : '';
    authBox.style.overflowY = tallViews.includes(view) ? 'auto' : '';
  }

  // Sync subtitle i18n key and re-apply current language
  const subtitle = document.getElementById('auth-subtitle');
  if (subtitle) {
    const keyMap = {
      login: 'subtitle_login',
      signup: 'subtitle_signup',
      'signup-step2': 'subtitle_classes',
      'signup-success': 'subtitle_success',
      forgot: 'subtitle_forgot'
    };
    subtitle.setAttribute('data-i18n', keyMap[view] || 'subtitle_login');
    if (window._overlayLang) setOverlayLang(window._overlayLang);
  }
}

function loadCountryDropdown() {
  const select = document.getElementById('signup-country');
  if (!select) return;

  const grouped = (typeof SchoolsDB !== 'undefined') ? SchoolsDB.getCountries() : [];

  if (!grouped.length) {
    // Minimal fallback
    [
      { country_code: 'CM', country_name: 'Cameroon' },
      { country_code: 'FR', country_name: 'France' },
      { country_code: 'SN', country_name: 'Senegal' },
      { country_code: 'US', country_name: 'United States' }
    ].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.country_code;
      opt.textContent = c.country_name;
      select.appendChild(opt);
    });
    return;
  }

  grouped.forEach(({ group, countries }) => {
    const grp = document.createElement('optgroup');
    grp.label = group;
    countries.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.country_code;
      opt.textContent = c.country_name;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  });
}

// ----- Step 1: Validate school info + credentials, advance to step 2 -----
async function handleSignupStep1Next(e) {
  e.preventDefault();
  clearLoginError();

  const schoolName = document.getElementById('signup-school-name').value.trim();
  const countryCode = document.getElementById('signup-country').value;
  const countryName = document.getElementById('signup-country').selectedOptions[0]?.textContent || '';
  const city = document.getElementById('signup-city').value.trim();
  const adminName = document.getElementById('signup-admin-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const nextBtn = document.getElementById('signup-next-btn');
  const authBox = document.getElementById('auth-box');

  if (!schoolName || !countryCode || !city || !adminName || !email || !password) {
    showLoginError('Please fill in all required fields.');
    authBox.classList.add('shake');
    setTimeout(() => authBox.classList.remove('shake'), 400);
    return;
  }

  if (password.length < 8) {
    showLoginError('Password must be at least 8 characters.');
    return;
  }

  if (password !== confirmPassword) {
    showLoginError('Passwords do not match.');
    document.getElementById('signup-confirm-password').focus();
    return;
  }

  // Create auth user
  nextBtn.disabled = true;
  nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Creating account...</span>';

  let result;
  if (typeof SchoolsDB !== 'undefined') {
    result = await SchoolsDB.signup({ schoolName, country: countryName, countryCode, city, adminName, email, password });
  } else {
    await new Promise(r => setTimeout(r, 1000));
    result = { success: false, error: 'Account creation is not available in demo mode.' };
  }

  nextBtn.disabled = false;
  nextBtn.innerHTML = '<i class="fas fa-user-plus"></i> <span data-i18n="btn_create">Create Account</span>';

  if (result.success) {
    showAuthView('signup-step2');
  } else {
    showLoginError(result.error || 'Signup failed. Please try again.');
    authBox.classList.add('shake');
    setTimeout(() => authBox.classList.remove('shake'), 400);
  }
}

// ----- Step 2 helpers -----
function addClassRow(name, size) {
  const list = document.getElementById('classes-list');
  if (!list) return;

  const row = document.createElement('div');
  row.className = 'class-item';
  row.innerHTML = `
    <div class="input-wrapper" style="flex:1">
      <input type="text" class="form-input class-name-input" placeholder="e.g. Grade 10" value="${name || ''}" style="padding-left:12px">
    </div>
    <div class="input-wrapper" style="width:80px">
      <input type="number" class="form-input class-size-input" placeholder="30" value="${size || 30}" min="1" max="200" style="padding-left:8px;text-align:center">
    </div>
    <button type="button" class="btn-remove-class" title="Remove" onclick="this.closest('.class-item').remove()">
      <i class="fas fa-times"></i>
    </button>`;
  list.appendChild(row);
}

// ----- Step 2: Collect classes + complete school setup -----
async function handleSignupFinalSubmit() {
  clearLoginError();

  const rows = document.querySelectorAll('#classes-list .class-item');
  const classes = [];
  rows.forEach(row => {
    const name = row.querySelector('.class-name-input')?.value?.trim();
    const size = parseInt(row.querySelector('.class-size-input')?.value) || 30;
    if (name) classes.push({ name, size });
  });

  const email   = document.getElementById('signup-email').value.trim();
  const planId  = document.querySelector('input[name="signup-plan"]:checked')?.value || 'b2b_standard';
  const signupBtn = document.getElementById('signup-btn');
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Setting up...</span>';

  let result;
  if (typeof SchoolsDB !== 'undefined') {
    result = await SchoolsDB.completeSetup({ email, classes, planId });
  } else {
    await new Promise(r => setTimeout(r, 1000));
    result = { success: false, error: 'Not available in demo mode.' };
  }

  signupBtn.disabled = false;
  signupBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span data-i18n="btn_complete">Complete Setup</span>';

  if (result.success) {
    if (result.setupComplete && !result.needsConfirmation) {
      // Session ready + setup done — go directly to dashboard
      setTimeout(() => {
        hideLoginOverlay();
        bootDashboard();
      }, 500);
    } else {
      // Email confirmation pending — show success screen
      _showSignupSuccess(result, email, false);
    }
  } else {
    showLoginError(result.error || 'Setup failed. Please try again.');
    const authBox = document.getElementById('auth-box');
    authBox.classList.add('shake');
    setTimeout(() => authBox.classList.remove('shake'), 400);
  }
}

// ----- Show success screen -----
function _showSignupSuccess(result, email, fromFirstLogin) {
  // Title + icon: differ based on confirmation state
  const titleEl = document.querySelector('#signup-success h3');
  const iconEl  = document.querySelector('#signup-success .success-icon-wrap i');
  if (result.needsConfirmation) {
    if (titleEl) titleEl.textContent = 'Check your inbox';
    if (iconEl)  { iconEl.className = 'fas fa-envelope-open-text'; iconEl.style.color = '#667eea'; }
  } else {
    if (titleEl) titleEl.textContent = 'Account ready!';
    if (iconEl)  iconEl.className = 'fas fa-check-circle';
  }

  // Message
  const msgEl = document.getElementById('signup-success-msg');
  if (msgEl) {
    msgEl.textContent = result.needsConfirmation
      ? `We sent a confirmation link to ${email}. Click it to activate your account, then come back to sign in.`
      : 'Your school is set up and ready to go.';
  }

  // Admin key
  const adminKeyBlock = document.getElementById('admin-key-block');
  const adminKeyValue = document.getElementById('admin-key-value');
  if (result.adminKey && adminKeyBlock && adminKeyValue) {
    adminKeyValue.textContent = result.adminKey;
    adminKeyBlock.style.display = '';
  }

  // Promo codes
  const promoBlock = document.getElementById('promo-codes-block');
  const promoList = document.getElementById('promo-codes-list');
  if (result.promoCodes?.length && promoBlock && promoList) {
    promoList.innerHTML = '';
    result.promoCodes.forEach(pc => {
      const item = document.createElement('div');
      item.className = 'promo-code-item';
      item.innerHTML = `
        <span class="promo-class-name">${pc.class_name || 'Class'}</span>
        <span class="promo-code-value">${pc.code}</span>`;
      promoList.appendChild(item);
    });
    promoBlock.style.display = '';
  }

  // Button label change for first-login case
  const gotoBtn = document.getElementById('goto-login-btn');
  if (gotoBtn && fromFirstLogin) {
    gotoBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> <span>Go to Dashboard</span>';
    gotoBtn.onclick = () => {
      hideLoginOverlay();
      bootDashboard();
    };
  }

  showAuthView('signup-success');
}

async function handleForgotSubmit(e) {
  e.preventDefault();
  clearLoginError();

  const email = document.getElementById('forgot-email').value.trim();
  const forgotBtn = document.getElementById('forgot-btn');

  if (!email) {
    showLoginError('Please enter your email address.');
    return;
  }

  forgotBtn.disabled = true;
  forgotBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

  let result;
  if (typeof SchoolsDB !== 'undefined') {
    result = await SchoolsDB.resetPassword(email);
  } else {
    await new Promise(r => setTimeout(r, 1000));
    result = { success: false, error: 'Password reset is not available in demo mode.' };
  }

  if (result.success) {
    forgotBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Email Sent!</span>';
    forgotBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    showLoginError('If an account exists with this email, you will receive a reset link shortly.');
    document.getElementById('login-error-message').style.background = '#f0fdf4';
    document.getElementById('login-error-message').style.borderColor = '#86efac';
    document.getElementById('login-error-message').style.color = '#16a34a';

    setTimeout(() => {
      showAuthView('login');
      forgotBtn.disabled = false;
      forgotBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Reset Link</span>';
      forgotBtn.style.background = '';
    }, 3000);
  } else {
    showLoginError(result.error || 'Failed to send reset email.');
    forgotBtn.disabled = false;
    forgotBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Reset Link</span>';
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;
  const loginBtn = document.getElementById('login-btn');
  const authBox = document.getElementById('auth-box');

  if (!email || !password) {
    showLoginError('Please fill in all fields.');
    authBox.classList.add('shake');
    setTimeout(() => authBox.classList.remove('shake'), 400);
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing in...</span>';

  let result;

  if (typeof SchoolsDB !== 'undefined') {
    result = await SchoolsDB.login(email, password);
  } else {
    // Pure fallback: mock only
    await new Promise(r => setTimeout(r, 1000));
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem('schools_authenticated', 'true');
      localStorage.setItem('schools_auth_email', email);
      result = { success: true, mode: 'demo' };
    } else {
      result = { success: false, error: 'Invalid email or password.' };
    }
  }

  if (result.success) {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    const modeLabel = result.mode === 'live' ? 'Live' : 'Demo';
    loginBtn.innerHTML = `<i class="fas fa-check-circle"></i> <span>Success! (${modeLabel})</span>`;
    loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    console.log(`✅ Login successful [${modeLabel} mode]`);

    // First login after email confirmation — show success screen with codes
    if (result.firstLogin) {
      setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
        loginBtn.style.background = '';
        _showSignupSuccess(result, email, true);
      }, 600);
      return;
    }

    // Normal login — boot dashboard
    setTimeout(async () => {
      hideLoginOverlay();
      await bootDashboard();
    }, 600);
  } else {
    if (result.pilotExpired) {
      showPilotExpiredMessage(result.pilotUntil);
    } else {
      showLoginError(result.error || 'Invalid email or password.');
    }
    authBox.classList.add('shake');
    setTimeout(() => authBox.classList.remove('shake'), 400);
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
    loginBtn.style.background = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function showPilotExpiredMessage(pilotUntil) {
  const dateStr = new Date(pilotUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const el   = document.getElementById('login-error-message');
  const text = document.getElementById('login-error-text');
  if (text) text.innerHTML = `Your pilot access expired on <strong>${dateStr}</strong>. <a href="mailto:russel@thebluestift.com?subject=Subscription%20Renewal" style="color:inherit;text-decoration:underline;">Contact us to subscribe →</a>`;
  if (el) {
    el.style.display = 'block';
    el.style.background    = 'rgba(245,158,11,0.15)';
    el.style.borderColor   = 'rgba(245,158,11,0.4)';
    el.style.color         = '#f59e0b';
  }
}

function showLoginError(message) {
  const el = document.getElementById('login-error-message');
  const text = document.getElementById('login-error-text');
  if (text) text.textContent = message;
  if (el) el.style.display = 'block';
}

function clearLoginError() {
  const el = document.getElementById('login-error-message');
  if (el) el.style.display = 'none';
}

// ==========================================
// OVERLAY I18N (EN / FR)
// ==========================================

const OVERLAY_I18N = {
  en: {
    subtitle_login:   'Schools Dashboard',
    subtitle_signup:  'Create Your Account',
    subtitle_classes: 'Set Up Your Classes',
    subtitle_success: 'Account Created!',
    subtitle_forgot:  'Reset Password',
    label_email:      'Email Address',
    label_password:   'Password',
    label_confirm:    'Confirm',
    label_school_name:'School Name',
    label_country:    'Country',
    label_city:       'City',
    label_full_name:  'Your Full Name',
    ph_email:         'admin@school.edu',
    ph_login_password:'Enter your password',
    ph_password:      'Min. 8 characters',
    ph_confirm:       'Repeat password',
    ph_school_name:   'e.g. Sunrise International School',
    ph_city:          'e.g. Nairobi',
    ph_admin_name:    'e.g. Amara Diallo',
    select_country:   'Select country...',
    remember_me:      'Remember me',
    forgot_link:      'Forgot password?',
    btn_signin:       'Sign In',
    btn_create:       'Create Account',
    btn_complete:     'Complete Setup',
    btn_add_class:    'Add a Class',
    btn_reset:        'Send Reset Link',
    btn_goto_signin:  'Go to Sign In',
    no_account:       "Don't have an account?",
    create_one:       'Create one',
    have_account:     'Already have an account?',
    signin_link:      'Sign In',
    back_link:        '← Back',
    back_signin:      '← Back to Sign In',
    step_school_info: 'School Info',
    step_classes:     'Classes',
    classes_hint:     'Add your classes — students will use these codes to join.',
    success_title:    'Account Created!',
    admin_key_label:  'Your School Admin Key',
    admin_key_hint:   'Save this — it uniquely identifies your school.',
    promo_title:      'Class Registration Codes',
    promo_hint:       'Share each code with students of the corresponding class.',
    forgot_desc:      "Enter your email address and we'll send you a link to reset your password.",
    footer_help:      'Need help?',
    creating:         'Creating...',
  },
  fr: {
    subtitle_login:   'Tableau de Bord Écoles',
    subtitle_signup:  'Créer Votre Compte',
    subtitle_classes: 'Configurer Vos Classes',
    subtitle_success: 'Compte Créé !',
    subtitle_forgot:  'Réinitialiser le Mot de Passe',
    label_email:      'Adresse e-mail',
    label_password:   'Mot de passe',
    label_confirm:    'Confirmer',
    label_school_name:'Nom de l\'école',
    label_country:    'Pays',
    label_city:       'Ville',
    label_full_name:  'Votre nom complet',
    ph_email:         'admin@ecole.edu',
    ph_login_password:'Entrez votre mot de passe',
    ph_password:      'Min. 8 caractères',
    ph_confirm:       'Répétez le mot de passe',
    ph_school_name:   'ex. École Internationale du Soleil',
    ph_city:          'ex. Douala',
    ph_admin_name:    'ex. Amara Diallo',
    select_country:   'Sélectionnez un pays...',
    remember_me:      'Se souvenir de moi',
    forgot_link:      'Mot de passe oublié ?',
    btn_signin:       'Se Connecter',
    btn_create:       'Créer le Compte',
    btn_complete:     'Terminer la Configuration',
    btn_add_class:    'Ajouter une Classe',
    btn_reset:        'Envoyer le Lien',
    btn_goto_signin:  'Aller à la Connexion',
    no_account:       'Pas encore de compte ?',
    create_one:       'Créer un compte',
    have_account:     'Vous avez déjà un compte ?',
    signin_link:      'Se Connecter',
    back_link:        '← Retour',
    back_signin:      '← Retour à la Connexion',
    step_school_info: 'Infos École',
    step_classes:     'Classes',
    classes_hint:     'Ajoutez vos classes — les élèves utiliseront ces codes pour rejoindre.',
    success_title:    'Compte Créé !',
    admin_key_label:  'Clé Administrateur de l\'École',
    admin_key_hint:   'Conservez-la — elle identifie votre école de façon unique.',
    promo_title:      'Codes d\'Inscription aux Classes',
    promo_hint:       'Partagez chaque code avec les élèves de la classe correspondante.',
    forgot_desc:      'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
    footer_help:      'Besoin d\'aide ?',
    creating:         'Création...',
  }
};

function setOverlayLang(lang) {
  window._overlayLang = lang;
  const t = OVERLAY_I18N[lang] || OVERLAY_I18N.en;
  const overlay = document.getElementById('login-overlay');
  if (!overlay) return;

  // Update text content
  overlay.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update placeholders
  overlay.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Toggle active button
  const btnEn = document.getElementById('lang-en');
  const btnFr = document.getElementById('lang-fr');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnFr) btnFr.classList.toggle('active', lang === 'fr');
}

// ==========================================
// DASHBOARD BOOT (after auth)
// ==========================================

async function bootDashboard() {
  const mode = (typeof SchoolsDB !== 'undefined') ? SchoolsDB.mode : 'demo';
  console.log(`📡 Mode: ${mode.toUpperCase()}`);

  // 1. ALWAYS init UI first — menus, drawer, events work regardless of data
  try {
    initEventListeners();
    fixStickyHeaders();
  } catch (e) {
    console.error('❌ UI init error (non-fatal):', e.message);
  }

  try {
    if (window.SchoolsUtils) {
      window.SchoolsUtils.updateCurrentDate();
      window.SchoolsUtils.initLanguageSelector();
      window.SchoolsUtils.applyStoredLanguage();
    }
  } catch (e) {
    console.warn('⚠️ SchoolsUtils error:', e.message);
  }

  // 2. Load data (demo = mock JSON, live = Supabase)
  if (mode === 'demo' || typeof SchoolsDB === 'undefined') {
    await loadMockData();
    if (!mockData) {
      console.error('❌ Failed to load mock data from schools-data.json');
      showDashboardError('Failed to load demo data. Make sure you are using a local server (not file://).');
      return;
    }
  }

  // 3. Populate UI with data
  try {
    await loadSchoolData();
    await populateYearSelector();
  } catch (e) {
    console.error('❌ Data loading error:', e);
    showDashboardError('Error loading dashboard data: ' + e.message);
  }

  console.log('✅ Schools Dashboard ready!');
}

function showDashboardError(message) {
  const section = document.getElementById('section-dashboard');
  if (section) {
    const banner = document.createElement('div');
    banner.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:16px 20px;border-radius:12px;margin:20px;font-size:0.95rem;';
    banner.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right:8px;"></i>' + message;
    section.prepend(banner);
  }
}

// ==========================================
// STICKY HEADERS FIX
// ==========================================

function fixStickyHeaders() {
  const header = document.querySelector('#dashboard-container > header');
  const subHeaderAdmin = document.querySelector('.sub-header-admin');
  const subHeaderNav = document.querySelector('.sub-header-nav');

  if (!header || !subHeaderAdmin || !subHeaderNav) return;

  function updatePositions() {
    const headerHeight = header.offsetHeight;
    const adminHeight = subHeaderAdmin.offsetHeight;

    subHeaderAdmin.style.top = headerHeight + 'px';
    subHeaderNav.style.top = (headerHeight + adminHeight) + 'px';
  }

  updatePositions();
  window.addEventListener('resize', updatePositions);
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

async function loadSchoolData() {
  if (typeof SchoolsDB !== 'undefined') {
    currentSchool = await SchoolsDB.getSchoolInfo();
  } else {
    currentSchool = { ...mockData.school };
  }

  if (!currentSchool) return;

  // Update UI
  document.getElementById('school-name').textContent = currentSchool.name;
  document.getElementById('admin-name').textContent = currentSchool.adminName || 'Admin';
  document.getElementById('plan-type').textContent = currentSchool.planType;
  document.getElementById('expiry-date').textContent = window.SchoolsUtils?.formatDate(currentSchool.expiryDate) || currentSchool.expiryDate;
  document.getElementById('raya-messages-left').textContent = currentSchool.rayaMessagesLeft;
  document.getElementById('raya-count').textContent = currentSchool.rayaMessagesLeft;
  document.getElementById('contributions-left').textContent = '∞'; // Unlimited contributions

  await loadGlobalData();
}

async function loadGlobalData() {
  let data;

  if (typeof SchoolsDB !== 'undefined') {
    data = await SchoolsDB.getGlobalStats();
  } else {
    data = mockData.global;
  }

  globalData = data;

  document.getElementById('stat-students').textContent = (data.students || 0).toLocaleString('en-US');
  document.getElementById('stat-pkm').textContent = (data.pkm || 0).toFixed(2);
  document.getElementById('stat-time').textContent = data.avgTime || 'N/A';
  document.getElementById('stat-completion').textContent = data.completion || 'N/A';
  document.getElementById('stat-streak').textContent = `${data.avgStreak || 0} days`;
  document.getElementById('stat-lessons').textContent = (data.lessonsCompleted || 0).toLocaleString('en-US');

  document.getElementById('selected-class-text').textContent = 'Global view - Entire school';
  populateSubjectsTable(data.subjects || [], true);
}

async function loadClassData() {
  if (!isClassSelected()) {
    await loadGlobalData();
    return;
  }

  let data;

  if (typeof SchoolsDB !== 'undefined' && SchoolsDB.currentClassYearId) {
    data = await SchoolsDB.getClassStats(SchoolsDB.currentClassYearId);
  } else if (typeof SchoolsDB !== 'undefined' && SchoolsDB.isDemo) {
    data = await SchoolsDB.getClassStats(null);
  } else {
    data = mockData.class;
  }

  classData = data;

  document.getElementById('stat-students').textContent = (data.students || 0).toLocaleString('en-US');
  document.getElementById('stat-pkm').textContent = (data.pkm || 0).toFixed(2);
  document.getElementById('stat-time').textContent = data.avgTime || 'N/A';
  document.getElementById('stat-completion').textContent = data.completion || 'N/A';
  document.getElementById('stat-streak').textContent = `${data.avgStreak || 0} days`;
  document.getElementById('stat-lessons').textContent = (data.lessonsCompleted || 0).toLocaleString('en-US');

  updateClassDisplay();
  populateSubjectsTable(data.subjects || [], false);
}

function populateSubjectsTable(subjects, isGlobal = false) {
  const tbody = document.getElementById('subjects-tbody');
  tbody.innerHTML = '';

  subjects.forEach(subject => {
    const row = document.createElement('tr');
    const pkmClass = subject.pkm >= 0.75 ? 'high' : subject.pkm >= 0.65 ? 'medium' : 'low';
    const effortClass = subject.effort;

    row.innerHTML = `
      <td>
        <span class="subject-name">
          <i class="fas fa-${subject.icon}"></i>
          ${subject.name}
        </span>
      </td>
      <td><span class="pkm-badge ${pkmClass}">${subject.pkm.toFixed(2)}</span></td>
      <td>${subject.difficulty}</td>
      <td>
        <span class="effort-badge ${effortClass}">
          ${effortClass === 'high' ? 'High' : effortClass === 'medium' ? 'Medium' : 'Low'}
        </span>
      </td>
      <td>
        <button class="btn-view-details" data-subject="${subject.name}" data-global="${isGlobal}">
          <i class="fas fa-eye"></i> Details
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const subjectName = btn.getAttribute('data-subject');
      const isGlobalView = btn.getAttribute('data-global') === 'true';
      showSubjectDetails(subjectName, isGlobalView);
    });
  });
}

function showSubjectDetails(subjectName, isGlobal = false) {
  const dataSource = isGlobal ? globalData : classData;
  if (!dataSource) return;

  const subject = dataSource.subjects.find(s => s.name === subjectName);
  if (!subject) return;

  // Open the drawer
  openInsightsDrawer(subject, isGlobal);
}

// ==========================================
// INSIGHTS DRAWER
// ==========================================

function openInsightsDrawer(subject, isGlobal = false) {
  const drawer = document.getElementById('insights-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!drawer || !overlay) return;

  // Store subject data for charts (lazy init on Analytics tab)
  drawer.dataset.currentSubject = JSON.stringify(subject);
  drawer.dataset.isGlobal = String(isGlobal);

  // Destroy previous charts
  destroyAllCharts();

  const details = subject.details;
  const pkmPercent = Math.round(subject.pkm * 100);
  const level = subject.pkm >= 0.75 ? 'High' : subject.pkm >= 0.65 ? 'Medium' : 'Low';
  const levelClass = level.toLowerCase();

  // Populate header
  document.getElementById('drawer-subject-name').textContent = subject.name;
  document.getElementById('drawer-class-name').textContent = isGlobal ? 'Entire school' : getSelectedClassDisplay();

  // Populate PKM card
  document.getElementById('drawer-pkm-value').textContent = subject.pkm.toFixed(2);
  document.getElementById('pkm-circle').style.setProperty('--pkm-percent', pkmPercent);

  const pkmLevelEl = document.getElementById('drawer-pkm-level');
  pkmLevelEl.textContent = level;
  pkmLevelEl.className = 'pkm-level ' + levelClass;

  // Populate stats
  document.getElementById('drawer-stat-effort').textContent = details.effortLevel;

  // Populate difficulties
  const difficultiesList = document.getElementById('drawer-difficulties');
  difficultiesList.innerHTML = details.difficulties.map(d =>
    `<li><i class="fas fa-times-circle"></i><span>${d}</span></li>`
  ).join('');

  // Populate mastered
  const masteredList = document.getElementById('drawer-mastered');
  masteredList.innerHTML = details.mastered.map(m =>
    `<li><i class="fas fa-check-circle"></i><span>${m}</span></li>`
  ).join('');

  // Populate recommendations
  const recommendationsList = document.getElementById('drawer-recommendations');
  recommendationsList.innerHTML = details.recommendations.map(r =>
    `<li><i class="fas fa-lightbulb"></i><span>${r}</span></li>`
  ).join('');

  // Reset to overview tab
  document.querySelectorAll('.drawer-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.drawer-tab-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelector('.drawer-tab[data-tab="overview"]').classList.add('active');
  document.getElementById('panel-overview').classList.add('active');

  // Show drawer
  overlay.classList.add('active');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeInsightsDrawer() {
  const drawer = document.getElementById('insights-drawer');
  const overlay = document.getElementById('drawer-overlay');

  // Destroy charts to free memory
  destroyAllCharts();

  if (drawer) drawer.classList.remove('open', 'fullscreen');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleDrawerFullscreen() {
  const drawer = document.getElementById('insights-drawer');
  const btn = document.getElementById('btn-drawer-fullscreen');

  if (drawer) {
    drawer.classList.toggle('fullscreen');
    if (btn) {
      const icon = btn.querySelector('i');
      if (drawer.classList.contains('fullscreen')) {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
      } else {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
      }
    }
  }
}

function initDrawer() {
  // Close button
  document.getElementById('btn-drawer-close')?.addEventListener('click', closeInsightsDrawer);

  // Overlay click to close
  document.getElementById('drawer-overlay')?.addEventListener('click', closeInsightsDrawer);

  // Fullscreen toggle
  document.getElementById('btn-drawer-fullscreen')?.addEventListener('click', toggleDrawerFullscreen);

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('insights-drawer');
      if (drawer?.classList.contains('open')) {
        closeInsightsDrawer();
      }
    }
  });

  // Tab switching
  document.querySelectorAll('.drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');

      // Update active tab
      document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      document.querySelectorAll('.drawer-tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tabName)?.classList.add('active');

      // Lazy-init charts when Analytics tab is opened
      if (tabName === 'analytics') {
        initAnalyticsCharts();
      }
    });
  });

  // Chart period buttons - regenerate PKM chart on period change
  document.querySelectorAll('.chart-period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const drawer = document.getElementById('insights-drawer');
      if (drawer?.dataset.currentSubject) {
        const subject = JSON.parse(drawer.dataset.currentSubject);
        initPKMChart(subject.pkm, btn.dataset.period);
      }
    });
  });

  // Simulation sliders
  const sliders = [
    { id: 'sim-study-time', valId: 'sim-study-time-val' },
    { id: 'sim-intervention', valId: 'sim-intervention-val' },
    { id: 'sim-collaboration', valId: 'sim-collaboration-val' }
  ];

  sliders.forEach(({ id, valId }) => {
    const slider = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (slider && valEl) {
      slider.addEventListener('input', () => {
        valEl.textContent = slider.value;
      });
    }
  });

  // Run simulation button
  document.getElementById('btn-run-simulation')?.addEventListener('click', () => {
    const studyTime = parseInt(document.getElementById('sim-study-time')?.value || 20);
    const intervention = parseInt(document.getElementById('sim-intervention')?.value || 50);
    const collaboration = parseInt(document.getElementById('sim-collaboration')?.value || 30);

    // Simple mock calculation
    const improvement = Math.round((studyTime * 0.3 + intervention * 0.4 + collaboration * 0.3) / 5);
    const confidence = Math.min(95, 70 + Math.round((studyTime + intervention + collaboration) / 10));

    const resultEl = document.getElementById('simulation-results');
    const outcomeEl = document.getElementById('simulation-outcome');

    if (resultEl && outcomeEl) {
      outcomeEl.innerHTML = `Based on the parameters, the estimated PKM improvement is <strong>+${improvement}%</strong> over the next 8 weeks, with a confidence interval of ${confidence}%.`;
      resultEl.style.display = 'block';
    }
  });

  // Footer buttons
  document.getElementById('btn-drawer-export')?.addEventListener('click', () => {
    window.SchoolsUtils?.showSchoolNotification('Exporting insights to PDF...', 'info');
  });

  document.getElementById('btn-drawer-share')?.addEventListener('click', () => {
    window.SchoolsUtils?.showSchoolNotification('Share link copied to clipboard!', 'success');
  });
}

// ==========================================
// CHARTS - Analytics Tab Visualizations
// ==========================================

const CHART_COLORS = ['#667eea', '#8b5cf6', '#ec4899', '#fb923c', '#22c55e', '#3b82f6'];

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.8)',
        font: { family: 'Inter', size: 12 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(18, 18, 31, 0.95)',
      titleColor: '#ffffff',
      bodyColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(102, 126, 234, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'Inter' }
    }
  }
};

function generatePKMTimeSeries(currentPKM, period) {
  const configs = {
    week:  { count: 7,  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    month: { count: 4,  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    year:  { count: 12, labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
  };
  const cfg = configs[period] || configs.week;
  const startPKM = Math.max(0.1, currentPKM - 0.12);
  const step = (currentPKM - startPKM) / (cfg.count - 1);
  const data = [];

  for (let i = 0; i < cfg.count; i++) {
    const base = startPKM + step * i;
    const noise = (Math.random() - 0.5) * 0.04;
    data.push(parseFloat(Math.max(0, Math.min(1, base + noise)).toFixed(3)));
  }
  data[data.length - 1] = currentPKM; // ensure last point is exact

  return { labels: cfg.labels, data };
}

function initPKMChart(currentPKM, period) {
  const canvas = document.getElementById('chart-pkm-evolution');
  if (!canvas) return;

  if (charts.pkm) charts.pkm.destroy();

  const series = generatePKMTimeSeries(currentPKM, period);
  const ctx = canvas.getContext('2d');

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.35)');
  gradient.addColorStop(1, 'rgba(102, 126, 234, 0.02)');

  charts.pkm = new Chart(ctx, {
    type: 'line',
    data: {
      labels: series.labels,
      datasets: [{
        label: 'PKM Score',
        data: series.data,
        borderColor: '#667eea',
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 1,
          ticks: {
            color: 'rgba(255,255,255,0.6)',
            font: { family: 'Inter', size: 11 },
            callback: v => v.toFixed(2),
            stepSize: 0.2
          },
          grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false }
        },
        x: {
          ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

function initTopicsChart(subjects) {
  const canvas = document.getElementById('chart-topics');
  if (!canvas) return;

  if (charts.topics) charts.topics.destroy();

  const sorted = [...subjects].sort((a, b) => b.pkm - a.pkm);

  charts.topics = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: sorted.map(s => s.name),
      datasets: [{
        label: 'PKM',
        data: sorted.map(s => s.pkm),
        backgroundColor: sorted.map(s =>
          s.pkm >= 0.75 ? 'rgba(16,185,129,0.75)' :
          s.pkm >= 0.65 ? 'rgba(251,191,36,0.75)' :
                          'rgba(239,68,68,0.75)'
        ),
        borderColor: sorted.map(s =>
          s.pkm >= 0.75 ? '#10b981' :
          s.pkm >= 0.65 ? '#fbbf24' :
                          '#ef4444'
        ),
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      indexAxis: 'y',
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: { display: false },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: ctx => `PKM: ${ctx.parsed.x.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 1,
          ticks: {
            color: 'rgba(255,255,255,0.6)',
            font: { family: 'Inter', size: 11 },
            callback: v => v.toFixed(1)
          },
          grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false }
        },
        y: {
          ticks: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

function initTimeChart(subjects) {
  const canvas = document.getElementById('chart-time');
  if (!canvas) return;

  if (charts.time) charts.time.destroy();

  // Mock hours based on effort level
  const timeData = subjects.map(s => {
    const base = 10;
    const mult = s.effort === 'high' ? 1.5 : s.effort === 'medium' ? 1.0 : 0.7;
    return Math.round(base * mult + Math.random() * 3);
  });

  charts.time = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: subjects.map(s => s.name),
      datasets: [{
        data: timeData,
        backgroundColor: CHART_COLORS.slice(0, subjects.length),
        borderColor: '#12121f',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      cutout: '60%',
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255,255,255,0.8)',
            font: { family: 'Inter', size: 11 },
            padding: 12,
            usePointStyle: true,
            pointStyleWidth: 10
          }
        },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${ctx.parsed}h (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function initAnalyticsCharts() {
  const drawer = document.getElementById('insights-drawer');
  if (!drawer || !drawer.dataset.currentSubject) return;

  const subject = JSON.parse(drawer.dataset.currentSubject);
  const isGlobal = drawer.dataset.isGlobal === 'true';
  const dataSource = isGlobal ? globalData : classData;
  if (!dataSource) return;

  // Get active period
  const activeBtn = document.querySelector('.chart-period-btn.active');
  const period = activeBtn?.dataset.period || 'week';

  initPKMChart(subject.pkm, period);
  initTopicsChart(dataSource.subjects);
  initTimeChart(dataSource.subjects);
}

function destroyAllCharts() {
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      charts[key].destroy();
      charts[key] = null;
    }
  });
}

// ==========================================
// FILTER PANEL
// ==========================================

function toggleFilterPanel() {
  const container = document.getElementById('selectors-container');
  const toggleBtn = document.getElementById('toggle-filter-btn');

  if (container && toggleBtn) {
    container.classList.toggle('collapsed');
    toggleBtn.classList.toggle('active');
  }
}

function resetFilters() {
  const searchInput = document.getElementById('class-search-input');
  if (searchInput) searchInput.value = '';

  selectedClassName = null;

  const container = document.getElementById('selectors-container');
  const toggleBtn = document.getElementById('toggle-filter-btn');
  if (container) container.classList.add('collapsed');
  if (toggleBtn) toggleBtn.classList.remove('active');

  loadGlobalData();
  closeInsightsDrawer();
}

// ==========================================
// CLASS SEARCH
// ==========================================

async function handleClassSearch() {
  const searchInput = document.getElementById('class-search-input');
  const className = searchInput?.value.trim();

  if (!className) {
    selectedClassName = null;
    await loadGlobalData();
    return;
  }

  // Use SchoolsDB to resolve the class (live mode gets class_year_id)
  if (typeof SchoolsDB !== 'undefined' && SchoolsDB.isLive) {
    const result = await SchoolsDB.searchClass(className);
    if (!result) {
      window.SchoolsUtils?.showSchoolNotification('Class not found.', 'error');
      return;
    }
    selectedClassName = result.className;
  } else {
    selectedClassName = className;
  }

  updateClassDisplay();
  await loadClassData();

  const container = document.getElementById('selectors-container');
  const toggleBtn = document.getElementById('toggle-filter-btn');
  if (container) container.classList.add('collapsed');
  if (toggleBtn) toggleBtn.classList.remove('active');
}

function isClassSelected() {
  return selectedClassName !== null && selectedClassName.length > 0;
}

function getSelectedClassDisplay() {
  if (!isClassSelected()) return 'Global view - Entire school';
  const year = document.getElementById('select-year')?.value || '2025-2026';
  return `${selectedClassName} - ${year}`;
}

function updateClassDisplay() {
  document.getElementById('selected-class-text').textContent = getSelectedClassDisplay();
}

// ==========================================
// MENU NAVIGATION
// ==========================================

function handleMenuClick(event) {
  event.preventDefault();
  const menuItem = event.target.closest('.menu-dropdown-item');
  if (!menuItem) return;

  const section = menuItem.getAttribute('data-section');
  if (!section) return;

  document.querySelectorAll('.menu-dropdown-item').forEach(item => item.classList.remove('active'));
  menuItem.classList.add('active');

  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(`section-${section}`);
  if (targetSection) targetSection.classList.add('active');

  closeMenuDropdown();
}

function createMenuOverlay() {
  if (document.getElementById('menu-dropdown-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'menu-dropdown-overlay';
  overlay.className = 'menu-dropdown-overlay';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', closeMenuDropdown);
}

function updateDropdownPosition() {
  const dropdown = document.getElementById('menu-dropdown');
  const btn = document.getElementById('menu-dropdown-btn');

  if (dropdown && btn && dropdown.classList.contains('dropdown-in-body')) {
    const btnRect = btn.getBoundingClientRect();
    dropdown.style.top = (btnRect.bottom + 8) + 'px';
    dropdown.style.left = btnRect.left + 'px';
  }
}

function toggleMenuDropdown() {
  const container = document.getElementById('menu-dropdown-container');
  const overlay = document.getElementById('menu-dropdown-overlay');
  const dropdown = document.getElementById('menu-dropdown');
  const btn = document.getElementById('menu-dropdown-btn');

  if (container && dropdown && btn) {
    const isOpen = container.classList.toggle('open');

    if (isOpen) {
      document.body.appendChild(dropdown);
      dropdown.classList.add('dropdown-in-body');
      updateDropdownPosition();
      dropdown.classList.add('visible');
      window.addEventListener('scroll', updateDropdownPosition, { passive: true });
      window.addEventListener('resize', updateDropdownPosition, { passive: true });
    } else {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
      dropdown.classList.remove('visible');
      dropdown.classList.remove('dropdown-in-body');
      container.appendChild(dropdown);
    }

    if (overlay) {
      overlay.classList.toggle('active', isOpen);
    }
  }
}

function closeMenuDropdown() {
  const container = document.getElementById('menu-dropdown-container');
  const overlay = document.getElementById('menu-dropdown-overlay');
  const dropdown = document.getElementById('menu-dropdown');

  window.removeEventListener('scroll', updateDropdownPosition);
  window.removeEventListener('resize', updateDropdownPosition);

  if (container) container.classList.remove('open');

  if (dropdown && dropdown.classList.contains('dropdown-in-body')) {
    dropdown.classList.remove('visible', 'dropdown-in-body');
    if (container) container.appendChild(dropdown);
  }

  if (overlay) overlay.classList.remove('active');
}

// ==========================================
// RAYA - Redirects to dedicated platform
// Chat is available at raya.thebluestift.com
// ==========================================

// ==========================================
// CONTRIBUTE FORM
// ==========================================

function initContributeForm() {
  const form = document.getElementById('school-contribute-form');
  const fileInput = document.getElementById('school-contrib-file');
  const fileUploadArea = document.getElementById('file-upload-area');

  prefillContributeForm();
  updateContributionsDisplay();

  if (fileUploadArea) {
    fileUploadArea.addEventListener('click', () => fileInput?.click());

    fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadArea.classList.add('dragover');
    });

    fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragover'));

    fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadArea.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        updateFileList(fileInput.files);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => updateFileList(fileInput.files));
  }

  if (form) {
    form.addEventListener('submit', handleContributeSubmit);
  }
}

function prefillContributeForm() {
  if (!currentSchool) return;

  const emailInput = document.getElementById('school-contrib-email');
  const phoneInput = document.getElementById('school-contrib-phone');
  const nameInput = document.getElementById('school-contrib-name');

  if (emailInput && currentSchool.email) emailInput.value = currentSchool.email;
  if (phoneInput && currentSchool.phone) phoneInput.value = currentSchool.phone;
  if (nameInput && currentSchool.adminName) nameInput.value = currentSchool.adminName;
}

function updateContributionsDisplay() {
  const display = document.getElementById('contrib-remaining-display');
  if (display) {
    display.textContent = 'Unlimited'; // Contributions are unlimited
  }
}

function updateFileList(files) {
  const fileList = document.getElementById('file-list');
  if (!fileList) return;

  fileList.innerHTML = '';
  if (files.length === 0) return;

  Array.from(files).forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <i class="fas fa-file"></i>
      <span class="file-name">${file.name}</span>
      <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
    `;
    fileList.appendChild(fileItem);
  });
}

async function handleContributeSubmit(e) {
  e.preventDefault();

  const fileInput = document.getElementById('school-contrib-file');
  const files = Array.from(fileInput?.files || []);

  // Contributions are unlimited - no limit check needed

  if (files.length === 0) {
    window.SchoolsUtils?.showSchoolNotification('Please select at least one file.', 'error');
    return;
  }

  const maxSize = 50 * 1024 * 1024;
  for (const file of files) {
    if (file.size > maxSize) {
      window.SchoolsUtils?.showSchoolNotification(`File "${file.name}" is too large. Maximum: 50MB`, 'error');
      return;
    }
  }

  const submitBtn = document.getElementById('school-contrib-submit');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

  try {
    let result;

    if (typeof SchoolsDB !== 'undefined') {
      const formData = {
        email: document.getElementById('school-contrib-email')?.value || '',
        name: document.getElementById('school-contrib-name')?.value || '',
        category: document.getElementById('school-contrib-category')?.value || '',
        title: document.getElementById('school-contrib-title')?.value || '',
        description: document.getElementById('school-contrib-desc')?.value || ''
      };
      result = await SchoolsDB.submitContribution(formData, files);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      result = { success: true };
    }

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    e.target.reset();
    prefillContributeForm();
    document.getElementById('file-list').innerHTML = '';

    window.SchoolsUtils?.showSchoolNotification('Contribution uploaded successfully! Thank you.', 'success');
  } catch (error) {
    console.error('Upload failed:', error);
    window.SchoolsUtils?.showSchoolNotification('Upload failed: ' + (error.message || 'Unknown error'), 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function initEventListeners() {
  // Toggle filter panel
  document.getElementById('toggle-filter-btn')?.addEventListener('click', toggleFilterPanel);
  document.getElementById('reset-filter-btn')?.addEventListener('click', resetFilters);

  // Class search
  document.getElementById('class-search-btn')?.addEventListener('click', handleClassSearch);
  document.getElementById('class-search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClassSearch();
    }
  });

  // Year selector
  document.getElementById('select-year')?.addEventListener('change', () => {
    if (isClassSelected()) {
      loadClassData();
      updateClassDisplay();
    }
  });

  // Menu dropdown
  createMenuOverlay();
  document.getElementById('menu-dropdown-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenuDropdown();
  });

  document.querySelectorAll('.menu-dropdown-item').forEach(item => {
    item.addEventListener('click', handleMenuClick);
  });

  document.addEventListener('click', (event) => {
    const container = document.getElementById('menu-dropdown-container');
    if (container && !container.contains(event.target)) {
      closeMenuDropdown();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenuDropdown();
  });

  // Logout button
  document.getElementById('menu-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
  });

  // Initialize insights drawer
  initDrawer();

  // RAYA - Now redirects to dedicated platform (raya.thebluestift.com)
  // No chat functionality here, just the floating button

  // Contribute form
  initContributeForm();

  // Render dynamic sections (export, contact, etc.)
  if (window.SchoolsSections) {
    window.SchoolsSections.renderAll();
    console.log('📦 Dynamic sections loaded:', window.SchoolsSections.list());
  }
}

// ==========================================
// LOGOUT
// ==========================================

async function handleLogout() {
  if (!confirm('Are you sure you want to logout?')) return;

  if (typeof SchoolsDB !== 'undefined') {
    await SchoolsDB.logout();
  } else {
    localStorage.removeItem('schools_authenticated');
    localStorage.removeItem('schools_auth_email');
  }

  closeInsightsDrawer();
  closeMenuDropdown();

  window.SchoolsUtils?.showSchoolNotification('Logged out successfully', 'info');

  // Reset login form and show overlay
  setTimeout(() => {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
      loginBtn.style.background = '';
    }
    const pwd = document.getElementById('login-password');
    if (pwd) pwd.value = '';
    clearLoginError();

    showLoginOverlay();
    initLoginForm();
  }, 500);
}

// ==========================================
// YEAR SELECTOR
// ==========================================

async function populateYearSelector() {
  const yearSelect = document.getElementById('select-year');
  if (!yearSelect) return;

  if (typeof SchoolsDB !== 'undefined') {
    const years = await SchoolsDB.getSchoolYears();
    yearSelect.innerHTML = '';
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year.label;
      option.textContent = year.label;
      if (year.isCurrent) option.selected = true;
      yearSelect.appendChild(option);
    });
  } else {
    yearSelect.value = '2025-2026';
  }
}

// ==========================================
// EXPORT FOR DEBUGGING
// ==========================================

window.SchoolsDashboard = {
  loadClassData,
  showSubjectDetails,
  get currentSchool() { return currentSchool; },
  get selectedClassName() { return selectedClassName; },
  get mode() { return typeof SchoolsDB !== 'undefined' ? SchoolsDB.mode : 'demo'; },
  prefillContributeForm
};

console.log('📊 Schools.js loaded');
console.log('💡 Debug: window.SchoolsDashboard');
