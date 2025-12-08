// ==========================================
// TAKE A TEST LESSON - MODULE (WITH WBSP)
// Version: 3.0 FIXED - WITH PENDING LESSONS SYSTEM
// ==========================================

// Configuration Early Bird
const EARLY_BIRD_CONFIG = {
  maxUsers: 500,
  signupBonus: 100,
  maxLessonsRewarded: 10,
  tokensPerQuiz: 2,
  tokensPerStep: {
    hook: 0,
    concept: 1,
    'real-world': 0,
    curiosity: 1,
    conclusion: 0
  },
  maxTokensPerLesson: 10
};

// État global du module lesson
let currentSubject = null;
let currentLesson = null;
let currentStep = 0;
let userAnswers = {};
let lessonStartTime = null;
let earnedTokens = {
  steps: 0,
  quizzes: 0
};

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
// 🆕 SYSTÈME DE LEÇONS PENDING
// ==========================================

function savePendingLesson(lessonData) {
  try {
    const pending = JSON.parse(localStorage.getItem('bluestift_pending_lessons') || '[]');
    
    const exists = pending.find(l => l.lessonId === lessonData.lessonId);
    if (exists) {
      console.log('⚠️ Lesson already in pending list');
      return false;
    }
    
    pending.push({
      lessonId: lessonData.lessonId,
      lessonTitle: lessonData.lessonTitle,
      tokensEarned: lessonData.tokensEarned,
      completedAt: new Date().toISOString(),
      status: 'pending_wallet'
    });
    
    localStorage.setItem('bluestift_pending_lessons', JSON.stringify(pending));
    
    console.log(`💾 Lesson saved as pending: ${lessonData.lessonTitle} (+${lessonData.tokensEarned} WBSP)`);
    console.log(`📊 Total pending: ${pending.length} lesson(s)`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error saving pending lesson:', error);
    return false;
  }
}

function getPendingLessons() {
  try {
    return JSON.parse(localStorage.getItem('bluestift_pending_lessons') || '[]');
  } catch (error) {
    console.error('❌ Error reading pending lessons:', error);
    return [];
  }
}

async function migratePendingLessons(email) {
  try {
    console.log('🔄 Starting pending lessons migration...');
    
    const pending = getPendingLessons();
    
    if (pending.length === 0) {
      console.log('✅ No pending lessons to migrate');
      return { success: true, migrated: 0, failed: 0 };
    }
    
    console.log(`📊 Found ${pending.length} pending lesson(s) to migrate`);
    
    const wallet = await window.WBSPWallet.getWallet(email);
    if (!wallet) {
      console.error('❌ Wallet not found, cannot migrate');
      return { success: false, error: 'Wallet not found' };
    }
    
    let migratedCount = 0;
    let failedCount = 0;
    const migrated = [];
    const failed = [];
    
    for (const lesson of pending) {
      try {
        console.log(`🔄 Migrating: ${lesson.lessonTitle}...`);
        
        const result = await window.WBSPWallet.addLessonReward(email, {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          tokensEarned: lesson.tokensEarned
        });
        
        if (result && result.success) {
          console.log(`✅ Migrated: ${lesson.lessonTitle} (+${result.tokens_earned} WBSP)`);
          migratedCount++;
          migrated.push(lesson);
        } else {
          console.warn(`⚠️ Migration skipped for ${lesson.lessonTitle}: ${result?.error}`);
          
          if (result?.error && !result.error.includes('Maximum rewarded lessons') && !result.error.includes('already completed')) {
            failedCount++;
            failed.push({ lesson, error: result?.error });
          } else {
            migrated.push(lesson);
          }
        }
        
      } catch (error) {
        console.error(`❌ Migration error for ${lesson.lessonTitle}:`, error);
        failedCount++;
        failed.push({ lesson, error: error.message });
      }
    }
    
    if (migrated.length > 0) {
      const remaining = pending.filter(l => !migrated.find(m => m.lessonId === l.lessonId));
      localStorage.setItem('bluestift_pending_lessons', JSON.stringify(remaining));
      
      console.log(`✅ Migration complete: ${migratedCount} credited, ${pending.length - migratedCount} processed`);
      console.log(`📊 Remaining pending: ${remaining.length}`);
    }
    
    return {
      success: true,
      migrated: migratedCount,
      failed: failedCount,
      total: pending.length,
      details: { migrated, failed }
    };
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, error: error.message };
  }
}

