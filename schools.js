// ==========================================
// SCHOOLS.JS - Dashboard Analytics Logic
// Version: MVP Demo (No Auth)
// Dependencies: schools-utils.js, schools-data.json
// ==========================================

// ==========================================
// GLOBAL STATE
// ==========================================

let currentSchool = null;
let selectedClassName = null;
let mockData = null; // Loaded from JSON

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

  // Load mock data from JSON
  await loadMockData();

  if (!mockData) {
    console.error('❌ Failed to initialize: no mock data');
    return;
  }

  // Load school data
  loadSchoolData();

  // Initialize event listeners
  initEventListeners();

  // Set current date
  if (window.SchoolsUtils) {
    window.SchoolsUtils.updateCurrentDate();
    window.SchoolsUtils.initLanguageSelector();
    window.SchoolsUtils.applyStoredLanguage();
  }

  // Set default year
  const yearSelect = document.getElementById('select-year');
  if (yearSelect) yearSelect.value = '2025-2026';

  // Fix sticky headers positioning
  fixStickyHeaders();

  console.log('✅ Schools Dashboard ready!');
});

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

function loadSchoolData() {
  currentSchool = { ...mockData.school };

  // Update UI
  document.getElementById('school-name').textContent = currentSchool.name;
  document.getElementById('plan-type').textContent = currentSchool.planType;
  document.getElementById('expiry-date').textContent = window.SchoolsUtils?.formatDate(currentSchool.expiryDate) || currentSchool.expiryDate;
  document.getElementById('raya-messages-left').textContent = currentSchool.rayaMessagesLeft;
  document.getElementById('raya-count').textContent = currentSchool.rayaMessagesLeft;
  document.getElementById('contributions-left').textContent = '∞'; // Unlimited contributions

  loadGlobalData();
}

function loadGlobalData() {
  const data = mockData.global;

  document.getElementById('stat-students').textContent = data.students.toLocaleString('en-US');
  document.getElementById('stat-pkm').textContent = data.pkm.toFixed(2);
  document.getElementById('stat-time').textContent = data.avgTime;
  document.getElementById('stat-completion').textContent = data.completion;
  document.getElementById('stat-streak').textContent = `${data.avgStreak} days`;
  document.getElementById('stat-lessons').textContent = data.lessonsCompleted.toLocaleString('en-US');

  document.getElementById('selected-class-text').textContent = 'Global view - Entire school';
  populateSubjectsTable(data.subjects, true);
}

async function loadClassData() {
  if (!isClassSelected()) {
    loadGlobalData();
    return;
  }

  const data = mockData.class;

  document.getElementById('stat-students').textContent = data.students;
  document.getElementById('stat-pkm').textContent = data.pkm.toFixed(2);
  document.getElementById('stat-time').textContent = data.avgTime;
  document.getElementById('stat-completion').textContent = data.completion;
  document.getElementById('stat-streak').textContent = `${data.avgStreak} days`;
  document.getElementById('stat-lessons').textContent = data.lessonsCompleted;

  updateClassDisplay();
  populateSubjectsTable(data.subjects, false);
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
  const dataSource = isGlobal ? mockData.global : mockData.class;
  const subject = dataSource.subjects.find(s => s.name === subjectName);
  if (!subject) return;

  const details = subject.details;

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
    });
  });

  // Chart period buttons
  document.querySelectorAll('.chart-period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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

function handleClassSearch() {
  const searchInput = document.getElementById('class-search-input');
  const className = searchInput?.value.trim();

  if (!className) {
    selectedClassName = null;
    loadGlobalData();
    return;
  }

  selectedClassName = className;
  updateClassDisplay();
  loadClassData();

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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Contributions are unlimited - no decrement needed
    // updateContributionsDisplay(); // Not needed for unlimited

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
// EXPORT FOR DEBUGGING
// ==========================================

window.SchoolsDashboard = {
  loadClassData,
  showSubjectDetails,
  get currentSchool() { return currentSchool; },
  get selectedClassName() { return selectedClassName; },
  prefillContributeForm
};

console.log('📊 Schools.js loaded');
console.log('💡 Debug: window.SchoolsDashboard');
