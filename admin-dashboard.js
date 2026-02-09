// ==========================================
// BLUESTIFT ADMIN DASHBOARD - SUPABASE v2.1
// ✅ Fixed: Signed URLs for private bucket
// ==========================================

let currentContributionId = null;
let currentFilter = 'all';
let isAuthenticated = false;

// ==========================================
// 🔐 AUTHENTICATION
// ==========================================

async function initAuth() {
  const authOverlay = document.getElementById('auth-overlay');
  const mainContent = document.getElementById('main-content');
  const loginBtn = document.getElementById('admin-login-btn');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('admin-error');

  // Attendre Supabase
  let attempts = 0;
  while (!window.BluestiftDB && attempts < 50) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }

  if (!window.BluestiftDB) {
    errorMsg.textContent = '❌ Connection error. Please refresh the page.';
    errorMsg.style.display = 'block';
    return;
  }

  // Vérifier si déjà connecté
  try {
    const user = await window.BluestiftDB.getCurrentUser();
    const isAdmin = await window.BluestiftDB.isAdmin();

    if (user && isAdmin) {
      console.log('✅ Already authenticated');
      isAuthenticated = true;
      authOverlay.style.display = 'none';
      mainContent.style.display = 'block';
      
      const emailDisplay = document.getElementById('admin-email-display');
      if (emailDisplay) {
        emailDisplay.textContent = user.email;
      }
      
      await loadDashboard();
      return;
    }
  } catch (error) {
    console.log('Not authenticated yet');
  }

  authOverlay.style.display = 'flex';
  mainContent.style.display = 'none';

  async function attemptLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      errorMsg.textContent = '⚠️ Please fill all fields';
      errorMsg.style.display = 'block';
      return;
    }

    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;
    errorMsg.style.display = 'none';

    try {
      const user = await window.BluestiftDB.loginAdmin(email, password);
      
      console.log('✅ Admin authenticated');
      isAuthenticated = true;
      
      authOverlay.style.display = 'none';
      mainContent.style.display = 'block';
      
      const emailDisplay = document.getElementById('admin-email-display');
      if (emailDisplay) {
        emailDisplay.textContent = user.email;
      }
      
      await loadDashboard();
      
    } catch (error) {
      errorMsg.textContent = `❌ ${error.message}`;
      errorMsg.style.display = 'block';
      loginBtn.textContent = 'Sign In';
      loginBtn.disabled = false;
    }
  }

  loginBtn.addEventListener('click', attemptLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
  if (confirm('🚪 Logout from admin panel?')) {
    await window.BluestiftDB.logout();
    location.reload();
  }
});

// ==========================================
// 🚀 INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Admin Dashboard loading...');
  
  await initAuth();
  
  if (isAuthenticated) {
    initTabs();
    initFilters();
    initModalListeners();
  }
});

// ==========================================
// 📊 CHARGER LE DASHBOARD
// ==========================================

async function loadDashboard() {
  try {
    await updateContributionStats();
    await displayContributions();
  } catch (error) {
    console.error('❌ Dashboard loading error:', error);
    showNotification('❌ Error loading dashboard', 'error');
  }
}

// ==========================================
// 📈 METTRE À JOUR LES STATISTIQUES
// ==========================================

async function updateContributionStats() {
  try {
    const stats = await window.BluestiftDB.getStats();
    
    document.getElementById('stat-pending').textContent = stats.contributions.pending;
    document.getElementById('stat-approved').textContent = stats.contributions.approved;
    document.getElementById('stat-rejected').textContent = stats.contributions.rejected;
    document.getElementById('stat-total').textContent = stats.contributions.total;
    
    console.log('✅ Stats updated');
  } catch (error) {
    console.error('❌ Stats update error:', error);
  }
}

// ==========================================
// 🔑 GÉNÉRER DES SIGNED URLs POUR FICHIERS
// ==========================================

