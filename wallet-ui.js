/**
 * 💼 BLUESTIFT - MY WALLET UI v2.1 (FIXED)
 * ✅ Ne crée plus de wallet manuellement (trigger SQL)
 * ✅ Gestion d'erreurs améliorée
 */

document.addEventListener('DOMContentLoaded', () => {
  initWalletModal();
});

function initWalletModal() {
  const walletBtn = document.getElementById('wallet-btn');
  const walletModal = document.getElementById('wallet-modal');
  const closeBtn = walletModal?.querySelector('.close-modal');

  if (walletBtn) {
    walletBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (walletModal) {
        walletModal.style.display = 'block';
      }
      
      await loadWalletUI();
      
      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      walletModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === walletModal) {
      walletModal.style.display = 'none';
    }
  });
}

async function loadWalletUI() {
  const container = document.getElementById('wallet-container');
  
  if (!container) {
    console.error('❌ Wallet container not found');
    return;
  }
  
  container.innerHTML = `
    <div class="wallet-loading" style="text-align: center; padding: 40px; color: #666;">
      <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 20px;"></i>
      <p>Loading your wallet...</p>
    </div>
  `;
  
  if (!window.BluestiftDB) {
    await waitForSupabase();
  }
  
  const userEmail = getUserEmail();
  
  if (!userEmail) {
    showNotRegisteredState(container);
    return;
  }
  
  const isInWaitlist = await checkWaitlistStatus(userEmail);
  
  if (!isInWaitlist) {
    showNotRegisteredState(container);
    return;
  }
  
  try {
    let wallet = await window.WBSPWallet.getWallet(userEmail);
    
    // ✅ CORRECTION: Si pas de wallet, suggérer de rejoindre la waitlist
    if (!wallet) {
      showWalletNotCreatedYet(container, userEmail);
      return;
    }
    
    displayWallet(container, wallet);
    
  } catch (error) {
    console.error('❌ Wallet loading error:', error);
    showError(container, error.message);
  }
}

async function waitForSupabase() {
  let attempts = 0;
  while (!window.BluestiftDB && attempts < 50) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }
  
  if (!window.BluestiftDB) {
    throw new Error('Supabase not loaded');
  }
}

function showNotRegisteredState(container) {
  container.innerHTML = `
    <div class="wallet-not-registered" style="text-align: center; padding: 40px;">
      <i class="fas fa-lock" style="font-size: 4rem; color: #667eea; margin-bottom: 20px;"></i>
      <h3 style="color: #1a1a1a; margin-bottom: 15px;">🎫 Join the Waitlist to Unlock Your Wallet</h3>
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        To earn and track WBSP tokens, you need to be registered on our waitlist.
        <br><br>
        <strong style="color: #667eea;">Early Birds (first 500 users) get:</strong>
      </p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 1.5rem;">💎</span>
          <span>100 WBSP signup bonus</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 1.5rem;">🎓</span>
          <span>Rewards for first 10 lessons (up to 10 WBSP each)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🏆</span>
          <span>Exclusive benefits at launch</span>
        </div>
      </div>
      <button class="btn-join-waitlist" onclick="openWaitlistFromWallet()" 
              style="padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; border: none; border-radius: 8px; font-weight: 600; 
                     cursor: pointer; font-size: 1rem;">
        <i class="fas fa-rocket"></i> Join the Waitlist Now
      </button>
    </div>
  `;
}

// ✅ NOUVEAU: État "wallet pas encore créé"
function showWalletNotCreatedYet(container, email) {
  container.innerHTML = `
    <div class="wallet-pending" style="text-align: center; padding: 40px;">
      <i class="fas fa-hourglass-half" style="font-size: 4rem; color: #f59e0b; margin-bottom: 20px;"></i>
      <h3 style="color: #1a1a1a; margin-bottom: 15px;">⏳ Wallet Being Created...</h3>
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        You're registered on the waitlist but your wallet is being created.
        <br><br>
        This usually takes a few seconds. Please refresh the page.
      </p>
      <button onclick="loadWalletUI()" 
              style="padding: 12px 24px; background: #667eea; color: white; border: none; 
                     border-radius: 8px; font-weight: 600; cursor: pointer;">
        <i class="fas fa-sync-alt"></i> Refresh Wallet
      </button>
      <p style="margin-top: 20px; font-size: 0.9rem; color: #999;">
        Email: ${email}
      </p>
    </div>
  `;
}

