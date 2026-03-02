// ==========================================
// BLUESTIFT - Main Script v5.0 (NO SUPABASE)
// Theme & Language: localStorage
// Data: localStorage (Supabase disabled)
// ==========================================

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initMenu();
  initCTAButtons();
  initSmoothScrolling();
  initHeaderScroll();
  initSocialTracking();
  initWaitlistModal();
  initThemeToggle();
  initLanguageStorage();
  initContributeModal();
  initFeedbackModal();
  initShareButton();
  // initSubjectNavigation called when modal opens

  updateEarlyBirdCounter();
});

// Compteur Early Bird (temporaire - localStorage)
let earlyBirdCount = parseInt(localStorage.getItem('bluestift_early_bird_count') || '0');

// ==========================================
// CORRECTION: EARLY BIRD BANNER
// ==========================================

async function updateEarlyBirdCounter() {
  try {
    let spotsLeft = 500;
    
    if (window.BluestiftDB) {
      try {
        const stats = await window.BluestiftDB.getWaitlistStats();
        spotsLeft = stats.spotsLeft;
      } catch (error) {
        console.warn('Could not load from Supabase, using default');
      }
    }
    
    // Update inline counter (dans modal waitlist)
    const inlineCounter = document.getElementById('spots-left-inline');
    if (inlineCounter) {
      inlineCounter.textContent = `${spotsLeft}`;
    }
    
    // Update banner counter
    const bannerCounter = document.getElementById('spots-left');
    if (bannerCounter) {
      bannerCounter.textContent = spotsLeft;
    }
    
    // TOGGLE: bannière early bird = footer tant que spots > 0
    const banner = document.getElementById('early-bird-banner');
    const regularFooter = document.getElementById('regular-footer');
    if (spotsLeft > 0 && spotsLeft <= 500) {
      if (banner) banner.style.display = 'flex';
      if (regularFooter) regularFooter.style.display = 'none';
    } else {
      if (banner) banner.style.display = 'none';
      if (regularFooter) regularFooter.style.display = '';
    }


  } catch (error) {
    console.error('Early Bird counter error:', error);
    
    const inlineCounter = document.getElementById('spots-left-inline');
    if (inlineCounter) {
      inlineCounter.textContent = '500';
    }
    
    // Afficher bannière par défaut en cas d'erreur
    const banner = document.getElementById('early-bird-banner');
    const regularFooter = document.getElementById('regular-footer');
    if (banner) banner.style.display = 'flex';
    if (regularFooter) regularFooter.style.display = 'none';
  }
}

// ==========================================
// LANGUAGE STORAGE (localStorage)
// ==========================================
function initLanguageStorage() {
  const savedLang = localStorage.getItem('bluestift_language');

  // Observer for Google Translate changes
  const observer = new MutationObserver(() => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== 'en') {
      localStorage.setItem('bluestift_language', htmlLang);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });

}

// ==========================================
// FAQ Dropdown
// ==========================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.classList.remove('open');
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
      });
      
      if (!isOpen) {
        answer.classList.add('open');
        this.classList.add('open');
      }
    });
  });
}

// ==========================================
// Menu Dropdown
// ==========================================
function initMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menuContent = document.getElementById('menu-content');

  if (menuBtn && menuContent) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      if (menuContent.style.display === 'flex') {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      } else {
        menuContent.style.display = 'flex';
        menuContent.style.flexDirection = 'column';
        menuContent.style.gap = '10px';
        menuContent.style.animation = 'slideDown 0.3s ease';
        menuContent.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('active');
        menuContent.style.display = 'none';
      }
    });
  }
}

