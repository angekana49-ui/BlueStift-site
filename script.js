// ==========================================
// BLUESTIFT - Main Script v5.0 (NO SUPABASE)
// Theme & Language: localStorage
// Data: localStorage (Supabase disabled)
// ==========================================

// ==========================================
// 🚀 INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Bluestift loading...');

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

  console.log('✅ Bluestift ready!');
});

// Compteur Early Bird (temporaire - localStorage)
let earlyBirdCount = parseInt(localStorage.getItem('bluestift_early_bird_count') || '0');

// ==========================================
// 🔥 CORRECTION: EARLY BIRD BANNER
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
    
    // ✅ Update inline counter (dans modal waitlist)
    const inlineCounter = document.getElementById('spots-left-inline');
    if (inlineCounter) {
      inlineCounter.textContent = `${spotsLeft}`;
    }
    
    // ✅ Update banner counter
    const bannerCounter = document.getElementById('spots-left');
    if (bannerCounter) {
      bannerCounter.textContent = spotsLeft;
    }
    
    // ✅ TOGGLE: bannière early bird = footer tant que spots > 0
    const banner = document.getElementById('early-bird-banner');
    const regularFooter = document.getElementById('regular-footer');
    if (spotsLeft > 0 && spotsLeft <= 500) {
      if (banner) banner.style.display = 'flex';
      if (regularFooter) regularFooter.style.display = 'none';
      console.log('🔥 Early Bird banner displayed as footer');
    } else {
      if (banner) banner.style.display = 'none';
      if (regularFooter) regularFooter.style.display = '';
      console.log('❌ Early Bird exhausted, showing regular footer');
    }
    
    console.log(`🔥 Early Bird spots left: ${spotsLeft}`);
    
  } catch (error) {
    console.error('❌ Early Bird counter error:', error);
    
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
// 🌐 LANGUAGE STORAGE (localStorage)
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

  console.log('🌐 Language storage initialized', savedLang ? `(saved: ${savedLang})` : '');
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
        
        const result = await window.BluestiftDB.joinWaitlist(formData);
        
        if (modal) modal.style.display = 'none';
        form.reset();
        
        localStorage.setItem('bluestift_user_email', formData.email);
        
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
      showNotification('🌙 Dark mode activated', 'info');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('bluestift_theme', 'light');
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
      showNotification('☀️ Light mode activated', 'info');
    }
  });
}

// ==========================================
// 📤 CONTRIBUTE MODAL
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

      if (files.length === 0) {
        showNotification('⚠️ Please select at least one file', 'error');
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSize) {
          showNotification(`⚠️ File "${file.name}" is too large. Maximum: 50MB`, 'error');
          return;
        }
      }

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

      if (!contributionData.name || !contributionData.email || !contributionData.title || !contributionData.category) {
        showNotification('⚠️ Please fill all required fields', 'error');
        return;
      }
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading files...';
      
      try {
        console.log('=== STARTING CONTRIBUTION UPLOAD ===');
        console.log('Files:', files.map(f => `${f.name} (${(f.size/1024/1024).toFixed(2)}MB)`));
        
        await window.BluestiftDB.submitContribution(contributionData, files);
        
        modal.style.display = 'none';
        form.reset();
        
        showNotification('🎉 Thank you! Your contribution has been uploaded successfully.', 'success');
        
      } catch (error) {
        console.error('❌ === UPLOAD FAILED ===');
        console.error('Error:', error);
        console.error('Message:', error.message);
        
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
    // Effet hover: illumine les étoiles jusqu'à celle survolée
    star.addEventListener('mouseenter', () => {
      const rating = star.getAttribute('data-rating');
      stars.forEach(s => {
        const starRating = s.getAttribute('data-rating');
        if (starRating <= rating) {
          s.style.color = '#fbbf24';
          s.style.transform = 'scale(1.15)';
        } else {
          s.style.color = 'rgba(255, 255, 255, 0.3)';
          s.style.transform = 'scale(1)';
        }
      });
    });

    // Reset au départ de la souris: remet les étoiles actives
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => {
        if (s.classList.contains('active')) {
          s.style.color = '#fbbf24';
          s.style.transform = 'scale(1)';
        } else {
          s.style.color = 'rgba(255, 255, 255, 0.3)';
          s.style.transform = 'scale(1)';
        }
      });
    });

    // Clic: sélection permanente
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingInput.value = rating;

      stars.forEach(s => {
        const starRating = s.getAttribute('data-rating');
        if (starRating <= rating) {
          s.classList.add('active');
          s.style.color = '#fbbf24';
        } else {
          s.classList.remove('active');
          s.style.color = 'rgba(255, 255, 255, 0.3)';
        }
        s.style.transform = 'scale(1)';
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
// 🔗 SHARE BUTTON
// ==========================================
function initShareButton() {
  const shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const url = window.location.href;
      const title = 'Join Bluestift - The Learning Revolution';
      const text = 'Discover Bluestift, the new educational platform that combines AI and gamification to make learning fun and effective!';

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
      <h3 style="margin-top: 0; color: ${document.body.classList.contains('dark-theme') ? '#f0f0f0' : '#1a1a1a'};"><i class="fas fa-share-alt"></i> Share Bluestift</h3>
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
      
      <button class="close-share" style="margin-top: 15px; width: 100%; padding: 10px; background: #c6c9d276; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
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
  
  testNotification: (message, type = 'info') => {
    showNotification(message, type);
  }
};

// ==========================================
// ✅ INITIALISATION COMPLÈTE
// ==========================================
let subjectNavInitialized = false;

function initSubjectNavigation() {
  // Prevent multiple initializations
  if (subjectNavInitialized) {
    console.log(' ✅ Subject navigation already initialized');
    return;
  }

  const subjectGrid = document.querySelector('.subject-grid');
  const leftArrow = document.getElementById('subject-arrow-left');
  const rightArrow = document.getElementById('subject-arrow-right');

  if (!subjectGrid || !leftArrow || !rightArrow) {
    console.warn('❌ Subject navigation elements not found');
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
  console.log('✅ Subject navigation initialized');
}


// ==========================================
// ✅ INITIALISATION COMPLÈTE
// ==========================================

console.log('✅ Bluestift v4.1 (Supabase Fixed) loaded successfully!');
console.log('💡 Debug commands: window.BluestiftPublicDebug');
console.log('📊 Examples:');
console.log('  window.BluestiftPublicDebug.getStats()');
console.log('🎨 Theme: localStorage');
console.log('🌐 Language: Google Translate');
console.log('☁️ Data: Supabase');