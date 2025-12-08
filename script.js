// ==========================================
// BLUESTIFT - Main Script v4.1 (SUPABASE FIXED)
// Theme & Language: localStorage
// Data: Supabase
// Static Docs: Google Drive + PDF Viewer
// ==========================================

// ==========================================
// 🚀 INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Bluestift loading...');
  
  await waitForSupabase();
  
  initFAQ();
  initMenu();
  initCTAButtons();
  initSmoothScrolling();
  initHeaderScroll();
  initSocialTracking();
  initWaitlistModal();
  initThemeToggle();
  initContributeModal();
  initFeedbackModal();
  initDocumentationModal();
  initShareButton();
  initCategoryFilters();
  
  await loadCommunityLibrary();
  await updateEarlyBirdCounter();
  
  console.log('✅ Bluestift ready!');
});

// ==========================================
// ⏳ ATTENDRE SUPABASE
// ==========================================
async function waitForSupabase() {
  const maxAttempts = 50;
  let attempts = 0;
  
  while (!window.BluestiftDB && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.BluestiftDB) {
    console.error('❌ Supabase client not loaded!');
    showNotification('⚠️ Connection error. Please refresh the page.', 'error');
    return false;
  }
  
  console.log('✅ Supabase connected!');
  return true;
}

// Compteur Early Bird (temporaire - localStorage)
let earlyBirdCount = parseInt(localStorage.getItem('bluestift_early_bird_count') || '0');

// ==========================================
// 🔥 EARLY BIRD COUNTER
// ==========================================
async function updateEarlyBirdCounter() {
  try {
    let spotsLeft = 500;
    
    if (window.BluestiftDB) {
      try {
        const stats = await window.BluestiftDB.getWaitlistStats();
        spotsLeft = stats.spotsLeft;
      } catch (error) {
        console.warn('⚠️ Could not load from Supabase, using default');
      }
    }
    
    const inlineCounter = document.getElementById('spots-left-inline');
    if (inlineCounter) {
      inlineCounter.textContent = `${spotsLeft}/500`;
    }
    
    const bannerCounter = document.getElementById('spots-left');
    if (bannerCounter) {
      bannerCounter.textContent = spotsLeft;
    }
    
    console.log(`🔥 Early Bird spots left: ${spotsLeft}`);
    
  } catch (error) {
    console.error('❌ Early Bird counter error:', error);
    
    const inlineCounter = document.getElementById('spots-left-inline');
    if (inlineCounter) {
      inlineCounter.textContent = '500/500';
    }
  }
}

// ==========================================
// FAQ Dropdown
// ==========================================
function initFAQ() {
  const faqBtn = document.getElementById('faq-btn');
  const faqDropdown = document.getElementById('faq-dropdown');
  const faqQuestions = document.querySelectorAll('.faq-question');

  if (faqBtn && faqDropdown) {
    faqBtn.addEventListener('click', (e) => {
      e.preventDefault();
      faqDropdown.style.display = faqDropdown.style.display === 'block' ? 'none' : 'block';
      faqDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!faqBtn.contains(e.target) && !faqDropdown.contains(e.target)) {
        faqDropdown.style.display = 'none';
        faqDropdown.classList.remove('open');
      }
    });
  }

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.display === 'block';
      
      document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
      answer.style.display = isOpen ? 'none' : 'block';
      
      if (!isOpen) {
        answer.style.animation = 'fadeIn 0.3s ease';
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
      e.preventDefault();
      
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
  const btnSecondary = document.querySelector('.btn-secondary');
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

  if (btnTestLesson) {
    btnTestLesson.addEventListener('click', (e) => {
      const subjectModal = document.getElementById('subject-modal');
      if (subjectModal) {
        subjectModal.style.display = 'block';
      }
      createRipple(btnTestLesson, e);
    });
  }
}

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