async function getSignedUrlsForContribution(contribution) {
  const files = contribution.contribution_files || [];
  
  for (let file of files) {
    try {
      const { data, error } = await window.BluestiftDB.supabase.storage
        .from('Contribute')
        .createSignedUrl(file.file_path, 3600); // Valide 1h
      
      if (!error && data) {
        file.signed_url = data.signedUrl;
        console.log(`✅ Signed URL created for: ${file.file_name}`);
      } else {
        console.error('❌ Signed URL failed for:', file.file_name, error);
        file.signed_url = '#';
      }
    } catch (err) {
      console.error('❌ Error generating signed URL:', err);
      file.signed_url = '#';
    }
  }
  
  return contribution;
}

// ==========================================
// 📋 AFFICHER LES CONTRIBUTIONS
// ==========================================

async function displayContributions() {
  const container = document.getElementById('contributions-list');
  
  try {
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading...</p></div>';
    
    let contributions = await window.BluestiftDB.getAllContributions(
      currentFilter === 'all' ? null : currentFilter
    );
    
    container.innerHTML = '';
    
    if (contributions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No contributions</h3>
          <p>${currentFilter === 'all' ? 'No contributions found' : 'No ' + currentFilter + ' contributions'}</p>
        </div>
      `;
      return;
    }
    
    contributions.sort((a, b) => {
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });
    
    // ✅ NOUVEAU: Générer des URLs signées pour chaque contribution
    console.log('🔑 Generating signed URLs for files...');
    for (let contrib of contributions) {
      await getSignedUrlsForContribution(contrib);
    }
    
    contributions.forEach(contrib => {
      const card = createContributionCard(contrib);
      container.appendChild(card);
    });
    
    console.log(`✅ ${contributions.length} contributions displayed`);
    
  } catch (error) {
    console.error('❌ Contributions display error:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
        <h3>Error loading contributions</h3>
        <p>${error.message}</p>
        <button onclick="displayContributions()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
}

// ==========================================
// 🎨 CRÉER UNE CARTE DE CONTRIBUTION
// ==========================================

function createContributionCard(contrib) {
  const card = document.createElement('div');
  card.className = 'contribution-card';
  card.setAttribute('data-id', contrib.id);
  card.setAttribute('data-status', contrib.status);
  
  const date = new Date(contrib.submitted_at);
  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const categoryIcons = {
    'mathematiques': 'fa-calculator',
    'sciences': 'fa-flask',
    'langues': 'fa-language',
    'informatique': 'fa-laptop-code',
    'histoire': 'fa-landmark',
    'arts': 'fa-palette'
  };
  
  const categoryIcon = categoryIcons[contrib.category] || 'fa-book';
  
  // ✅ CORRECTION: Utiliser signed_url au lieu de file_url
  const files = contrib.contribution_files || [];
  const filesHTML = files.map(file => `
    <div class="file-item">
      <i class="fas fa-file-pdf"></i>
      <span>${file.file_name}</span>
      <a href="${file.signed_url || '#'}" target="_blank" ${!file.signed_url || file.signed_url === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
        <i class="fas fa-external-link-alt"></i> View
      </a>
    </div>
  `).join('');
  
  const statusBadges = {
    'pending': '<span class="badge badge-pending">Pending</span>',
    'approved': '<span class="badge badge-approved">✓ Approved</span>',
    'rejected': '<span class="badge badge-rejected">✗ Rejected</span>'
  };
  
  const actions = contrib.status === 'pending' ? `
    <button class="btn btn-approve" onclick="handleApprove(${contrib.id})">
      <i class="fas fa-check"></i>
      Approve
    </button>
    <button class="btn btn-reject" onclick="handleReject(${contrib.id})">
      <i class="fas fa-times"></i>
      Reject
    </button>
  ` : contrib.status === 'rejected' && contrib.rejection_reason ? `
    <div style="background: #fee2e2; padding: 10px; border-radius: 8px; margin-top: 10px;">
      <strong>Rejection reason:</strong> ${contrib.rejection_reason}
    </div>
  ` : '';
  
  card.innerHTML = `
    <div class="contribution-header">
      <div>
        <h3 class="contribution-title">
          <i class="fas ${categoryIcon}"></i> ${contrib.title}
        </h3>
        <div class="contribution-meta">
          <span>
            <i class="fas fa-user"></i>
            ${contrib.contributor_name}
          </span>
          <span>
            <i class="fas fa-envelope"></i>
            ${contrib.email}
          </span>
          <span>
            <i class="fas fa-calendar"></i>
            ${dateStr}
          </span>
        </div>
      </div>
      <div>
        ${statusBadges[contrib.status]}
        <span class="badge badge-category">${getCategoryLabel(contrib.category)}</span>
      </div>
    </div>
    
    ${contrib.description ? `
      <div class="contribution-description">
        <strong>📝 Description:</strong><br>
        ${contrib.description}
      </div>
    ` : ''}
    
    <div class="contribution-files">
      <h4><i class="fas fa-paperclip"></i> Files (${contrib.file_count})</h4>
      <div class="file-list">
        ${filesHTML || '<p style="color: #999;">No files</p>'}
      </div>
    </div>
    
    <div class="contribution-actions">
      ${actions}
      <button class="btn btn-delete" onclick="handleDelete(${contrib.id})">
        <i class="fas fa-trash"></i>
        Delete
      </button>
    </div>
  `;
  
  return card;
}

// ==========================================
// ✅ APPROUVER UNE CONTRIBUTION
// ==========================================

window.handleApprove = async function(contributionId) {
  console.log('✅ Approving contribution:', contributionId);
  
  if (!confirm('✅ Approve this contribution?\n\nIt will be added to the community library.')) {
    return;
  }
  
  try {
    await window.BluestiftDB.approveContribution(contributionId);
    
    const card = document.querySelector(`[data-id="${contributionId}"]`);
    if (card) {
      card.style.animation = 'fadeOut 0.3s ease';
      setTimeout(async () => {
        await updateContributionStats();
        await displayContributions();
        showNotification('✅ Contribution approved and added to library!', 'success');
      }, 300);
    }
  } catch (error) {
    console.error('❌ Approve error:', error);
    showNotification('❌ Approval failed: ' + error.message, 'error');
  }
}

// ==========================================
// ❌ REJETER UNE CONTRIBUTION
// ==========================================

window.handleReject = function(contributionId) {
  console.log('❌ Rejecting contribution:', contributionId);
  currentContributionId = contributionId;
  const modal = document.getElementById('reject-modal');
  modal.style.display = 'flex';
}

async function confirmReject() {
  const reason = document.getElementById('rejection-reason').value.trim();
  
  if (!confirm('❌ Are you sure you want to reject this contribution?')) {
    return;
  }
  
  try {
    await window.BluestiftDB.rejectContribution(currentContributionId, reason || null);
    
    const card = document.querySelector(`[data-id="${currentContributionId}"]`);
    if (card) {
      card.style.animation = 'fadeOut 0.3s ease';
      setTimeout(async () => {
        await updateContributionStats();
        await displayContributions();
        showNotification('❌ Contribution rejected', 'info');
      }, 300);
    }
    
    closeRejectModal();
    
  } catch (error) {
    console.error('❌ Reject error:', error);
    showNotification('❌ Rejection failed: ' + error.message, 'error');
  }
}

// ==========================================
// 🗑️ SUPPRIMER UNE CONTRIBUTION
// ==========================================

window.handleDelete = async function(contributionId) {
  console.log('🗑️ Deleting contribution:', contributionId);
  
  if (!confirm('⚠️ DELETE this contribution?\n\nThis action is PERMANENT and cannot be undone.')) {
    return;
  }
  
  try {
    await window.BluestiftDB.deleteContribution(contributionId);
    
    const card = document.querySelector(`[data-id="${contributionId}"]`);
    if (card) {
      card.style.animation = 'fadeOut 0.3s ease';
      setTimeout(async () => {
        await updateContributionStats();
        await displayContributions();
        showNotification('🗑️ Contribution deleted permanently', 'info');
      }, 300);
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    showNotification('❌ Deletion failed: ' + error.message, 'error');
  }
}

// ==========================================
// 💬 AFFICHER LES FEEDBACKS
// ==========================================

async function displayFeedbacks() {
  const container = document.getElementById('feedbacks-list');
  
  try {
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading...</p></div>';
    
    const feedbacks = await window.BluestiftDB.getAllFeedbacks();
    
    container.innerHTML = '';
    
    updateFeedbackStats(feedbacks);
    
    if (feedbacks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No feedbacks received</h3>
          <p>Feedbacks will appear here</p>
        </div>
      `;
      return;
    }
    
    feedbacks.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    
    feedbacks.forEach(feedback => {
      const card = createFeedbackCard(feedback);
      container.appendChild(card);
    });
    
    console.log(`✅ ${feedbacks.length} feedbacks displayed`);
    
  } catch (error) {
    console.error('❌ Feedbacks display error:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
        <h3>Error loading feedbacks</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

function updateFeedbackStats(feedbacks) {
  const total = feedbacks.length;
  const avgRating = total > 0 ? (feedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) / total).toFixed(1) : 0;
  const positive = feedbacks.filter(f => parseInt(f.rating) >= 4).length;
  const bugs = feedbacks.filter(f => f.type === 'bug').length;
  
  document.getElementById('stat-feedbacks-total').textContent = total;
  document.getElementById('stat-feedbacks-avg').textContent = avgRating;
  document.getElementById('stat-feedbacks-positive').textContent = positive;
  document.getElementById('stat-feedbacks-bugs').textContent = bugs;
}

function createFeedbackCard(feedback) {
  const card = document.createElement('div');
  card.className = 'feedback-card';
  card.setAttribute('data-id', feedback.id);
  
  const date = new Date(feedback.submitted_at);
  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const stars = '★'.repeat(parseInt(feedback.rating));
  
  const typeLabels = {
    'suggestion': '💡 Suggestion',
    'bug': '🛠 Bug',
    'appreciation': '❤️ Appreciation',
    'feature': '✨ New Feature'
  };
  
  const typeLabel = typeLabels[feedback.type] || feedback.type;
  
  card.innerHTML = `
    <div class="feedback-header">
      <div>
        <h3 class="feedback-title">
          ${typeLabel}
        </h3>
        <div class="feedback-meta">
          <span>
            <i class="fas fa-user"></i>
            ${feedback.name || 'Anonymous'}
          </span>
          ${feedback.email ? `
          <span>
            <i class="fas fa-envelope"></i>
            ${feedback.email}
          </span>
          ` : ''}
          <span>
            <i class="fas fa-calendar"></i>
            ${dateStr}
          </span>
        </div>
      </div>
      <div class="star-rating">
        ${stars}
      </div>
    </div>
    
    <div class="feedback-message">
      <strong>💬 Message:</strong><br>
      ${feedback.message}
    </div>
    
    <div class="feedback-actions">
      <button class="btn btn-delete" onclick="deleteFeedback(${feedback.id})">
        <i class="fas fa-trash"></i>
        Delete
      </button>
    </div>
  `;
  
  return card;
}

window.deleteFeedback = async function(feedbackId) {
  if (!confirm('⚠️ Delete this feedback?\n\nThis action is PERMANENT.')) {
    return;
  }
  
  try {
    await window.BluestiftDB.deleteFeedback(feedbackId);
    
    const card = document.querySelector(`[data-id="${feedbackId}"]`);
    if (card) {
      card.style.animation = 'fadeOut 0.3s ease';
      setTimeout(async () => {
        await displayFeedbacks();
        showNotification('🗑️ Feedback deleted', 'info');
      }, 300);
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    showNotification('❌ Deletion failed', 'error');
  }
}

// ==========================================
// 👥 AFFICHER LA WAITLIST
// ==========================================

async function displayWaitlist() {
  const container = document.getElementById('waitlist-list');
  
  try {
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading...</p></div>';
    
    const [waitlist, stats] = await Promise.all([
      window.BluestiftDB.getWaitlist(),
      window.BluestiftDB.getWaitlistStats()
    ]);
    
    document.getElementById('stat-waitlist-total').textContent = stats.total;
    document.getElementById('stat-waitlist-early').textContent = stats.earlyBirds;
    document.getElementById('stat-waitlist-spots').textContent = stats.spotsLeft;
    
    container.innerHTML = '';
    
    if (waitlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No registrations</h3>
          <p>The waitlist is empty</p>
        </div>
      `;
      return;
    }
    
    const table = document.createElement('div');
    table.style.cssText = 'background: white; padding: 20px; border-radius: 12px; overflow-x: auto;';
    
    let tableHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
            <th style="padding: 12px; text-align: left;">#</th>
            <th style="padding: 12px; text-align: left;">Name</th>
            <th style="padding: 12px; text-align: left;">Email</th>
            <th style="padding: 12px; text-align: left;">Phone</th>
            <th style="padding: 12px; text-align: left;">Interest</th>
            <th style="padding: 12px; text-align: center;">Early Bird</th>
            <th style="padding: 12px; text-align: left;">Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    waitlist.forEach(user => {
      const date = new Date(user.registered_at);
      const dateStr = date.toLocaleDateString('en-US');
      
      const interestLabels = {
        'learning': 'Learning',
        'community': 'Community',
        'rewards': 'Rewards',
        'ai': 'AI (RAYA)',
        'other': 'Other'
      };
      
      tableHTML += `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px;"><strong>${user.position}</strong></td>
          <td style="padding: 12px;">${user.full_name}</td>
          <td style="padding: 12px;">${user.email}</td>
          <td style="padding: 12px;">${user.phone || '-'}</td>
          <td style="padding: 12px;">${interestLabels[user.interest] || user.interest || '-'}</td>
          <td style="padding: 12px; text-align: center;">
            ${user.is_early_bird ? '<span style="color: #f59e0b;">🔥</span>' : '-'}
          </td>
          <td style="padding: 12px;">${dateStr}</td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    table.innerHTML = tableHTML;
    container.appendChild(table);
    
    console.log(`✅ ${waitlist.length} users displayed`);
    
  } catch (error) {
    console.error('❌ Waitlist display error:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
        <h3>Error loading waitlist</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// ==========================================
// 🔧 GESTION DES TABS
// ==========================================

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const tabName = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`tab-${tabName}`).classList.add('active');
      
      if (tabName === 'feedbacks') {
        await displayFeedbacks();
      } else if (tabName === 'waitlist') {
        await displayWaitlist();
      }
    });
  });
}

// ==========================================
// 🔧 GESTION DES FILTRES
// ==========================================

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const status = btn.getAttribute('data-status');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilter = status;
      await displayContributions();
    });
  });
}