function displayWallet(container, wallet) {
  const isEarlyBird = wallet.isEarlyBird;
  const totalTokens = wallet.tokens.total || 0;
  const signupBonus = wallet.tokens.signup || 0;
  const lessonRewards = wallet.tokens.lessons || 0;
  const lessonsCompleted = wallet.lessonsCompleted || 0;
  
  // ✅ CORRECTION: Utiliser lesson_history (underscore)
  const lessonsHistory = wallet.lesson_history || [];
  const lessonsRewarded = lessonsHistory.filter(l => l.tokensEarned > 0).length;
  const maxRewards = 10;
  const progressPercent = Math.min((lessonsRewarded / maxRewards) * 100, 100);
  
  const historyHTML = lessonsHistory.length > 0
    ? lessonsHistory
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .map(lesson => {
          const date = new Date(lesson.completedAt);
          const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          return `
            <div class="lesson-history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 10px;">
              <div class="lesson-info">
                <div class="lesson-title-hist" style="font-weight: 600; color: #1a1a1a; margin-bottom: 5px;">📚 ${lesson.lessonTitle}</div>
                <div class="lesson-date" style="font-size: 0.85rem; color: #999;">${dateStr}</div>
              </div>
              <div class="lesson-reward" style="display: flex; align-items: center; gap: 5px; font-weight: 600; color: #10b981;">
                <i class="fas fa-coins"></i>
                +${lesson.tokensEarned} WBSP
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="empty-history" style="text-align: center; padding: 40px; color: #999;">
        <i class="fas fa-graduation-cap" style="font-size: 3rem; opacity: 0.5; margin-bottom: 15px;"></i>
        <p style="margin-bottom: 5px;"><strong>No lessons completed yet</strong></p>
        <p style="font-size: 0.9rem;">Complete lessons to earn WBSP rewards!</p>
      </div>
    `;
  
  container.innerHTML = `
    <div class="wallet-display">
      
      <!-- Balance Card -->
      <div class="balance-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <div class="balance-card-content">
          <div class="balance-label" style="opacity: 0.9; margin-bottom: 10px;">💰 Total Balance</div>
          <div class="balance-amount" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;">
            <span class="coin-icon" style="font-size: 3rem;">🕸</span>
            <span style="font-size: 3.5rem; font-weight: bold;">${totalTokens}</span>
            <span style="font-size: 1.5rem; opacity: 0.9;">WBSP</span>
          </div>
          
          <div class="balance-breakdown" style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
            <div class="balance-item">
              <div class="balance-item-label" style="font-size: 0.85rem; opacity: 0.8;">Signup Bonus</div>
              <div class="balance-item-value" style="font-size: 1.5rem; font-weight: 600;">${signupBonus}</div>
            </div>
            <div class="balance-item">
              <div class="balance-item-label" style="font-size: 0.85rem; opacity: 0.8;">Lesson Rewards</div>
              <div class="balance-item-value" style="font-size: 1.5rem; font-weight: 600;">${lessonRewards}</div>
            </div>
          </div>
          
          <div class="wallet-status" style="display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; ${isEarlyBird ? 'background: rgba(251, 191, 36, 0.2); border: 2px solid rgba(251, 191, 36, 0.5);' : 'background: rgba(255, 255, 255, 0.2); border: 2px solid rgba(255, 255, 255, 0.3);'}">
            ${isEarlyBird ? '🔥 Early Bird Member' : '💤 Regular Member'}
          </div>
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="wallet-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div class="stat-card-wallet" style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div class="stat-icon" style="font-size: 2rem; margin-bottom: 10px;">📚</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: #667eea; margin-bottom: 5px;">${lessonsCompleted}</div>
          <div class="stat-label" style="font-size: 0.85rem; color: #666;">Lessons Completed</div>
        </div>
        
        <div class="stat-card-wallet" style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div class="stat-icon" style="font-size: 2rem; margin-bottom: 10px;">💎</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: #667eea; margin-bottom: 5px;">${lessonsRewarded}/${maxRewards}</div>
          <div class="stat-label" style="font-size: 0.85rem; color: #666;">Rewarded Lessons</div>
        </div>
        
        <div class="stat-card-wallet" style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div class="stat-icon" style="font-size: 2rem; margin-bottom: 10px;">🎯</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: #667eea; margin-bottom: 5px;">${maxRewards - lessonsRewarded}</div>
          <div class="stat-label" style="font-size: 0.85rem; color: #666;">Rewards Left</div>
        </div>
      </div>
      
      <!-- Progress (Early Birds only) -->
      ${isEarlyBird ? `
        <div class="lesson-progress" style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div class="progress-label" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 600; color: #667eea;">
            <span>🎓 Early Bird Progress</span>
            <span>${lessonsRewarded}/10 Lessons</span>
          </div>
          <div class="progress-bar-wallet" style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
            <div class="progress-fill-wallet" style="width: ${progressPercent}%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transition: width 0.5s ease;"></div>
          </div>
          <p style="margin-top: 10px; font-size: 0.9rem; color: #1e40af;">
            ${lessonsRewarded < maxRewards 
              ? `Complete ${maxRewards - lessonsRewarded} more lesson(s) to maximize your Early Bird rewards!` 
              : '🎉 Congratulations! You\'ve maxed out your Early Bird rewards!'}
          </p>
        </div>
      ` : ''}
      
      <!-- Lesson History -->
      <div class="lesson-history" style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: #1a1a1a;">
          <i class="fas fa-history"></i>
          Lesson History
        </h3>
        
        <div class="lesson-history-list">
          ${historyHTML}
        </div>
      </div>
      
      <!-- Actions -->
      <div class="wallet-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <button class="btn-wallet-action btn-learn-more" onclick="openWBSPDocs()" 
                style="padding: 12px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fas fa-book"></i>
          Learn About WBSP
        </button>
        <button class="btn-wallet-action btn-share-wallet" onclick="shareWallet()" 
                style="padding: 12px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fas fa-share-alt"></i>
          Share & Earn
        </button>
      </div>
      
    </div>
  `;
}

function showError(container, message) {
  container.innerHTML = `
    <div class="wallet-error" style="text-align: center; padding: 40px;">
      <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;"></i>
      <h3 style="color: #1a1a1a; margin-bottom: 15px;">Oops! Something went wrong</h3>
      <p style="color: #666; margin-bottom: 25px;">${message}</p>
      <button class="btn-retry" onclick="loadWalletUI()" 
              style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
        <i class="fas fa-sync-alt"></i>
        Retry
      </button>
    </div>
  `;
}

async function checkWaitlistStatus(email) {
  try {
    const { data, error } = await window.BluestiftDB.supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .limit(1)
      .maybeSingle();
    
    return !error && data !== null;
    
  } catch (error) {
    console.warn('⚠️ Waitlist check failed:', error);
    return false;
  }
}

async function getWaitlistEntry(email) {
  try {
    const { data, error } = await window.BluestiftDB.supabase
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1)
      .maybeSingle();
    
    if (error) return null;
    return data;
    
  } catch (error) {
    console.warn('⚠️ Waitlist entry fetch failed:', error);
    return null;
  }
}

function getUserEmail() {
  return localStorage.getItem('bluestift_user_email');
}

window.openWaitlistFromWallet = function() {
  const walletModal = document.getElementById('wallet-modal');
  const waitlistModal = document.getElementById('waitlist-modal');
  
  if (walletModal) walletModal.style.display = 'none';
  if (waitlistModal) waitlistModal.style.display = 'block';
}

window.openWBSPDocs = function() {
  const walletModal = document.getElementById('wallet-modal');
  const docModal = document.getElementById('documentation-modal');
  
  if (walletModal) walletModal.style.display = 'none';
  if (docModal) {
    docModal.style.display = 'block';
    
    const officialTab = document.querySelector('[data-tab="official"]');
    if (officialTab) officialTab.click();
  }
}

window.shareWallet = function() {
  const userEmail = getUserEmail();
  
  if (!userEmail) {
    if (typeof showNotification === 'function') {
      showNotification('⚠️ Please login first', 'info');
    }
    return;
  }
  
  const shareText = `🚀 I'm earning WBSP tokens on Bluestift! Join me and get rewarded for learning. #Bluestift #WBSP #LearnToEarn`;
  const shareUrl = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: 'Join Bluestift',
      text: shareText,
      url: shareUrl
    }).then(() => {
      if (typeof showNotification === 'function') {
        showNotification('📤 Thanks for sharing!', 'success');
      }
    }).catch(err => {
      console.log('Share cancelled', err);
    });
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      if (typeof showNotification === 'function') {
        showNotification('📋 Link copied! Share it with your friends', 'success');
      }
    });
  }
}

window.refreshWalletUI = async function() {
  const walletModal = document.getElementById('wallet-modal');
  
  if (walletModal && walletModal.style.display === 'block') {
    console.log('🔄 Refreshing wallet UI...');
    await loadWalletUI();
  }
}

console.log('💼 Wallet UI v2.1 (FIXED) loaded!');
console.log('✅ Wallet auto-créé par trigger SQL');