// ==========================================
// Notification System
// ==========================================
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 25px',
    borderRadius: '8px',
    background: colors[type] || colors.info,
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: '99999',
    animation: 'slideInRight 0.4s ease',
    maxWidth: '300px'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
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
// 📝 WAITLIST MODAL
// ==========================================
function initWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  const closeBtns = document.querySelectorAll('#waitlist-modal .close-modal');
  const form = document.getElementById('waitlist-form');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });

  if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('waitlist-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up...';
    
    try {
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || null,
        interest: document.getElementById('interest').value || null
      };
      
      // Envoyer à Supabase (le trigger créera le wallet automatiquement)
      const result = await window.BluestiftDB.joinWaitlist(formData);
      
      if (modal) modal.style.display = 'none';
      form.reset();
      
      // Sauvegarder l'email pour le wallet
      localStorage.setItem('bluestift_user_email', formData.email);
      
      // ✅ Migration des leçons pending
      if (typeof migratePendingLessons === 'function') {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Migrating lessons...';
        
        try {
          const migration = await migratePendingLessons(formData.email);
          
          if (migration.success && migration.migrated > 0) {
            const pendingLessons = typeof getPendingLessons === 'function' ? getPendingLessons() : [];
            const totalTokens = pendingLessons.reduce((sum, l) => sum + l.tokensEarned, 0);
            
            showNotification(
              `🎉 Welcome! ${migration.migrated} lesson(s) migrated → You claimed ${totalTokens} WBSP bonus!`,
              'success'
            );
          }
        } catch (migrationError) {
          console.error('⚠️ Migration failed:', migrationError);
        }
      }
      
      // Message standard d'inscription
      if (result.alreadyRegistered) {
        showNotification(
          `ℹ️ You're already registered at position #${result.position}!`,
          'info'
        );
      } else {
        const message = result.isEarlyBird
          ? `🎉 Congratulations! You're Early Bird #${result.position}! 100 WBSP guaranteed!`
          : `✅ Welcome! You're on the waitlist at position #${result.position}`;
        
        showNotification(message, 'success');
      }
      
      await updateEarlyBirdCounter();
      
    } catch (error) {
      console.error('❌ Waitlist error:', error);
      showNotification('❌ Registration failed. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
}

// ==========================================
// 🎨 THEME TOGGLE
// ==========================================
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const themeSubmenu = document.getElementById('theme-submenu');
  const themeOptions = document.querySelectorAll('[data-theme]');

  const savedTheme = localStorage.getItem('bluestift_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      themeSubmenu.classList.toggle('active');
    });
  }

  themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedTheme = option.getAttribute('data-theme');
      
      if (selectedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('bluestift_theme', 'dark');
        showNotification('🌙 Dark mode activated', 'info');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('bluestift_theme', 'light');
        showNotification('☀️ Light mode activated', 'info');
      }
      
      themeSubmenu.classList.remove('active');
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  });
}

