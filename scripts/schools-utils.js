// ==========================================
// SCHOOLS-UTILS.JS - Utility Functions
// Language selector, RAYA chat, notifications
// ==========================================

// ==========================================
// RAYA CHAT RESPONSES
// ==========================================

function generateRayaResponse(question, rayaResponses) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('pkm') || lowerQuestion.includes('score')) {
    return rayaResponses.pkm;
  }

  if (lowerQuestion.includes('math') || lowerQuestion.includes('maths')) {
    return rayaResponses.math;
  }

  if (lowerQuestion.includes('physics')) {
    return rayaResponses.physics;
  }

  if (lowerQuestion.includes('compare') || lowerQuestion.includes('comparison')) {
    return rayaResponses.compare;
  }

  if (lowerQuestion.includes('action') || lowerQuestion.includes('improve')) {
    return rayaResponses.action;
  }

  return rayaResponses.default;
}

// ==========================================
// LANGUAGE SELECTOR
// ==========================================

function initLanguageSelector() {
  const languageOptions = document.querySelectorAll('.language-option');

  // Load saved language preference
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  setActiveLanguage(savedLang);

  languageOptions.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      changeLanguage(lang);
      setActiveLanguage(lang);
    });
  });
}

function setActiveLanguage(lang) {
  const languageOptions = document.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
}

function changeLanguage(lang) {
  // Save preference
  localStorage.setItem('selectedLanguage', lang);

  // Use Google Translate
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
    showSchoolNotification('Language changed successfully!', 'success');
  } else {
    // If Google Translate not loaded yet, set cookie directly
    setGoogleTranslateCookie(lang);
    showSchoolNotification('Language will change on page reload.', 'info');
  }
}

function setGoogleTranslateCookie(lang) {
  // Set Google Translate cookie
  const domain = window.location.hostname;
  document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain}`;
  document.cookie = `googtrans=/en/${lang}; path=/`;
}

// Auto-apply saved language on load
function applyStoredLanguage() {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    // Wait for Google Translate to load
    const checkInterval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = savedLang;
        select.dispatchEvent(new Event('change'));
        clearInterval(checkInterval);
      }
    }, 500);

    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkInterval), 5000);
  }
}

// ==========================================
// SOUND NOTIFICATIONS
// ==========================================

const SchoolsAudio = {
  _ctx: null,
  _enabled: localStorage.getItem('sound_enabled') !== 'false',

  _getCtx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._ctx;
  },

  play(type = 'info') {
    if (!this._enabled) return;
    try {
      const ctx = this._getCtx();
      const patterns = {
        success: [{ f: 523, d: 0.08 }, { f: 784, d: 0.14 }],  // C5 → G5 ascending
        error:   [{ f: 330, d: 0.12 }, { f: 220, d: 0.18 }],  // E4 → A3 descending
        warning: [{ f: 440, d: 0.07 }, { f: 440, d: 0.07 }],  // A4 staccato double
        info:    [{ f: 523, d: 0.10 }],                         // C5 single
      };
      const seq = patterns[type] || patterns.info;
      let t = ctx.currentTime + 0.05;
      seq.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + d);
        osc.start(t);
        osc.stop(t + d);
        t += d + 0.05;
      });
    } catch (e) { /* AudioContext blocked or unavailable */ }
  },

  setEnabled(val) {
    this._enabled = val;
    localStorage.setItem('sound_enabled', val ? 'true' : 'false');
  },

  isEnabled() { return this._enabled; }
};

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

const SchoolsPush = {
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },

  async init() {
    if (!this.isSupported()) return;
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (e) {
      console.warn('SW registration failed:', e);
    }
  },

  async enable() {
    if (!this.isSupported()) {
      return { success: false, error: 'Push notifications are not supported in this browser.' };
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Permission denied. Please allow notifications in your browser settings.' };
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = window.VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        return { success: false, error: 'Push not configured on this server (missing VAPID key).' };
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this._toUint8Array(vapidKey)
      });

      // Save subscription to DB
      if (typeof SchoolsDB !== 'undefined' && SchoolsDB.isLive) {
        await SchoolsDB.savePushSubscription(subscription.toJSON());
      }

      localStorage.setItem('push_enabled', 'true');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async disable() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
    } catch (e) { /* ignore */ }
    localStorage.removeItem('push_enabled');
  },

  isEnabled() {
    return localStorage.getItem('push_enabled') === 'true'
      && typeof Notification !== 'undefined'
      && Notification.permission === 'granted';
  },

  _toUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================

function showSchoolNotification(message, type = 'info', duration = 5000) {
  const iconMap = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };

  // Limit stacking to 4 notifications max (remove oldest)
  const existing = document.querySelectorAll('.school-notification');
  if (existing.length >= 4) {
    _dismissNotification(existing[0]);
  }

  const notification = document.createElement('div');
  notification.className = `school-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
    <span class="notification-text"></span>
    <button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>
  `;
  notification.querySelector('.notification-text').textContent = message;

  document.body.appendChild(notification);

  // Play sound feedback
  SchoolsAudio.play(type);

  // Auto-dismiss
  const timer = setTimeout(() => _dismissNotification(notification), duration);

  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(timer);
    _dismissNotification(notification);
  });
}

function _dismissNotification(notification) {
  if (!notification || !notification.parentNode) return;
  notification.classList.add('dismissing');
  setTimeout(() => notification.remove(), 300);
}

// ==========================================
// UTILITIES
// ==========================================

function updateCurrentDate() {
  const dateElement = document.getElementById('current-date');
  if (!dateElement) return;

  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('en-US', options);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ==========================================
// EXPORT
// ==========================================

window.SchoolsUtils = {
  generateRayaResponse,
  initLanguageSelector,
  setActiveLanguage,
  changeLanguage,
  applyStoredLanguage,
  showSchoolNotification,
  updateCurrentDate,
  formatDate,
  SchoolsAudio,
  SchoolsPush
};

// Register service worker and restore push subscription if previously enabled
SchoolsPush.init();

console.log('🔧 Schools-utils.js loaded');