// ==========================================
// CTA Buttons
// ==========================================
function initCTAButtons() {
  const btnPrimary = document.querySelector('.btn-primary');
  // const btnSecondary = document.querySelector('.btn-secondary'); // HIDDEN: Old Try Beta button
  const btnTestLesson = document.querySelector('.btn-test-lesson');

  if (btnPrimary) {
    btnPrimary.addEventListener('click', (e) => {
      const modal = document.getElementById('waitlist-modal');
      if (modal) {
        modal.style.display = 'block';
        updateEarlyBirdCounter();
      }
      createRipple(btnPrimary, e);
    });
  }

  /* HIDDEN: Old Try Beta button logic (app stores redirect)
  if (btnSecondary) {
    btnSecondary.addEventListener('click', (e) => {
      createRipple(btnSecondary, e);

      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      const playStoreUrl = 'https://play.google.com/store/apps';
      const appStoreUrl = 'https://apps.apple.com/';

      if (/android/i.test(userAgent)) {
        window.open(playStoreUrl, '_blank');
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.open(appStoreUrl, '_blank');
      } else {
        showStoreChoice(playStoreUrl, appStoreUrl);
      }
    });
  }
  */

  if (btnTestLesson) {
    btnTestLesson.addEventListener('click', (e) => {
      const subjectModal = document.getElementById('subject-modal');
      if (subjectModal) {
        subjectModal.style.display = 'block';
        
        // Initialize subject navigation when modal opens
        setTimeout(() => {
          initSubjectNavigation();
        }, 100); // Small delay to ensure modal is rendered
      }
      createRipple(btnTestLesson, e);
    });
  }
}

/* HIDDEN: Store Choice for Desktop (used by old Try Beta button)
// ==========================================
// Store Choice for Desktop
// ==========================================
function showStoreChoice(playStoreUrl, appStoreUrl) {
  const existing = document.querySelector('.store-choice-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'store-choice-notification';
  notification.innerHTML = `
    <div class="store-choice-content" style="background: ${document.body.classList.contains('dark-theme') ? '#1a1a1a' : '#fff'}; padding: 25px; border-radius: 12px; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: relative;">
      <button class="close-store-modal" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 28px; color: #999; cursor: pointer; padding: 0; line-height: 1; font-weight: bold;">&times;</button>

      <p style="margin-bottom: 15px; font-weight: 600; color: ${document.body.classList.contains('dark-theme') ? '#f0f0f0' : '#333'};">Choose your platform:</p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="play-store" style="padding: 12px; background: #34A853; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-google-play"></i> Play Store
        </button>
        <button class="app-store" style="padding: 12px; background: #007AFF; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-app-store-ios"></i> App Store
        </button>
      </div>
    </div>
  `;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)',
    zIndex: '10002'
  });

  document.body.appendChild(notification);

  const closeStoreBtn = notification.querySelector('.close-store-modal');
  if (closeStoreBtn) {
    closeStoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notification.remove();
    });
  }

  notification.querySelector('.play-store').addEventListener('click', () => {
    window.open(playStoreUrl, '_blank');
    notification.remove();
  });

  notification.querySelector('.app-store').addEventListener('click', () => {
    window.open(appStoreUrl, '_blank');
    notification.remove();
  });

  notification.addEventListener('click', (e) => {
    if (e.target === notification) {
      notification.remove();
    }
  });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 8000);
}
*/

// ==========================================
// Notification System
// ==========================================
function showNotification(message, type = 'info', duration = 5000) {
  const iconMap = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };

  const existing = document.querySelectorAll('.school-notification');
  if (existing.length >= 4) { _dismissNotification(existing[0]); }

  const notification = document.createElement('div');
  notification.className = `school-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
    <span>${message}</span>
    <button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>
  `;

  document.body.appendChild(notification);

  const timer = setTimeout(() => _dismissNotification(notification), duration);
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
// Ripple Effect
// ==========================================
function createRipple(button, event) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  Object.assign(ripple.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.6)',
    left: `${x}px`,
    top: `${y}px`,
    pointerEvents: 'none',
    animation: 'ripple 0.6s ease-out'
  });

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// ==========================================
// Smooth Scrolling
// ==========================================
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ==========================================
// Header Scroll Effect
// ==========================================
function initHeaderScroll() {
  const header = document.querySelector('header');

  // Scroll shadow effect
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
    }
  });
}

// ==========================================
// Social Media Tracking
// ==========================================
function initSocialTracking() {
  const socialLinks = document.querySelectorAll('.socials a');
  
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const platform = link.querySelector('i').classList[1].replace('fa-', '');
      console.log(`Social click: ${platform}`);
      
      link.style.transform = 'scale(1.2)';
      setTimeout(() => {
        link.style.transform = 'scale(1)';
      }, 200);
    });
  });
}

