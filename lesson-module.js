// ==========================================
// TAKE A TEST LESSON - MODULE v4.0 (NO CRYPTO)
// Tracking progression uniquement (pas de rewards)
// ==========================================

// Configuration Early Bird (sans tokens)
const EARLY_BIRD_CONFIG = {
  maxUsers: 500,
  benefits: [
    '1 month Premium AI free',
    '15% off forever on all plans',
    'Founder badge',
    'Early access to new features',
    'Priority support',
    'Exclusive community access'
  ]
};

// État global du module lesson
let currentSubject = null;
let currentLesson = null;
let currentStep = 0;
let userAnswers = {};
let lessonStartTime = null;

// ==========================================
// DONNÉES DES LEÇONS
// ==========================================
const lessonsData = {
  science: typeof scienceLessons !== 'undefined' ? scienceLessons : null,
  math: typeof mathLessons !== 'undefined' ? mathLessons : null,
  tech: typeof techLessons !== 'undefined' ? techLessons : null,
  english: typeof englishLessons !== 'undefined' ? englishLessons : null,
  mindBending: typeof mindBendingLessons !== 'undefined' ? mindBendingLessons : null
};

// ==========================================
// VÉRIFICATION AU CHARGEMENT
// ==========================================
console.log('📚 Bluestift Lessons Loading...');
console.log('===================================');

let totalLessons = 0;
Object.entries(lessonsData).forEach(([key, data]) => {
  if (data && data.lessons) {
    console.log(`✅ ${key}: ${data.lessons.length} lesson(s) loaded`);
    totalLessons += data.lessons.length;
  } else {
    console.warn(`⚠️ ${key}: Not loaded or missing`);
  }
});

console.log(`📊 Total: ${totalLessons} lessons available`);
console.log('===================================');

if (totalLessons === 0) {
  console.error('❌ ERROR: No lessons loaded!');
  console.error('💡 Make sure lesson files are loaded BEFORE lesson-module.js');
}

// ==========================================
// 🚀 INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎓 Initializing Lesson Module...');
  initTestLessonModule();
  updateEarlyBirdDisplay();
});

function initTestLessonModule() {
  const testLessonBtn = document.querySelector('.btn-test-lesson');
  
  if (testLessonBtn) {
    console.log('✅ Test Lesson button found');
    testLessonBtn.addEventListener('click', () => {
      console.log('🎯 Test Lesson button clicked!');
      openSubjectModal();
    });
  } else {
    console.warn('⚠️ Test Lesson button NOT found in DOM');
  }
  
  const subjectCards = document.querySelectorAll('.subject-card');
  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.getAttribute('data-subject');
      console.log('📖 Subject selected:', subject);
      selectSubject(subject);
    });
  });
  
  const surpriseBtn = document.getElementById('surprise-btn');
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', surpriseMe);
  }
  
  const backToSubjectsBtn = document.getElementById('back-to-subjects');
  if (backToSubjectsBtn) {
    backToSubjectsBtn.addEventListener('click', () => {
      closeModal('lesson-modal');
      openSubjectModal();
    });
  }
  
  const backToLessonListBtn = document.getElementById('back-to-lesson-list');
  if (backToLessonListBtn) {
    backToLessonListBtn.addEventListener('click', () => {
      closeModal('lesson-viewer');
      selectSubject(currentSubject);
    });
  }
  
  document.getElementById('next-step')?.addEventListener('click', nextLessonStep);
  
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) {
        closeModal(modalId);
      } else {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal.id);
      }
    });
  });
}

// ==========================================
// SUBJECT SELECTION
// ==========================================

function openSubjectModal() {
  console.log('📂 Opening subject modal...');
  showModal('subject-modal');
}