// ==========================================
// 📤 CONTRIBUTE MODAL (FIXED)
// ==========================================
function initContributeModal() {
  const contributeBtn = document.getElementById('contribute-btn');
  const modal = document.getElementById('contribute-modal');
  const closeBtn = modal?.querySelector('.close-modal');
  const form = document.getElementById('contribute-form');

  if (contributeBtn) {
    contributeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'block';
      
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fileInput = document.getElementById('contrib-file');
      const files = Array.from(fileInput.files);

      // Validation: au moins 1 fichier
      if (files.length === 0) {
        showNotification('⚠️ Please select at least one file', 'error');
        return;
      }

      // Validation: taille max 50MB
      const maxSize = 50 * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSize) {
          showNotification(`⚠️ File "${file.name}" is too large. Maximum: 50MB`, 'error');
          return;
        }
      }

      // Validation: types acceptés
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'video/mp4',
        'audio/mpeg',
        'audio/mp3'
      ];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          showNotification(`⚠️ File type not allowed: ${file.name}. Accepted: PDF, Word, PowerPoint, Images, Videos, Audio`, 'error');
          return;
        }
      }

      const contributionData = {
        name: document.getElementById('contrib-name').value.trim(),
        email: document.getElementById('contrib-email').value.trim(),
        title: document.getElementById('contrib-title').value.trim(),
        category: document.getElementById('contrib-category').value,
        description: document.getElementById('contrib-description').value.trim() || null
      };

      // Validation des champs requis
      if (!contributionData.name || !contributionData.email || !contributionData.title || !contributionData.category) {
        showNotification('⚠️ Please fill all required fields', 'error');
        return;
      }
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading files...';
      
      try {
        console.log('📤 === STARTING CONTRIBUTION UPLOAD ===');
        console.log('Files:', files.map(f => `${f.name} (${(f.size/1024/1024).toFixed(2)}MB)`));
        
        await window.BluestiftDB.submitContribution(contributionData, files);
        
        modal.style.display = 'none';
        form.reset();
        
        showNotification('🎉 Thank you! Your contribution has been uploaded successfully.', 'success');
        
      } catch (error) {
        console.error('❌ === UPLOAD FAILED ===');
        console.error('Error:', error);
        console.error('Message:', error.message);
        
        // Messages d'erreur en anglais uniquement
        let errorMsg = 'Upload failed. ';
        
        if (error.message.includes('policy') || error.message.includes('permission') || error.message.includes('denied')) {
          errorMsg += 'Permission denied. Please contact support.';
        } else if (error.message.includes('size') || error.message.includes('large')) {
          errorMsg += 'File too large. Maximum 50MB per file.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg += 'Network error. Please check your connection.';
        } else if (error.message.includes('bucket')) {
          errorMsg += 'Storage error. Please contact support.';
        } else {
          errorMsg += error.message || 'Unknown error. Please try again.';
        }
        
        showNotification('❌ ' + errorMsg, 'error');
        
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }
}