// ==========================================
// THEME TOGGLE
// ==========================================
function initThemeToggle() {
  const themeToggleInput = document.getElementById('theme-toggle-input');
  const sunIcon = document.querySelector('.theme-icon.sun');
  const moonIcon = document.querySelector('.theme-icon.moon');

  if (!themeToggleInput || !sunIcon || !moonIcon) return;

  const savedTheme = localStorage.getItem('bluestift_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleInput.checked = true;
    sunIcon.classList.remove('active');
    moonIcon.classList.add('active');
  }

  themeToggleInput.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('bluestift_theme', 'dark');
      sunIcon.classList.remove('active');
      moonIcon.classList.add('active');
      showNotification('Dark mode activated', 'info');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('bluestift_theme', 'light');
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
      showNotification('Light mode activated', 'info');
    }
  });
}

// ==========================================
// FERMER MODAUX AU CLIC EXTÉRIEUR
// ==========================================
window.addEventListener('click', (e) => {
  const modals = [
    'waitlist-modal',
    'contribute-modal', 
    'feedback-modal',
    'subject-modal',
    'lesson-modal'
  ];
  
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal && e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
  }
});

// ==========================================
// DEBUG COMMANDS
// ==========================================
window.BluestiftPublicDebug = {
  getStats: async () => {
    const stats = await window.BluestiftDB.getStats();
    console.table(stats);
    return stats;
  },
  
  testNotification: (message, type = 'info') => {
    showNotification(message, type);
  }
};

// ==========================================
// INITIALISATION COMPLETE
// ==========================================
let subjectNavInitialized = false;

function initSubjectNavigation() {
  // Prevent multiple initializations
  if (subjectNavInitialized) {
    console.log('Subject navigation already initialized');
    return;
  }

  const subjectGrid = document.querySelector('.subject-grid');
  const leftArrow = document.getElementById('subject-arrow-left');
  const rightArrow = document.getElementById('subject-arrow-right');

  if (!subjectGrid || !leftArrow || !rightArrow) {
    console.warn('Subject navigation elements not found');
    return;
  }

  const originalCards = Array.from(subjectGrid.querySelectorAll('.subject-card'));
  const totalOriginal = originalCards.length;
  const cloneCount = 2;
  let currentIndex = 0;
  let isTransitioning = false;

  // Setup infinite loop with clones
  function setupClones() {
    // Remove existing clones first
    subjectGrid.querySelectorAll('.subject-card.clone').forEach(c => c.remove());

    // Clone last cards to the beginning
    for (let i = cloneCount; i > 0; i--) {
      const clone = originalCards[totalOriginal - i].cloneNode(true);
      clone.classList.add('clone');
      subjectGrid.insertBefore(clone, subjectGrid.firstChild);
    }

    // Clone first cards to the end
    for (let i = 0; i < cloneCount; i++) {
      const clone = originalCards[i].cloneNode(true);
      clone.classList.add('clone');
      subjectGrid.appendChild(clone);
    }
  }

  setupClones();
  const allCards = Array.from(subjectGrid.querySelectorAll('.subject-card'));

  // Scroll to a position index (including clones)
  function scrollToPosition(posIndex, instant = false) {
    const card = allCards[posIndex];
    if (!card) return;

    const gridRect = subjectGrid.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const gridCenter = gridRect.left + gridRect.width / 2;
    const scrollOffset = cardCenter - gridCenter;

    subjectGrid.scrollBy({
      left: scrollOffset,
      behavior: instant ? 'instant' : 'smooth'
    });
  }

  // Initial position
  requestAnimationFrame(() => {
    scrollToPosition(cloneCount, true);
  });

  // Next card with infinite loop
  function nextCard() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex++;
    scrollToPosition(currentIndex + cloneCount);

    if (currentIndex >= totalOriginal) {
      setTimeout(() => {
        currentIndex = 0;
        scrollToPosition(cloneCount, true);
        isTransitioning = false;
      }, 350);
    } else {
      setTimeout(() => { isTransitioning = false; }, 350);
    }
  }

  // Previous card with infinite loop
  function previousCard() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex--;
    scrollToPosition(currentIndex + cloneCount);

    if (currentIndex < 0) {
      setTimeout(() => {
        currentIndex = totalOriginal - 1;
        scrollToPosition(currentIndex + cloneCount, true);
        isTransitioning = false;
      }, 350);
    } else {
      setTimeout(() => { isTransitioning = false; }, 350);
    }
  }

  leftArrow.addEventListener('click', previousCard);
  rightArrow.addEventListener('click', nextCard);

  subjectNavInitialized = true;
  console.log('Subject navigation initialized');
}