window.migratePendingLessons = migratePendingLessons;
window.getPendingLessons = getPendingLessons;

// ==========================================
// 🔧 HELPER FUNCTIONS
// ==========================================

function getUserEmail() {
  let userEmail = localStorage.getItem('bluestift_user_email');
  
  if (userEmail) {
    return userEmail;
  }
  
  userEmail = prompt('To save your WBSP rewards, please enter your email:');
  
  if (userEmail && userEmail.includes('@')) {
    localStorage.setItem('bluestift_user_email', userEmail.toLowerCase());
    return userEmail.toLowerCase();
  }
  
  return null;
}

function logoutUser() {
  localStorage.removeItem('bluestift_user_email');
  console.log('✅ User logged out');
}

// ==========================================
// INITIALISATION
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
  
  // ✅ FIX: Event listeners simples sans duplication
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

// ✅ FIX: Redevenu synchrone comme en v2.1
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
  
  // ✅ FIX: Marquer les leçons en asynchrone APRÈS la transition
  markCompletedLessons();
  
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
    <div class="lesson-card-content">
      <h3 class="lesson-card-title">${lesson.title}</h3>
      <p class="lesson-card-subtitle">${lesson.subtitle}</p>
      <div class="lesson-card-meta">
        <span>⏱️ ${lesson.duration}</span>
        <span class="lesson-difficulty">${stars}</span>
        <span>💎 Up to 10 WBSP</span>
      </div>
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
  const userEmail = getUserEmail();
  if (!userEmail) return;
  
  try {
    const wallet = await window.BluestiftDB.getWallet(userEmail);
    const completedIds = wallet?.lesson_history?.map(l => l.lesson_id) || [];
    
    const pending = getPendingLessons();
    const pendingIds = pending.map(l => l.lessonId);
    
    const allCompletedIds = [...new Set([...completedIds, ...pendingIds])];
    
    document.querySelectorAll('.lesson-card').forEach(card => {
      const lessonId = card.getAttribute('data-lesson-id');
      
      if (allCompletedIds.includes(lessonId)) {
        if (!card.querySelector('.badge-completed')) {
          const isPending = pendingIds.includes(lessonId);
          const badge = document.createElement('span');
          badge.className = 'badge-completed';
          badge.innerHTML = isPending ? '⏳ Pending' : '✅ Completed';
          badge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: ${isPending ? '#f59e0b' : '#10b981'};
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
          if (!isPending) card.style.opacity = '0.85';
        }
      }
    });
    
    console.log(`✅ Marked ${allCompletedIds.length} completed lesson(s) (${completedIds.length} in wallet, ${pendingIds.length} pending)`);
    
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
  earnedTokens = {
    steps: 0,
    quizzes: 0
  };
  
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
          <div class="step-emoji">${step.content.emoji}</div>
          <h3 class="step-title">${step.content.title}</h3>
          <p class="step-text">${step.content.text}</p>
        </div>
      `;
      earnedTokens.steps += EARLY_BIRD_CONFIG.tokensPerStep.hook;
      break;
      
    case 'concept':
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          <p class="step-text">${step.content.text}</p>
          ${step.content.highlight ? `<div class="step-highlight">💡 ${step.content.highlight}</div>` : ''}
          <div class="step-emoji">${step.content.emoji}</div>
        </div>
      `;
      earnedTokens.steps += EARLY_BIRD_CONFIG.tokensPerStep.concept;
      break;
      
    case 'real-world':
      const examplesList = step.content.examples.map(ex => `<li>${ex}</li>`).join('');
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          <p class="step-text">${step.content.text}</p>
          <ul style="margin-top: 15px; font-size: 1.1rem; line-height: 1.8;">${examplesList}</ul>
        </div>
      `;
      earnedTokens.steps += EARLY_BIRD_CONFIG.tokensPerStep['real-world'];
      break;
      
    case 'curiosity':
      stepDiv.innerHTML = `
        <div class="step-concept">
          <h3 class="step-title">${step.content.title}</h3>
          <p class="step-text">${step.content.text}</p>
        </div>
      `;
      earnedTokens.steps += EARLY_BIRD_CONFIG.tokensPerStep.curiosity;
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
      earnedTokens.steps += EARLY_BIRD_CONFIG.tokensPerStep.conclusion;
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
  
  const tokensForQuiz = isCorrect ? EARLY_BIRD_CONFIG.tokensPerQuiz : 0;
  earnedTokens.quizzes += tokensForQuiz;
  
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = `step-feedback feedback-${isCorrect ? 'correct' : 'incorrect'}`;
  feedbackDiv.innerHTML = `
    <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
    <h3 class="feedback-title">${isCorrect ? 'CORRECT!' : 'Not quite!'}</h3>
    <p class="feedback-explanation">${explanation}</p>
    ${isCorrect ? `<div class="tokens-earned">🪙 +${EARLY_BIRD_CONFIG.tokensPerQuiz} WBSP</div>` : ''}
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

function capTokensToMax(rawTokens) {
  const capped = Math.min(rawTokens, EARLY_BIRD_CONFIG.maxTokensPerLesson);
  
  if (rawTokens > EARLY_BIRD_CONFIG.maxTokensPerLesson) {
    console.log(`🔒 Tokens capped: ${rawTokens} → ${capped} WBSP`);
  }
  
  return capped;
}

// ==========================================
// ✅ LESSON COMPLETION (MODIFIÉ AVEC PENDING)
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
  
  const rawTokens = earnedTokens.steps + earnedTokens.quizzes;
  const totalTokens = capTokensToMax(rawTokens);
  
  console.log(`📊 Tokens earned: ${rawTokens} raw → ${totalTokens} final`);
  
  const lessonData = {
    lessonTitle: currentLesson.title,
    lessonId: currentLesson.id,
    tokensEarned: totalTokens,
    correctQuizzes: correctQuizzes,
    totalQuizzes: quizSteps.length,
    completedAt: new Date().toISOString()
  };
  
  const userEmail = getUserEmail();
  let rewardResult = null;
  
  if (userEmail && window.WBSPWallet) {
    try {
      const wallet = await window.WBSPWallet.getWallet(userEmail);
      
      if (wallet) {
        console.log('💼 Wallet found, adding reward...');
        rewardResult = await window.WBSPWallet.addLessonReward(userEmail, lessonData);
        
        if (rewardResult && rewardResult.success) {
          console.log(`💰 Reward SUCCESS! +${rewardResult.tokens_earned} WBSP → ${rewardResult.new_balance} total`);
        } else {
          console.warn(`⚠️ Reward not added: ${rewardResult?.error}`);
        }
      } else {
        console.log('⏳ No wallet yet, saving as pending...');
        savePendingLesson(lessonData);
      }
      
    } catch (error) {
      console.error('❌ Reward system error:', error);
      savePendingLesson(lessonData);
    }
  } else {
    console.log('⏳ No email provided, saving as pending...');
    savePendingLesson(lessonData);
  }

  if (typeof refreshWalletUI === 'function') {
    try {
      await refreshWalletUI();
    } catch (err) {
      console.warn('⚠️ Wallet UI refresh failed:', err);
    }
  }
  
  showCompletionScreen(timeStr, correctQuizzes, quizSteps.length, totalTokens, rewardResult);
  
  closeModal('lesson-viewer');
  showModal('completion-modal');
}