// ==========================================
// 💬 FEEDBACK MODAL
// ==========================================
function initFeedbackModal() {
  const feedbackBtn = document.getElementById('feedback-btn');
  const modal = document.getElementById('feedback-modal');
  const closeBtn = modal?.querySelector('.close-modal');
  const form = document.getElementById('feedback-form');
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('feedback-rating');

  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'block';
      
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingInput.value = rating;
      
      stars.forEach(s => {
        const starRating = s.getAttribute('data-rating');
        if (starRating <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!ratingInput.value) {
        showNotification('⚠️ Please give a rating before submitting', 'info');
        return;
      }

      const feedbackData = {
        name: document.getElementById('feedback-name').value || null,
        email: document.getElementById('feedback-email').value || null,
        rating: ratingInput.value,
        type: document.getElementById('feedback-type').value,
        message: document.getElementById('feedback-message').value
      };
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
        await window.BluestiftDB.submitFeedback(feedbackData);
        
        modal.style.display = 'none';
        form.reset();
        stars.forEach(s => s.classList.remove('active'));
        
        showNotification('💬 Thank you for your feedback!', 'success');
        
      } catch (error) {
        console.error('❌ Feedback error:', error);
        showNotification('❌ Submission failed. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }
}

// ==========================================
// 📚 DOCUMENTATION MODAL
// ==========================================
function initDocumentationModal() {
  const docBtn = document.getElementById('documentation-btn');
  const modal = document.getElementById('documentation-modal');
  const closeBtn = modal?.querySelector('.close-modal');
  const docTabs = document.querySelectorAll('.doc-tab');
  const searchInput = document.getElementById('library-search');

  if (docBtn) {
    docBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'block';
      
      await loadCommunityLibrary();
      
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  docTabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      const tabName = tab.getAttribute('data-tab');
      
      docTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabName}-docs`).classList.add('active');
      
      if (tabName === 'library') {
        await loadCommunityLibrary();
      }
    });
  });

  const officialSearch = document.getElementById('official-search');
  if (officialSearch) {
    officialSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterDocuments('official-docs', query);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterDocuments('library-list', query);
    });
  }
}

// ==========================================
// 📚 STATIC DOCS
// ==========================================
const staticDocs = [
  {
    id: 'static_algebra',
    title: 'High School Algebra (French)',
    category: 'mathematiques',
    description: 'Complete course on equations and functions',
    author: 'The Bluestift Team',
    filesCount: 1,
    isStatic: true,
    driveFileId: '1h_6_iUaLCbQ6nC1c-59xkfBo-aV3HVWq',
    mimeType: 'application/pdf',
    downloads_count: 0
  },
  {
    id: 'static_bitcoin',
    title: 'Bitcoin Whitepaper',
    category: 'informatique',
    description: 'The original Bitcoin whitepaper by Satoshi Nakamoto',
    author: 'The Bluestift Team',
    filesCount: 1,
    isStatic: true,
    driveFileId: '1W-5Fbr-vRm76GO1swDAVdNJS_8ZL-DO0',
    mimeType: 'application/pdf',
    downloads_count: 0
  },
  {
    id: 'static_grammar',
    title: 'Irregular Verbs and grammar tips',
    category: 'langues',
    description: 'Complete guide with practical exercises',
    author: 'The Bluestift Team',
    filesCount: 2,
    isStatic: true,
    driveFileId: '11WQDHXW7Us90cizM10vQXeCVlV3H26fp',
    mimeType: 'application/pdf',
    downloads_count: 0
  },
  {
    id: 'static_transformer',
    title: 'Attention is All you Need',
    category: 'informatique',
    description: 'Complete guide to the Transformer model',
    author: 'The Bluestift Team',
    filesCount: 1,
    isStatic: true,
    driveFileId: '1vBWg3LIShaVDB3yvcbXzg1a3IHeJlXGW',
    mimeType: 'application/pdf',
    downloads_count: 0
  }
];

// ==========================================
// 📚 CHARGER LA BIBLIOTHÈQUE
// ==========================================
async function loadCommunityLibrary() {
  const libraryList = document.getElementById('library-list');
  
  if (!libraryList) {
    console.warn('library-list element not found');
    return;
  }
  
  libraryList.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i><p>Loading library...</p></div>';
  
  let supabaseDocs = [];
  try {
    if (window.BluestiftDB) {
      supabaseDocs = await window.BluestiftDB.getLibrary();
    }
  } catch (error) {
    console.warn('⚠️ Could not load from Supabase:', error);
  }
  
  const allDocs = [...staticDocs, ...supabaseDocs];
  
  libraryList.innerHTML = '';
  
  if (allDocs.length === 0) {
    libraryList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.5;"></i>
        <p style="margin-top: 15px;">No documents available yet</p>
        <p style="font-size: 0.9rem;">Documents will appear here</p>
      </div>
    `;
    return;
  }
  
  allDocs.forEach(doc => {
    const docItem = createLibraryDocItem(doc);
    libraryList.appendChild(docItem);
  });
  
  console.log(`✅ ${allDocs.length} documents loaded (${staticDocs.length} static + ${supabaseDocs.length} Supabase)`);
}

// ==========================================
// 🎨 CRÉER UN ITEM DE BIBLIOTHÈQUE
// ==========================================
function createLibraryDocItem(doc) {
  const categoryIcons = {
    'mathematiques': 'fa-calculator',
    'sciences': 'fa-flask',
    'langues': 'fa-language',
    'informatique': 'fa-laptop-code',
    'histoire': 'fa-landmark',
    'arts': 'fa-palette'
  };
  
  const icon = categoryIcons[doc.category] || 'fa-book';
  
  const docItem = document.createElement('div');
  docItem.className = 'doc-item';
  docItem.setAttribute('data-category', doc.category);
  
  // ✅ Gérer static docs (Google Drive) vs Supabase docs
  let fileUrl = '#';
  let fileName = 'Document';
  
  if (doc.isStatic) {
    // Static doc (Google Drive)
    fileUrl = `https://drive.google.com/file/d/${doc.driveFileId}/preview`;
  } else {
    // ✅ CORRECTION: Supabase doc depuis Contribute bucket
    const firstFile = doc.library_files?.[0];
    if (firstFile) {
      // Construire l'URL publique correcte
      fileUrl = `${SUPABASE_URL}/storage/v1/object/public/Contribute/${firstFile.file_path}`;
      fileName = firstFile.file_name || 'Document';
    }
  }
  
  docItem.innerHTML = `
    <div class="doc-icon"><i class="fas ${icon}"></i></div>
    <div class="doc-info">
      <h4>${doc.title}</h4>
      <p>${doc.description || 'No description available'}</p>
      <span class="doc-meta">
        <i class="fas fa-user"></i> ${doc.author} • 
        <i class="fas fa-file-alt"></i> ${doc.filesCount || doc.file_count || 1} file(s) • 
        <i class="fas fa-download"></i> ${doc.downloads_count || 0} downloads
      </span>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <a href="#" class="doc-link" onclick="viewDocument('${fileUrl}', '${doc.title}', '${doc.id}', ${doc.isStatic || false}); return false;" style="flex: 1; text-align: center;">
          <i class="fas fa-eye"></i> View
        </a>
      </div>
    </div>
  `;
  
  return docItem;
}

// ==========================================
// 👁️ VOIR UN DOCUMENT (FIXED)
// ==========================================
window.viewDocument = function(fileUrl, title, docId, isStatic = false, mimeType = 'application/pdf') {
  console.log('📄 Opening document:', title, 'Type:', mimeType);
  
  if (mimeType === 'application/pdf' && typeof openPDFViewer === 'function') {
    openPDFViewer(fileUrl, title, mimeType);
    showNotification('📄 Opening PDF...', 'info');
    
  } else if (mimeType && mimeType.startsWith('image/')) {
    window.open(fileUrl, '_blank');
    showNotification('🖼️ Opening image...', 'info');
    
  } else if (mimeType && mimeType.startsWith('video/')) {
    window.open(fileUrl, '_blank');
    showNotification('🎥 Opening video...', 'info');
    
  } else {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = title;
    a.target = '_blank';
    a.click();
    showNotification('💾 Downloading file...', 'info');
  }
  
  if (!isStatic && docId) {
    trackDownload(docId);
  }
}

// ==========================================
// 📊 TRACKER TÉLÉCHARGEMENT
// ==========================================
async function trackDownload(libraryId) {
  try {
    if (window.BluestiftDB) {
      await window.BluestiftDB.incrementDownloadCount(libraryId);
      console.log(`📊 Download tracked for doc #${libraryId}`);
    }
  } catch (error) {
    console.warn('⚠️ Download tracking failed:', error);
  }
}

// ==========================================
// 🔍 FILTRER LES DOCUMENTS
// ==========================================
function filterDocuments(listId, query) {
  const docList = document.getElementById(listId);
  if (!docList) {
    console.warn(`Element with id "${listId}" not found`);
    return;
  }
  
  const docItems = docList.querySelectorAll('.doc-item');
  let visibleCount = 0;
  
  docItems.forEach(item => {
    const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
    const description = item.querySelector('p')?.textContent.toLowerCase() || '';
    const category = item.getAttribute('data-category') || '';
    
    const matches = title.includes(query) || 
                   description.includes(query) || 
                   category.includes(query);
    
    if (matches || query === '') {
      item.style.display = 'flex';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  let noResults = docList.querySelector('.no-results');
  if (visibleCount === 0 && query !== '') {
    if (!noResults) {
      noResults = document.createElement('p');
      noResults.className = 'no-results';
      noResults.style.cssText = 'text-align: center; color: #999; padding: 40px;';
      noResults.textContent = '🔍 No documents found for "' + query + '"';
      docList.appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// ==========================================
// 🏷️ FILTRES PAR CATÉGORIE
// ==========================================
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      filterDocumentsByCategory(category);
    });
  });
}

function filterDocumentsByCategory(category) {
  const docItems = document.querySelectorAll('#library-list .doc-item');
  
  docItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || itemCategory === category) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// ==========================================
// 🔗 SHARE BUTTON
// ==========================================
function initShareButton() {
  const shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const url = window.location.href;
      const title = 'Join Bluestift - The Learning Revolution';
      const text = 'Discover Bluestift, the new educational platform that combines learning, community and rewards! 🚀';

      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).then(() => {
          showNotification('📤 Thank you for sharing Bluestift!', 'success');
        }).catch((error) => {
          console.log('Share error:', error);
        });
      } else {
        showShareOptions(url, title, text);
      }
      
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }
}