function selectSubject(subjectKey) {
  currentSubject = subjectKey;
  const subject = lessonsData[subjectKey];
  
  if (!subject) {
    console.error(`❌ Subject ${subjectKey} not found`);
    return;
  }
  
  console.log(`📖 Selected subject: ${subject.title}`);
  
  document.getElementById('subject-icon-large').textContent = subject.icon;
  document.getElementById('subject-title').textContent = subject.title;
  
  const lessonList = document.getElementById('lesson-list');
  lessonList.innerHTML = '';
  
  subject.lessons.forEach(lesson => {
    const lessonCard = createLessonCard(lesson);
    lessonList.appendChild(lessonCard);
  });
  
  // Marquer les leçons complétées (si tracking activé)
  markCompletedLessons();
  
  // Initialize lesson navigation arrows
  setTimeout(() => {
    initLessonNavigation();
  }, 100);
  
  closeModal('subject-modal');
  showModal('lesson-modal');
}

function createLessonCard(lesson) {
  const card = document.createElement('div');
  card.className = 'lesson-card';
  card.setAttribute('data-lesson-id', lesson.id);
  
  const stars = '★'.repeat(lesson.difficulty) + '☆'.repeat(5 - lesson.difficulty);
  
  card.innerHTML = `
    <div class="lesson-card-icon">${lesson.icon}</div>
    <h3 class="lesson-card-title">${lesson.title}</h3>
    <p class="lesson-card-subtitle">${lesson.subtitle}</p>
    <div class="lesson-card-meta">
      <span>${lesson.duration}</span>
      <span class="lesson-difficulty">${stars}</span>
    </div>
  `;
  
  card.addEventListener('click', () => {
    startLesson(lesson);
  });
  
  return card;
}

// ==========================================
// 📚 MARQUER LES LEÇONS COMPLÉTÉES
// ==========================================