// ==========================================
// 🔧 MODAL LISTENERS
// ==========================================

function initModalListeners() {
  document.getElementById('cancel-reject-btn')?.addEventListener('click', closeRejectModal);
  document.getElementById('confirm-reject-btn')?.addEventListener('click', confirmReject);
  
  const modal = document.getElementById('reject-modal');
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeRejectModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeRejectModal();
    }
  });
}

function closeRejectModal() {
  const modal = document.getElementById('reject-modal');
  modal.style.display = 'none';
  document.getElementById('rejection-reason').value = '';
  currentContributionId = null;
}

// ==========================================
// 🔔 NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
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
    maxWidth: '400px'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ==========================================
// 🏷️ HELPER FUNCTIONS
// ==========================================

function getCategoryLabel(category) {
  const labels = {
    'mathematiques': 'Mathematics',
    'sciences': 'Science',
    'langues': 'Languages',
    'informatique': 'Computer Science',
    'histoire': 'History',
    'arts': 'Arts',
    'autre': 'Other'
  };
  return labels[category] || category;
}

// ==========================================
// ✅ SCRIPT CHARGÉ
// ==========================================

console.log('✅ Admin Dashboard v2.1 loaded!');
console.log('🔑 Signed URLs enabled for private bucket');
console.log('☁️ Connected to Supabase');