function showShareOptions(url, title, text) {
  const existing = document.querySelector('.share-options-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'share-options-modal';
  modal.innerHTML = `
    <div style="background: ${document.body.classList.contains('dark-theme') ? '#1a1a1a' : '#fff'}; padding: 25px; border-radius: 12px; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <h3 style="margin-top: 0; color: ${document.body.classList.contains('dark-theme') ? '#f0f0f0' : '#1a1a1a'};">📤 Share Bluestift</h3>
      <p style="color: ${document.body.classList.contains('dark-theme') ? '#b0b0b0' : '#666'}; margin-bottom: 20px;">Choose your platform:</p>
      
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="share-btn" data-platform="whatsapp" style="padding: 12px; background: #25D366; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button class="share-btn" data-platform="facebook" style="padding: 12px; background: #1877F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-facebook"></i> Facebook
        </button>
        <button class="share-btn" data-platform="twitter" style="padding: 12px; background: #1DA1F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-twitter"></i> Twitter
        </button>
        <button class="share-btn" data-platform="linkedin" style="padding: 12px; background: #0A66C2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-linkedin"></i> LinkedIn
        </button>
        <button class="share-btn" data-platform="copy" style="padding: 12px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-copy"></i> Copy Link
        </button>
      </div>
      
      <button class="close-share" style="margin-top: 15px; width: 100%; padding: 10px; background: #e5e7eb; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
        Close
      </button>
    </div>
  `;

  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10003',
    animation: 'fadeIn 0.3s ease'
  });

  document.body.appendChild(modal);

  modal.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      let shareUrl = '';

      switch (platform) {
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case 'copy':
          modal.remove();
          navigator.clipboard.writeText(url).then(() => {
            showNotification('📋 Link copied to clipboard!', 'success');
          });
          return;
      }

      if (shareUrl) {
        modal.remove();
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showNotification('📤 Thank you for sharing Bluestift!', 'success');
      }
    });
  });

  modal.querySelector('.close-share').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// ==========================================