async function markCompletedLessons() {
  // TODO: Implémenter après refonte DB avec user_progress table
  // Pour l'instant, utiliser localStorage temporaire
  
  try {
    const completedLessons = JSON.parse(localStorage.getItem('bluestift_completed_lessons') || '[]');
    
    document.querySelectorAll('.lesson-card').forEach(card => {
      const lessonId = card.getAttribute('data-lesson-id');
      
      if (completedLessons.includes(lessonId)) {
        if (!card.querySelector('.badge-completed')) {
          const badge = document.createElement('span');
          badge.className = 'badge-completed';
          badge.innerHTML = '✅ Completed';
          badge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #10b981;
            color: white;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            z-index: 10;
          `;
          
          card.style.position = 'relative';
          card.appendChild(badge);
          card.style.opacity = '0.85';
        }
      }
    });
    
    console.log(`✅ Marked ${completedLessons.length} completed lesson(s)`);
    
  } catch (error) {
    console.error('❌ Error marking completed lessons:', error);
  }
}

// ==========================================
// SURPRISE ME
// ==========================================

function surpriseMe() {
  const subjects = Object.keys(lessonsData).filter(key => lessonsData[key] !== null);
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const subjectLessons = lessonsData[randomSubject].lessons;
  const randomLesson = subjectLessons[Math.floor(Math.random() * subjectLessons.length)];
  
  closeModal('subject-modal');
  
  showNotification('🎲 Surprise! Picking a random lesson...', 'info');
  
  setTimeout(() => {
    currentSubject = randomSubject;
    startLesson(randomLesson);
  }, 1000);
}

// ==========================================
// LESSON VIEWER
// ==========================================

function startLesson(lesson) {
  currentLesson = lesson;
  currentStep = 0;
  userAnswers = {};
  lessonStartTime = Date.now();
  
  console.log('🎬 Starting lesson:', lesson.title);
  
  document.getElementById('lesson-icon').textContent = lesson.icon;
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-subtitle').textContent = lesson.subtitle;
  
  updateProgress(0);
  displayLessonStep();
  
  closeModal('lesson-modal');
  showModal('lesson-viewer');
}

function displayLessonStep() {
  const step = currentLesson.steps[currentStep];
  const contentWrapper = document.getElementById('lesson-content');
  const nextBtn = document.getElementById('next-step');
  
  contentWrapper.innerHTML = '';
  
  const stepDiv = document.createElement('div');
  stepDiv.className = 'lesson-step';
  
  switch(step.type) {
    case 'hook':
      stepDiv.innerHTML = `
        <div class="step-hook">
          <h3 class="step-title">${step.content.title}</h3>
          
          <!-- ZONE VISUELLE -->
          <div class="step-visual-zone">
            <div class="step-visual-placeholder">
              <i class="fas fa-play-circle"></i>
              <div>Video/Animation placeholder</div>
            </div>
          </div>
          
          <!-- TEXTE EXPLICATIF -->
          <p class="step-text">${step.content.text}</p>
          
          <!-- RESUME EN 1 LIGNE -->
          ${step.content.summary ? `<div class="step-summary">${step.content.summary}</div>` : ''}
        </div>
      `;
      break;
      
    case 'concept':
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          
          <!-- ZONE VISUELLE -->
          <div class="step-visual-zone">
            <div class="step-visual-placeholder">
              <i class="fas fa-lightbulb"></i>
              <div>Illustration placeholder</div>
            </div>
          </div>
          
          <!-- TEXTE EXPLICATIF -->
          <p class="step-text">${step.content.text}</p>
          
          <!-- HIGHLIGHT SI EXISTE -->
          ${step.content.highlight ? `<div class="step-highlight">${step.content.highlight}</div>` : ''}
          
          <!-- RESUME EN 1 LIGNE -->
          ${step.content.summary ? `<div class="step-summary">${step.content.summary}</div>` : ''}
        </div>
      `;
      break;
      
    case 'real-world':
      const examplesList = step.content.examples.map(ex => `<li>${ex}</li>`).join('');
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          
          <!-- ZONE VISUELLE -->
          <div class="step-visual-zone">
            <div class="step-visual-placeholder">
              <i class="fas fa-globe"></i>
              <div>Real-world examples</div>
            </div>
          </div>
          
          <!-- TEXTE EXPLICATIF -->
          <p class="step-text">${step.content.text}</p>
          <ul style="margin-top: 15px; font-size: 1.1rem; line-height: 1.8; color: white;">${examplesList}</ul>
          
          <!-- RESUME EN 1 LIGNE -->
          ${step.content.summary ? `<div class="step-summary">${step.content.summary}</div>` : ''}
        </div>
      `;
      break;
      
    case 'curiosity':
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          
          <!-- ZONE VISUELLE -->
          <div class="step-visual-zone">
            <div class="step-visual-placeholder">
              <i class="fas fa-question-circle"></i>
              <div>Did you know?</div>
            </div>
          </div>
          
          <!-- TEXTE EXPLICATIF -->
          <p class="step-text">${step.content.text}</p>
          
          <!-- RESUME EN 1 LIGNE -->
          ${step.content.summary ? `<div class="step-summary">${step.content.summary}</div>` : ''}
        </div>
      `;
      break;
      
    case 'quiz':
      stepDiv.innerHTML = `
        <div class="step-quiz">
          <h3 class="step-title">Quick Check! 🎯</h3>
          <p class="step-text">${step.content.question}</p>
          <div class="quiz-options" id="quiz-options">
            ${step.content.options.map((opt, idx) => `
              <div class="quiz-option" data-index="${idx}">
                <div class="option-radio"></div>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      setTimeout(() => {
        document.querySelectorAll('.quiz-option').forEach(opt => {
          opt.addEventListener('click', () => selectQuizOption(opt));
        });
      }, 100);
      
      nextBtn.disabled = true;
      break;
      
    case 'conclusion':
      stepDiv.innerHTML = `
        <div class="step-concept">
          <div class="step-emoji">🤯</div>
          <h3 class="step-title">${step.content.title}</h3>
          <p class="step-text">${step.content.text}</p>
          <div class="step-highlight">${step.content.keyTakeaway}</div>
        </div>
      `;
      nextBtn.textContent = 'Complete Lesson 🎉';
      break;
  }
  
  contentWrapper.appendChild(stepDiv);
  
  const progress = ((currentStep + 1) / currentLesson.steps.length) * 100;
  updateProgress(progress);
  
  if (step.type !== 'quiz') {
    nextBtn.disabled = false;
  }
}

function selectQuizOption(optionElement) {
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  optionElement.classList.add('selected');
  
  const selectedIndex = parseInt(optionElement.getAttribute('data-index'));
  const step = currentLesson.steps[currentStep];
  const isCorrect = selectedIndex === step.content.correct;
  
  userAnswers[currentStep] = {
    selected: selectedIndex,
    correct: isCorrect
  };
  
  setTimeout(() => {
    showQuizFeedback(isCorrect, step.content.explanation);
  }, 500);
}

function showQuizFeedback(isCorrect, explanation) {
  const contentWrapper = document.getElementById('lesson-content');
  const nextBtn = document.getElementById('next-step');
  
  // Remove existing feedback if any
  const existingFeedback = contentWrapper.querySelector('.step-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.style.pointerEvents = 'none';
    const idx = parseInt(opt.getAttribute('data-index'));
    const step = currentLesson.steps[currentStep];
    
    if (idx === step.content.correct) {
      opt.classList.add('correct');
    } else if (opt.classList.contains('selected') && !isCorrect) {
      opt.classList.add('incorrect');
    }
  });
  
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = `step-feedback feedback-${isCorrect ? 'correct' : 'incorrect'}`;
  feedbackDiv.innerHTML = `
    <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
    <h3 class="feedback-title">${isCorrect ? 'CORRECT!' : 'Not quite!'}</h3>
    <p class="feedback-explanation">${explanation}</p>
  `;
  
  contentWrapper.appendChild(feedbackDiv);
  nextBtn.disabled = false;
}

function nextLessonStep() {
  const nextBtn = document.getElementById('next-step');
  
  if (currentStep < currentLesson.steps.length - 1) {
    currentStep++;
    displayLessonStep();
    nextBtn.textContent = 'Next →';
  } else {
    completeLesson();
  }
}

function updateProgress(percentage) {
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  if (progressFill) progressFill.style.width = percentage + '%';
  if (progressText) progressText.textContent = Math.round(percentage) + '%';
}

// ==========================================
// ✅ LESSON COMPLETION (simplifié, sans rewards)
// ==========================================

async function completeLesson() {
  const duration = Math.floor((Date.now() - lessonStartTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeStr = `${minutes}m ${seconds}s`;
  
  const quizSteps = currentLesson.steps.filter(s => s.type === 'quiz');
  const correctQuizzes = quizSteps.filter((_, idx) => {
    const stepIndex = currentLesson.steps.findIndex((s, i) => s.type === 'quiz' && currentLesson.steps.slice(0, i).filter(step => step.type === 'quiz').length === idx);
    return userAnswers[stepIndex]?.correct;
  }).length;
  
  const quizScore = quizSteps.length > 0 ? Math.round((correctQuizzes / quizSteps.length) * 100) : 100;
  
  // Sauvegarder la complétion (localStorage temporaire)
  saveCompletedLesson({
    lessonId: currentLesson.id,
    lessonTitle: currentLesson.title,
    lessonCategory: currentSubject,
    quizScore: quizScore,
    correctQuizzes: correctQuizzes,
    totalQuizzes: quizSteps.length,
    timeSpent: duration,
    completedAt: new Date().toISOString()
  });
  
  console.log('✅ Lesson completed:', currentLesson.title);
  console.log(`📊 Score: ${quizScore}% (${correctQuizzes}/${quizSteps.length})`);
  
  showCompletionScreen(timeStr, correctQuizzes, quizSteps.length, quizScore);
  
  closeModal('lesson-viewer');
  showModal('completion-modal');
}

// Sauvegarder completion (temporaire localStorage)
function saveCompletedLesson(lessonData) {
  try {
    const completed = JSON.parse(localStorage.getItem('bluestift_completed_lessons') || '[]');
    
    if (!completed.includes(lessonData.lessonId)) {
      completed.push(lessonData.lessonId);
      localStorage.setItem('bluestift_completed_lessons', JSON.stringify(completed));
    }
    
    // Sauvegarder détails complétion
    const history = JSON.parse(localStorage.getItem('bluestift_lesson_history') || '[]');
    history.push(lessonData);
    localStorage.setItem('bluestift_lesson_history', JSON.stringify(history));
    
    console.log('💾 Lesson completion saved locally');
    
    // TODO: Envoyer à Supabase user_progress après refonte DB
    
  } catch (error) {
    console.error('❌ Error saving completion:', error);
  }
}

// ==========================================
// ✅ COMPLETION SCREEN (simplifié)
// ==========================================

function showCompletionScreen(timeStr, correctQuizzes, totalQuizzes, quizScore) {
  const completionContent = document.getElementById('completion-content');
  
  const completedCount = JSON.parse(localStorage.getItem('bluestift_completed_lessons') || '[]').length;
  
  completionContent.innerHTML = `
    <div class="completion-content">
      <div class="completion-icon">${currentLesson.icon}</div>
      <h2 class="completion-title">🎉 Lesson Complete!</h2>
      
      <h3 style="margin: 15px 0;">${currentLesson.title}</h3>
      
      <div class="results">
        <h4>📊 Your Results:</h4>
        <p>• Time: ${timeStr}</p>
        <p>• Quizzes: ${correctQuizzes}/${totalQuizzes} correct</p>
        <p>• Score: ${quizScore}%</p>
        <p>• Total lessons completed: ${completedCount}</p>
      </div>
      
      <div class="mind-blown" style="background: #1e3a8a; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <div class="emoji" style="font-size: 3rem;">🤯</div>
        <p style="font-weight: 600; color: #ffffff;">Mind blown? Ask RAYA for deeper insights!</p>
        <p style="font-size: 0.9rem; color: #ffffff; margin-top: 10px;">Premium AI coming soon...</p>
      </div>
      
      <div class="cta-actions">
        <button class="btn-back" onclick="backToLessons()">← Back to Lessons</button>
        <button class="btn-waitlist" onclick="openWaitlistFromCompletion()">
          Join Waitlist for Launch
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// EARLY BIRD SYSTEM
// ==========================================

function checkEarlyBirdStatus() {
  return earlyBirdCount < EARLY_BIRD_CONFIG.maxUsers;
}

function updateEarlyBirdDisplay() {
  const spotsLeft = EARLY_BIRD_CONFIG.maxUsers - earlyBirdCount;
  
  document.querySelectorAll('#spots-left, #spots-left-inline').forEach(el => {
    if (el) el.textContent = spotsLeft;
  });
}

// ==========================================
// ✅ NAVIGATION FUNCTIONS
// ==========================================

function backToLessons() {
  console.log('📂 Back to lessons, subject:', currentSubject);
  
  closeModal('completion-modal');
  
  setTimeout(() => {
    if (currentSubject) {
      selectSubject(currentSubject);
    } else {
      openSubjectModal();
    }
  }, 100);
}

function openWaitlistFromCompletion() {
  closeModal('completion-modal');
  const waitlistModal = document.getElementById('waitlist-modal');
  if (waitlistModal) {
    waitlistModal.style.display = 'block';
  }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    
    // Reset navigation flags when closing
    if (modalId === 'subject-modal' && typeof subjectNavInitialized !== 'undefined') {
      subjectNavInitialized = false;
    }
    if (modalId === 'lesson-modal' && typeof lessonNavInitialized !== 'undefined') {
      lessonNavInitialized = false;
    }
  }
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
    openModals.forEach(modal => {
      modal.style.display = 'none';
    });
  }
  
  if (e.key === 'ArrowRight') {
    const lessonViewer = document.getElementById('lesson-viewer');
    if (lessonViewer && lessonViewer.style.display === 'block') {
      const nextBtn = document.getElementById('next-step');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
      }
    }
  }
});

// ==========================================
// AUTO-SAVE
// ==========================================

setInterval(() => {
  if (currentLesson) {
    const sessionData = {
      currentLesson: currentLesson.id,
      currentStep: currentStep,
      lastActivity: Date.now()
    };
    localStorage.setItem('bluestift_session', JSON.stringify(sessionData));
  }
}, 30000);

// ==========================================
// DEBUG COMMANDS
// ==========================================

window.debugBluestift = window.debugBluestift || {};
Object.assign(window.debugBluestift, {
  lessons: {
    viewData: () => {
      console.log('📚 Lessons Data:', lessonsData);
      return lessonsData;
    },
    countTotal: () => {
      let total = 0;
      Object.values(lessonsData).forEach(subject => {
        if (subject && subject.lessons) total += subject.lessons.length;
      });
      console.log(`📊 Total lessons: ${total}`);
      return total;
    },
    viewCompleted: () => {
      const completed = JSON.parse(localStorage.getItem('bluestift_completed_lessons') || '[]');
      const history = JSON.parse(localStorage.getItem('bluestift_lesson_history') || '[]');
      console.log(`📊 Completed lessons: ${completed.length}`);
      console.table(history);
      return { completed, history };
    },
    clearProgress: () => {
      localStorage.removeItem('bluestift_completed_lessons');
      localStorage.removeItem('bluestift_lesson_history');
      console.log('✅ Progress cleared');
    }
  },
  resetEarlyBird: () => {
    localStorage.setItem('bluestift_early_bird_count', '0');
    earlyBirdCount = 0;
    updateEarlyBirdDisplay();
    console.log('✅ Early Bird counter reset');
  },
  getStats: () => {
    const completed = JSON.parse(localStorage.getItem('bluestift_completed_lessons') || '[]');
    return {
      earlyBirdCount,
      spotsLeft: EARLY_BIRD_CONFIG.maxUsers - earlyBirdCount,
      completedLessons: completed.length,
      isEarlyBird: checkEarlyBirdStatus()
    };
  }
});

console.log('🎓 Bluestift Lesson Module v4.0 ready!');
console.log('📊 WITHOUT Crypto/Rewards System');
console.log('💡 Debug: window.debugBluestift.lessons');
// ==========================================
// LESSON HORIZONTAL NAVIGATION
// ==========================================
let lessonNavInitialized = false;

function initLessonNavigation() {
  // Prevent multiple initializations
  if (lessonNavInitialized) {
    console.log('Lesson navigation already initialized');
    return;
  }

  const lessonList = document.querySelector('.lesson-list');
  const leftArrow = document.getElementById('lesson-arrow-left');
  const rightArrow = document.getElementById('lesson-arrow-right');

  if (!lessonList || !leftArrow || !rightArrow) {
    console.warn('⚠️ Lesson navigation elements not found');
    return;
  }

  // Get original cards (non-clones)
  const originalCards = Array.from(lessonList.querySelectorAll('.lesson-card:not(.clone)'));
  const totalOriginal = originalCards.length;

  if (totalOriginal === 0) {
    console.warn('⚠️ No lesson cards found');
    return;
  }

  const cloneCount = 2;
  let currentIndex = 0;
  let isTransitioning = false;

  // Setup infinite loop with clones
  function setupClones() {
    // Remove existing clones first
    lessonList.querySelectorAll('.lesson-card.clone').forEach(c => c.remove());

    // Clone last cards to the beginning
    for (let i = cloneCount; i > 0; i--) {
      const sourceIndex = ((totalOriginal - i) % totalOriginal + totalOriginal) % totalOriginal;
      const clone = originalCards[sourceIndex].cloneNode(true);
      clone.classList.add('clone');
      lessonList.insertBefore(clone, lessonList.firstChild);
    }

    // Clone first cards to the end
    for (let i = 0; i < cloneCount; i++) {
      const clone = originalCards[i % totalOriginal].cloneNode(true);
      clone.classList.add('clone');
      lessonList.appendChild(clone);
    }
  }

  setupClones();
  const allCards = Array.from(lessonList.querySelectorAll('.lesson-card'));

  // Scroll to a position index (including clones)
  function scrollToPosition(posIndex, instant = false) {
    const card = allCards[posIndex];
    if (!card) return;

    const listRect = lessonList.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const listCenter = listRect.left + listRect.width / 2;
    const scrollOffset = cardCenter - listCenter;

    lessonList.scrollBy({
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

  lessonNavInitialized = true;
  console.log('Lesson navigation initialized');
}