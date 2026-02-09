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
// NOTIFICATIONS
// ==========================================

function showSchoolNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.school-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `school-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => notification.remove(), 5000);

  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
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
  formatDate
};

console.log('🔧 Schools-utils.js loaded');