// ❌ FERMER MODAUX AU CLIC EXTÉRIEUR
// ==========================================
window.addEventListener('click', (e) => {
  const modals = [
    'waitlist-modal',
    'contribute-modal', 
    'feedback-modal',
    'documentation-modal',
    'wallet-modal',
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
// 📊 DEBUG COMMANDS
// ==========================================
window.BluestiftPublicDebug = {
  getStats: async () => {
    const stats = await window.BluestiftDB.getStats();
    console.table(stats);
    return stats;
  },
  
  viewLibrary: async () => {
    const library = await window.BluestiftDB.getLibrary();
    console.table(library);
    return library;
  },
  
  viewMyWallet: async () => {
    const email = localStorage.getItem('bluestift_user_email');
    if (!email) {
      console.warn('⚠️ No email found. Join the waitlist first.');
      return null;
    }
    const wallet = await window.BluestiftDB.getWallet(email);
    console.table(wallet);
    return wallet;
  },
  
  testNotification: (message, type = 'info') => {
    showNotification(message, type);
  }
};

// ==========================================
// ✅ INITIALISATION COMPLÈTE
// ==========================================

console.log('✅ Bluestift v4.1 (Supabase Fixed) loaded successfully!');
console.log('💡 Debug commands: window.BluestiftPublicDebug');
console.log('📊 Examples:');
console.log('  - window.BluestiftPublicDebug.getStats()');
console.log('  - window.BluestiftPublicDebug.viewLibrary()');
console.log('  - window.BluestiftPublicDebug.viewMyWallet()');
console.log('🎨 Theme: localStorage');
console.log('🌐 Language: Google Translate');
console.log('📄 Static Docs: Google Drive + PDF Viewer');
console.log('☁️ Data: Supabase');

// ==========================================
// 📊 TRACKING DOCUMENTS
// ==========================================
window.trackDocumentView = function(docTitle, docType) {
  console.log(`[Analytics] Document viewed: ${docTitle} (${docType})`);
};