// ==========================================
// ✅ COMPLETION SCREEN (MODIFIÉ AVEC PENDING)
// ==========================================

function showCompletionScreen(timeStr, correctQuizzes, totalQuizzes, tokensEarned, rewardResult) {
  const completionContent = document.getElementById('completion-content');
  
  const pendingLessons = getPendingLessons();
  const hasPending = pendingLessons.length > 0;
  const pendingTotal = pendingLessons.reduce((sum, l) => sum + l.tokensEarned, 0);
  
  completionContent.innerHTML = `
    <div class="completion-content">
      <div class="completion-icon">${currentLesson.icon}</div>
      <h2 class="completion-title">🎉 Lesson Complete!</h2>
      
      <h3 style="margin: 15px 0;">${currentLesson.title}</h3>
      
      <div id="wallet-total-display"></div>
      
      <div class="results">
        <h4>📊 Your Results:</h4>
        <p>• Time: ${timeStr}</p>
        <p>• Quizzes: ${correctQuizzes}/${totalQuizzes} correct</p>
        <p>• Tokens earned: ${tokensEarned} WBSP 🪙</p>
      </div>
      
      ${hasPending ? `
        <div class="pending-notice" style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #f59e0b;">
          <h4 style="color: #92400e; margin-bottom: 10px;">⏳ Lessons Pending</h4>
          <p style="color: #78350f; margin-bottom: 10px;">
            You have <strong>${pendingLessons.length} lesson(s)</strong> waiting to be credited!
          </p>
          <p style="color: #78350f; font-size: 0.9rem;">
            Join the waitlist to instantly claim <strong>${pendingTotal} WBSP</strong> 🪙
          </p>
        </div>
      ` : ''}
      
      ${rewardResult && rewardResult.success ? `
        <div class="reward-success" style="background: #d1fae5; padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #10b981;">
          <h4 style="color: #065f46; margin-bottom: 10px;">✅ Reward Credited</h4>
          <p style="color: #047857;">
            +${rewardResult.tokens_earned} WBSP added to your wallet!
          </p>
          <p style="color: #047857; font-size: 0.9rem;">
            New balance: ${rewardResult.new_balance} WBSP | Lessons: ${rewardResult.lessons_completed}/10
          </p>
        </div>
      ` : !rewardResult && hasPending ? `
        <div class="pending-reward" style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #3b82f6;">
          <p style="color: #1e40af;">
            💡 This lesson is saved! Join the waitlist to claim your rewards.
          </p>
        </div>
      ` : ''}
      
      <div class="cta-actions">
        <button class="btn-back" onclick="backToLessons()">← Back to Lessons</button>
        ${hasPending || !rewardResult ? `
          <button class="btn-waitlist" onclick="openWaitlistFromCompletion()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); animation: pulse 2s infinite;">
            🎫 Join Waitlist ${hasPending ? `(+${pendingTotal} WBSP)` : ''}
          </button>
        ` : `
          <button class="btn-waitlist" onclick="openWaitlistFromCompletion()">
            Join Waitlist for Launch
          </button>
        `}
      </div>
    </div>
    
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    </style>
  `;
  
  const userEmail = getUserEmail();
  if (userEmail && window.WBSPWallet && rewardResult) {
    window.WBSPWallet.getWallet(userEmail).then(wallet => {
      if (wallet) {
        const walletDisplay = document.getElementById('wallet-total-display');
        if (walletDisplay) {
          walletDisplay.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 10px; margin: 15px 0; color: white;">
              <h4 style="margin: 0 0 10px 0;">💼 Your Total WBSP Balance</h4>
              <p style="font-size: 2rem; font-weight: bold; margin: 0;">${wallet.balance_total} WBSP 🪙</p>
              <p style="font-size: 0.9rem; opacity: 0.9; margin: 5px 0 0 0;">
                Signup: ${wallet.balance_signup} | Lessons: ${wallet.balance_lessons}
              </p>
            </div>
          `;
        }
      }
    }).catch(err => console.warn('⚠️ Wallet display error:', err));
  }
}

// ==========================================
// EARLY BIRD SYSTEM
// ==========================================

function checkEarlyBirdStatus() {
  return earlyBirdCount < EARLY_BIRD_CONFIG.maxUsers;
}

function getUserLessonsCompleted() {
  return parseInt(localStorage.getItem('bluestift_lessons_completed') || '0');
}

function incrementUserLessons() {
  const current = getUserLessonsCompleted();
  localStorage.setItem('bluestift_lessons_completed', (current + 1).toString());
}

function updateEarlyBirdDisplay() {
  const spotsLeft = EARLY_BIRD_CONFIG.maxUsers - earlyBirdCount;
  
  document.querySelectorAll('#spots-left, #spots-left-inline').forEach(el => {
    if (el) el.textContent = spotsLeft;
  });
  
  const banner = document.getElementById('early-bird-banner');
  const bannerInline = document.getElementById('early-bird-banner-inline');
  
  if (spotsLeft > 0) {
    if (banner) banner.style.display = 'block';
    if (bannerInline) bannerInline.style.display = 'block';
  } else {
    if (banner) banner.style.display = 'none';
    if (bannerInline) bannerInline.style.display = 'none';
  }
}

function registerEarlyBird() {
  if (earlyBirdCount < EARLY_BIRD_CONFIG.maxUsers) {
    earlyBirdCount++;
    localStorage.setItem('bluestift_early_bird_count', earlyBirdCount.toString());
    updateEarlyBirdDisplay();
    return true;
  }
  return false;
}

// ==========================================
// ✅ NAVIGATION FUNCTIONS (FIXED)
// ==========================================

function backToLessons() {
  console.log('📂 Back to lessons, subject:', currentSubject);
  
  // ✅ FIX: Fermer d'abord completion-modal
  closeModal('completion-modal');
  
  // Petit délai pour transition fluide
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
      userId: 'user_' + Date.now(),
      lessonsCompleted: getUserLessonsCompleted(),
      isEarlyBird: checkEarlyBirdStatus(),
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
    viewTokenConfig: () => {
      console.log('🪙 Token Configuration:', EARLY_BIRD_CONFIG);
      return EARLY_BIRD_CONFIG;
    },
    testTokenCapping: () => {
      console.log('🧪 Testing token capping:');
      [8, 10, 11, 15, 20].forEach(val => {
        console.log(`Raw: ${val} → Capped: ${capTokensToMax(val)}`);
      });
    },
    viewPending: () => {
      const pending = getPendingLessons();
      console.log(`📊 Pending lessons: ${pending.length}`);
      console.table(pending);
      return pending;
    },
    clearPending: () => {
      localStorage.removeItem('bluestift_pending_lessons');
      console.log('✅ Pending lessons cleared');
    },
    testMigration: async (email) => {
      if (!email) {
        console.error('❌ Please provide email: debugBluestift.lessons.testMigration("user@example.com")');
        return;
      }
      const result = await migratePendingLessons(email);
      console.log('Migration result:', result);
      return result;
    }
  },
  resetEarlyBird: () => {
    localStorage.setItem('bluestift_early_bird_count', '0');
    earlyBirdCount = 0;
    updateEarlyBirdDisplay();
    console.log('✅ Early Bird counter reset');
  },
  resetLessons: () => {
    localStorage.setItem('bluestift_lessons_completed', '0');
    console.log('✅ User lessons reset');
  },
  getStats: () => {
    const pending = getPendingLessons();
    return {
      earlyBirdCount,
      spotsLeft: EARLY_BIRD_CONFIG.maxUsers - earlyBirdCount,
      userLessons: getUserLessonsCompleted(),
      isEarlyBird: checkEarlyBirdStatus(),
      pendingLessons: pending.length,
      pendingTokens: pending.reduce((sum, l) => sum + l.tokensEarned, 0)
    };
  },
  getCurrentUser: () => {
    const email = getUserEmail();
    if (email) {
      console.log('📧 Current user:', email);
      return email;
    } else {
      console.log('❌ No user logged in');
      return null;
    }
  },
  logout: () => {
    logoutUser();
    console.log('✅ User logged out');
  }
});

console.log('🎓 Bluestift Lesson Module v3.0 ready!');
console.log('💰 WITH WBSP WALLET INTEGRATION');
console.log('⏳ WITH PENDING LESSONS SYSTEM');
console.log('🔒 MAX 10 WBSP PER LESSON CAP ACTIVE');
console.log('💡 Debug: window.debugBluestift.lessons');